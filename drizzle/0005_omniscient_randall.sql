CREATE TABLE `email` (
	`drifter` text PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	`state` text NOT NULL,
	`notify` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`drifter`) REFERENCES `drifter`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_address_unique` ON `email` (`address`);--> statement-breakpoint
INSERT INTO `email` (`drifter`, `address`, `state`, `notify`)
SELECT `id`, `email`, 'verified', CASE WHEN `notify` IS NOT NULL THEN `notify` ELSE 0 END
FROM `drifter`
WHERE `email` IS NOT NULL
ON CONFLICT(`address`) DO NOTHING;
--> statement-breakpoint
ALTER TABLE `drifter` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `drifter` DROP COLUMN `notify`;--> statement-breakpoint
ALTER TABLE `drifter` DROP COLUMN `lock`;