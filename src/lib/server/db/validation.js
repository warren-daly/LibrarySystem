// zodSchemas.ts
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { book } from './schema.js';

export const selectBookSchema = createSelectSchema(book);

export const insertBookSchema = createInsertSchema(book, {
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().optional(),
  genre: z.string().min(1, 'Genre is required'),
  price: z.number().int().min(1, 'Price must be at least 1 cent'),
  image: z.string().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
});

export const updateBookSchema = insertBookSchema
  .partial()
  .omit({
    id: true,
});

export const deleteBookSchema = z.object({
  id: z.number().int().positive()
});

