import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Comment } from "$db/schema";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
	const db = drizzle(locals.runtime.env.DB);

	const prefaces = await getCollection("preface");
	const statements = prefaces.map(preface =>
		db.update(Comment).set({ item: preface.id }).where(eq(Comment.item, preface.data.timestamp.toISOString()))
	);

	if (statements.length === 0) return new Response("No content found to migrate.");

	const size = 100;
	let processed = 0;
	let changed = 0;

	for (let i = 0; i < statements.length; i += size) {
		const chunk = statements.slice(i, i + size);
		const results = await db.batch(chunk as any);

		results.forEach(result => {
			changed += result.meta?.changes ?? 0;
		});

		processed += chunk.length;
	}

	return new Response(
		JSON.stringify({
			status: "Success",
			total: prefaces.length,
			processed,
			changed,
			batches: Math.ceil(statements.length / size)
		}),
		{ headers: { "Content-Type": "application/json" } }
	);
};
