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

export const updateUserSchema = adminInsertUserSchema
  .partial()
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    emailVerified: true
  });

export const deleteUserSchema = z.object({
  id: z.number().int().positive()
});

export const registerAuthSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dob: z.string().min(1, 'Date of birth is required').nullable().optional()
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  dob: z.string().min(1, 'Date of birth is required').nullable().optional()
});

export const idSchema = z.object({
  id: z.number().int().positive()
});


export const selectBookSchema = createSelectSchema(book);

export const insertBookSchema = createInsertSchema(book, {
	title: z.string().min(1, 'Title is required'),
	author: z.string().min(1, 'Author is required'),
	description: z.string().optional(),
	genre: z.string().min(1, 'Genre is required'),
	price: z.number().int().min(1, 'Price must be at least 1 cent'),
	image: z.string().optional(),
	stock: z.number().int().min(0, 'Stock cannot be negative')
});

export const updateBookSchema = insertBookSchema.partial().omit({
	id: true
});

export const deleteBookSchema = z.object({
	id: z.number().int().positive()
});

