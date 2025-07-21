CREATE TABLE `comment` (
	`id` text PRIMARY KEY NOT NULL,
	`section` text NOT NULL,
	`item` text NOT NULL,
	`reply` text,
	`edit` text,
	`timestamp` integer NOT NULL,
	`drifter` text,
	`content` text NOT NULL,
	FOREIGN KEY (`drifter`) REFERENCES `drifter`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `drifter` (
	`id` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`account` text NOT NULL,
	`access` text NOT NULL,
	`expire` integer,
	`refresh` text,
	`handle` text,
	`name` text,
	`description` text,
	`image` text,
	`email` text,
	`homepage` text,
	`notify` integer,
	`lock` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_account` ON `drifter` (`platform`,`account`);--> statement-breakpoint
CREATE TABLE `notification` (
	`drifter` text NOT NULL,
	`locale` text NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	PRIMARY KEY(`drifter`, `endpoint`),
	FOREIGN KEY (`drifter`) REFERENCES `drifter`(`id`) ON UPDATE cascade ON DELETE cascade
);
