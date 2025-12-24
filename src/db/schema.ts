import { sqliteTable, text, integer, unique, foreignKey, primaryKey } from "drizzle-orm/sqlite-core";

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
		email: text(),
		homepage: text(),
		notify: integer(),
		lock: integer()
	},
	table => [unique("provider_account").on(table.provider, table.account)]
);

export const Comment = sqliteTable(
	"comment",
	{
		id: text().primaryKey().notNull(),
		section: text().notNull(),
		item: text().notNull(),
		reply: text(),
		timestamp: integer({ mode: "timestamp_ms" }).notNull(),
		updated: integer({ mode: "timestamp_ms" }),
		deleted: integer({ mode: "boolean" }),
		// Store the drifter ID for authenticated users
		drifter: text(),
		// Optional nickname for unauthenticated users
		nickname: text(),
		content: text().notNull()
	},
	table => [
		foreignKey({
			columns: [table.drifter],
			foreignColumns: [Drifter.id],
			name: "comment_drifter_fkey"
		})
			.onUpdate("cascade")
			.onDelete("set null")
	]
);

export const CommentHistory = sqliteTable(
	"comment_history",
	{
		id: integer().primaryKey({ autoIncrement: true }).notNull(),
		// Reference to the original comment ID
		comment: text().notNull(),
		timestamp: integer({ mode: "timestamp_ms" }).notNull(),
		content: text().notNull()
	},
	table => [
		foreignKey({
			columns: [table.comment],
			foreignColumns: [Comment.id],
			name: "comment_history_comment_fkey"
		})
			.onUpdate("cascade")
			.onDelete("cascade")
	]
);

export const Notification = sqliteTable(
	"notification",
	{
		drifter: text().notNull(),
		locale: text().notNull(),
		endpoint: text().notNull(),
		p256dh: text().notNull(),
		auth: text().notNull()
	},
	table => [
		primaryKey({ columns: [table.drifter, table.endpoint] }),
		foreignKey({
			columns: [table.drifter],
			foreignColumns: [Drifter.id],
			name: "notification_drifter_fkey"
		})
			.onUpdate("cascade")
			.onDelete("cascade")
	]
);
