import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { book, user } from './schema.js';
import { ROLE_VALUES, ROLES } from '$lib/constants/roles.js';

export const selectUserSchema = createSelectSchema(user);

export const adminInsertUserSchema = createInsertSchema(user, {
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  dob: z.string().min(1, 'Date of birth is required').nullable().optional(),
  role: z.enum(ROLE_VALUES).default(ROLES.USER)
});

