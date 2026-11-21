ALTER TABLE `drifter` RENAME COLUMN "platform" TO "provider";--> statement-breakpoint
DROP INDEX `platform_account`;--> statement-breakpoint
CREATE UNIQUE INDEX `provider_account` ON `drifter` (`provider`,`account`);