ALTER TABLE `notification` RENAME TO `push_subscription`;--> statement-breakpoint
CREATE TABLE `notification` (
	`comment` text NOT NULL,
	`subscription` integer NOT NULL,
	`timestamp` integer NOT NULL,
	PRIMARY KEY(`comment`, `subscription`),
	FOREIGN KEY (`subscription`) REFERENCES `push_subscription`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_push_subscription` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_push_subscription`("endpoint", "p256dh", "auth") SELECT "endpoint", "p256dh", "auth" FROM `push_subscription`;--> statement-breakpoint
DROP TABLE `push_subscription`;--> statement-breakpoint
ALTER TABLE `__new_push_subscription` RENAME TO `push_subscription`;--> statement-breakpoint
CREATE UNIQUE INDEX `push_subscription_endpoint_unique` ON `push_subscription` (`endpoint`);--> statement-breakpoint
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
DROP TABLE `comment`;--> statement-breakpoint
ALTER TABLE `__new_comment` RENAME TO `comment`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_comment_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comment` text NOT NULL,
	`timestamp` integer NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`comment`) REFERENCES `comment`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_comment_history`("id", "comment", "timestamp", "content") SELECT "id", "comment", "timestamp", "content" FROM `comment_history`;--> statement-breakpoint
DROP TABLE `comment_history`;--> statement-breakpoint
ALTER TABLE `__new_comment_history` RENAME TO `comment_history`;--> statement-breakpoint
DROP INDEX `provider_account`;--> statement-breakpoint
CREATE UNIQUE INDEX `drifter_provider_account_unique` ON `drifter` (`provider`,`account`);