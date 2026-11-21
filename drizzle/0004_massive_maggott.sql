CREATE TABLE `push_subscription` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `push_subscription_endpoint_unique` ON `push_subscription` (`endpoint`);--> statement-breakpoint
-- Keep the last registered row for each endpoint so the two credentials stay paired.
INSERT INTO `push_subscription` (`endpoint`, `p256dh`, `auth`)
SELECT `endpoint`, `p256dh`, `auth`
FROM `notification`
WHERE rowid IN (SELECT MAX(rowid) FROM `notification` GROUP BY `endpoint`);--> statement-breakpoint
CREATE TABLE `__new_notification` (
	`comment` text NOT NULL,
	`subscription` integer NOT NULL,
	`timestamp` integer NOT NULL,
	PRIMARY KEY(`comment`, `subscription`),
	FOREIGN KEY (`subscription`) REFERENCES `push_subscription`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
-- Preserve the legacy reply recipients and start the retention window at migration time.
INSERT INTO `__new_notification` (`comment`, `subscription`, `timestamp`)
SELECT `comment`.`id`, `push_subscription`.`id`, unixepoch() * 1000
FROM `comment`
INNER JOIN `notification` ON `notification`.`drifter` = `comment`.`drifter`
INNER JOIN `push_subscription` ON `push_subscription`.`endpoint` = `notification`.`endpoint`;--> statement-breakpoint
DROP TABLE `notification`;--> statement-breakpoint
ALTER TABLE `__new_notification` RENAME TO `notification`;--> statement-breakpoint
CREATE TABLE `__new_comment` (
	`id` text PRIMARY KEY NOT NULL,
	`section` text NOT NULL,
	`item` text NOT NULL,
	`reply` text,
	`timestamp` integer NOT NULL,
	`updated` integer,
	`deleted` integer,
	`drifter` text,
	`nickname` text,
	`content` text NOT NULL,
	FOREIGN KEY (`drifter`) REFERENCES `drifter`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_comment`("id", "section", "item", "reply", "timestamp", "updated", "deleted", "drifter", "nickname", "content") SELECT "id", "section", "item", "reply", "timestamp", "updated", "deleted", "drifter", "nickname", "content" FROM `comment`;--> statement-breakpoint
-- Copy history against the replacement parent before dropping the old tables.
CREATE TABLE `__new_comment_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comment` text NOT NULL,
	`timestamp` integer NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`comment`) REFERENCES `__new_comment`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_comment_history`("id", "comment", "timestamp", "content") SELECT "id", "comment", "timestamp", "content" FROM `comment_history`;--> statement-breakpoint
DROP TABLE `comment_history`;--> statement-breakpoint
DROP TABLE `comment`;--> statement-breakpoint
ALTER TABLE `__new_comment` RENAME TO `comment`;--> statement-breakpoint
ALTER TABLE `__new_comment_history` RENAME TO `comment_history`;--> statement-breakpoint
DROP INDEX `provider_account`;--> statement-breakpoint
CREATE UNIQUE INDEX `drifter_provider_account_unique` ON `drifter` (`provider`,`account`);
