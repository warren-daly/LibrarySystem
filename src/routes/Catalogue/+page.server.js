import { db } from '$lib/server/db';
import { book } from '$lib/server/db/schema';

export async function load() {
	const books = await db.select().from(book);

	return {
		books
	};
}