import { redirect, error, fail } from '@sveltejs/kit';
import { usersDataAccess } from '$lib/server/data-access/users-data-access.js';
import { hashPassword } from 'better-auth/crypto';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/auth/login');
    if (locals.user.role !== 'ADMIN') throw redirect(302, '/');

    const users = await usersDataAccess.findAll();

    return { users };
};

export const actions = {
    deleteAccount: async ({ locals, request }) => {
        if (!locals.user || locals.user.role !== 'ADMIN') throw error(403);

        const data = await request.formData();
        const userId = Number(data.get('userId'));

        if (!userId) return fail(400, { message: 'Invalid user' });

        await usersDataAccess.delete(userId);

        return { success: true };
    },

    changePassword: async ({ locals, request }) => {
        if (!locals.user || locals.user.role !== 'ADMIN') throw error(403);

        const data = await request.formData();
        const userId = Number(data.get('userId'));
        const newPassword = String(data.get('newPassword'));

        if (!userId || !newPassword) return fail(400, { message: 'Invalid data' });

        const hashedPassword = await hashPassword(newPassword);
        await usersDataAccess.updatePassword(userId, hashedPassword);

        return { success: true };
    }
};