-- Step 1: Add new columns to comment table
ALTER TABLE `comment` ADD `updated` integer;--> statement-breakpoint
ALTER TABLE `comment` ADD `deleted` integer;--> statement-breakpoint

-- Step 2: Create comment_history table
CREATE TABLE `comment_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comment` text NOT NULL,
	`timestamp` integer NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`comment`) REFERENCES `comment`(`id`) ON UPDATE cascade ON DELETE cascade
);--> statement-breakpoint

-- Step 3: Mark deleted comments (where edit = id, self-reference indicates deletion)
UPDATE `comment`
SET `deleted` = 1
WHERE `edit` = `id`;--> statement-breakpoint

-- Step 4: Clear self-referencing edit field for deleted comments (so they won't be processed as edit chains)
UPDATE `comment`
SET `edit` = NULL
WHERE `edit` = `id`;--> statement-breakpoint

-- Step 5: Create regular table to store the edit chain mapping for efficiency
CREATE TABLE `_edit_chain` AS
WITH RECURSIVE cte AS (
	-- Base case: comments that have no further edits (final versions, including deleted ones with edit=NULL now)
	SELECT `id` AS `old_id`, `id` AS `final_id`, `timestamp`, `content`, `edit`
	FROM `comment`
	WHERE `edit` IS NULL
	
	UNION ALL
	
	-- Recursive case: trace back from final to original through the edit chain
	SELECT c.`id` AS `old_id`, cte.`final_id`, c.`timestamp`, c.`content`, c.`edit`
	FROM `comment` c
	JOIN cte ON c.`edit` = cte.`old_id`
)
SELECT `old_id`, `final_id`, `timestamp`, `content`, `edit`
FROM cte;--> statement-breakpoint

-- Step 6: Migrate old versions to comment_history
INSERT INTO `comment_history` (`comment`, `timestamp`, `content`)
SELECT `final_id`, `timestamp`, `content`
FROM `_edit_chain`
WHERE `edit` IS NOT NULL;--> statement-breakpoint

-- Step 7: Update timestamp to original creation time and set updated to current (last edit) time
UPDATE `comment`
SET 
	`updated` = `timestamp`,
	`timestamp` = (
		SELECT MIN(`timestamp`)
		FROM `_edit_chain`
		WHERE `final_id` = `comment`.`id`
	)
WHERE `edit` IS NULL AND `id` IN (
	SELECT DISTINCT `final_id`
	FROM `_edit_chain`
	WHERE `old_id` != `final_id`
);--> statement-breakpoint

-- Step 8: Update reply references to point to the final version instead of old versions
UPDATE `comment`
SET `reply` = (
	SELECT `final_id`
	FROM `_edit_chain`
	WHERE `old_id` = `comment`.`reply`
)
WHERE `reply` IN (
	SELECT `old_id`
	FROM `_edit_chain`
	WHERE `old_id` != `final_id`
);--> statement-breakpoint

-- Step 9: Drop helper table
DROP TABLE `_edit_chain`;--> statement-breakpoint

-- Step 10: Delete old comment versions (comments that were edited into newer versions)
DELETE FROM `comment`
WHERE `edit` IS NOT NULL;--> statement-breakpoint

-- Step 11: Drop the edit column
ALTER TABLE `comment` DROP COLUMN `edit`;