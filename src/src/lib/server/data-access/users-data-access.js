import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user, account } from '$lib/server/db/auth.schema.js';

export const usersDataAccess = {
	async findById(id) {
		const result = await db.select().from(user).where(eq(user.id, id)).limit(1);
		return result[0] ?? null;
	},

	async findByEmail(email) {
		const result = await db.select().from(user).where(eq(user.email, email)).limit(1);
		return result[0] ?? null;
	},

	async findAll() {
		return await db.select().from(user);
	},

	async update(id, userData) {
		await db.update(user).set(userData).where(eq(user.id, id));
		return await this.findById(id);
	},

	async updatePassword(userId, hashedPassword) {
	    const result = await db
	        .update(account)
	        .set({ password: hashedPassword })
	        .where(eq(account.userId, userId))
	        .returning();
	    return result[0] ?? null;
	},

	async delete(id) {
		const result = await db.delete(user).where(eq(user.id, id));
		return result.rowsAffected > 0;
	}
};