import { sqliteTable, text, integer, unique, primaryKey } from "drizzle-orm/sqlite-core";

export const Drifter = sqliteTable(
	"drifter",
	{
		id: text().primaryKey().notNull(),
		provider: text().notNull(),
		account: text().notNull(),
		access: text().notNull(),
		expire: integer(),
		refresh: text(),
		handle: text(),
		name: text(),
		description: text(),
		image: text(),
		homepage: text()
	},
	table => [unique().on(table.provider, table.account)]
);

export const Comment = sqliteTable("comment", {
	id: text().primaryKey().notNull(),
	section: text().notNull(),
	item: text().notNull(),
	reply: text(),
	timestamp: integer({ mode: "timestamp_ms" }).notNull(),
	updated: integer({ mode: "timestamp_ms" }),
	deleted: integer({ mode: "boolean" }),
	// Store the drifter ID for authenticated users
	drifter: text().references(() => Drifter.id, { onUpdate: "cascade", onDelete: "set null" }),
	// Optional nickname for unauthenticated users
	nickname: text(),
	content: text().notNull()
});

export const CommentHistory = sqliteTable("comment_history", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	// Reference to the original comment ID
	comment: text()
		.notNull()
		.references(() => Comment.id, { onUpdate: "cascade", onDelete: "cascade" }),
	timestamp: integer({ mode: "timestamp_ms" }).notNull(),
	content: text().notNull()
});

export const PushSubscription = sqliteTable("push_subscription", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	endpoint: text().notNull().unique(),
	p256dh: text().notNull(),
	auth: text().notNull()
});

export const Notification = sqliteTable(
	"notification",
	{
		comment: text().notNull(),
		subscription: integer()
			.notNull()
			.references(() => PushSubscription.id, { onUpdate: "cascade", onDelete: "cascade" }),
		timestamp: integer({ mode: "timestamp_ms" }).notNull()
	},
	table => [primaryKey({ columns: [table.comment, table.subscription] })]
);

export const Email = sqliteTable("email", {
	drifter: text()
		.primaryKey()
		.notNull()
		.references(() => Drifter.id, { onUpdate: "cascade", onDelete: "cascade" }),
	address: text().notNull(),
	state: text({ enum: ["pending", "verified", "bounced", "suspended"] }).notNull(),
	notify: integer({ mode: "boolean" }).notNull().default(false)
});
