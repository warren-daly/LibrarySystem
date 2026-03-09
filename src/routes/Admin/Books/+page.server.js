import { bookService } from '$lib/server/services/books-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import fs from 'fs';
import path from 'path';


const uploadsDir = path.resolve('static/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });


export async function load() {
  try {
    const books = await bookService.getAllBooks();
    return { books };
  } catch (err) {
    console.error('Error retrieving books:', err);
    return fail(500, { err });
  }
}

export const actions = {

  createBook: async ({ request }) => {
    try {
      const formData = await request.formData();
      const file = formData.get('image');
      let filename = '';
      if (file && file.size > 0) {
        filename = `${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      }

      const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        description: formData.get('description'),
        genre: formData.get('genre'),
        image: filename,
        price: Number(formData.get('price')) || 0,
        stock: Number(formData.get('stock')) || 0
      };

      await bookService.createBook(bookData);
      return { success: true };

    } catch (err) {
            console.error('Error creating book:', err);

            if (err instanceof ZodError) {
                const errors = {};
                err.issues.forEach((error) => {
                    const field = error.path[0]?.toString();
                    if (field) {
                        errors[field] = error.message;
                    }
                });
                return fail(400, { errors });
            }

            return fail(500, {
                errors: { general: err instanceof Error ? err.message : 'Failed to create book' }
            });
        }
    },

  updateBook: async ({ request }) => {
    try {
      const formData = await request.formData();
      const id = Number(formData.get('id'));
    
      const existingBook = await bookService.getBookById(id);
      if (!existingBook) {
        return fail(404, {
          errors: { general: 'Book not found' }
        });
      }


      let filename = existingBook.image;

      const file = formData.get('image');
      if (file && file.size > 0) {
        filename = `${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      }

      const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        description: formData.get('description'),
        genre: formData.get('genre'),
        image: filename,
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock'))

      };

      await bookService.updateBook(id, bookData);
      return { success: true };

    } catch (err) {
      console.error('Error updating book:', err);

            if (err instanceof ZodError) {
                const errors = {};
                err.issues.forEach((error) => {
                    const field = error.path[0]?.toString();
                    if (field) {
                        errors[field] = error.message;
                    }
                });
                return fail(400, { errors });
            }

            return fail(500, {
                errors: { general: err instanceof Error ? err.message : 'Failed to update book' }
            });
        }
	},

  deleteBook: async ({ request }) => {
    try {
      const formData = await request.formData();
      const id = Number(formData.get('bookId'));

      await bookService.deleteBook(id);
      return { success: true };

    } catch (err) {
      console.error('Error deleting book:', err);
            if (err instanceof ZodError) {
                const errors = {};
                err.issues.forEach((error) => {
                    const field = error.path[0]?.toString();
                    if (field) {
                        errors[field] = error.message;
                    }
                });
                return fail(400, { errors });
            }

            return fail(500, {
                errors: { general: 'Failed to delete book' }
            });
        }
	}
};