import { bookService } from '$lib/server/services/books-service.js';
import { fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

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
      const title = (formData.get('title') ?? '').trim();
      const author = (formData.get('author') ?? '').trim();
      const imageFile = formData.get('image');

      if (!imageFile || !(imageFile instanceof File)) {
        return fail(400, { errors: { image: 'Please select a valid image file' } });
      }

      // Check for duplicate
      const allBooks = await bookService.getAllBooks();
      const duplicate = allBooks.some(
        (b) => b.title.toLowerCase() === title.toLowerCase() &&
               b.author.toLowerCase() === author.toLowerCase()
      );
      if (duplicate) {
        return fail(400, { errors: { general: 'A book with this title and author already exists.' } });
      }

      // Save the image file
      const uploadsDir = join(process.cwd(), 'static/uploads');
      mkdirSync(uploadsDir, { recursive: true });
      
      const fileExtension = imageFile.name.split('.').pop();
      const filename = `${uuidv4()}.${fileExtension}`;
      const filepath = join(uploadsDir, filename);
      
      const buffer = await imageFile.arrayBuffer();
      writeFileSync(filepath, Buffer.from(buffer));

      const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        description: formData.get('description'),
        genre: formData.get('genre'),
        image: filename, // Store just the filename
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock'))
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
      const title = (formData.get('title') ?? '').trim();
      const author = (formData.get('author') ?? '').trim();
      const imageFile = formData.get('image');

      const existingBook = await bookService.getBookById(id);
      if (!existingBook) {
        return fail(404, {
          errors: { general: 'Book not found' }
        });
      }

      const allBooks = await bookService.getAllBooks();
      const duplicate = allBooks.some(
        (b) => b.id !== id &&
               b.title.toLowerCase() === title.toLowerCase() &&
               b.author.toLowerCase() === author.toLowerCase()
      );
      if (duplicate) {
        return fail(400, { errors: { general: 'A book with this title and author already exists.' } });
      }

      let filename = existingBook.image;

      // If a new image is provided, save it
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const uploadsDir = join(process.cwd(), 'static/uploads');
        mkdirSync(uploadsDir, { recursive: true });
        
        const fileExtension = imageFile.name.split('.').pop();
        filename = `${uuidv4()}.${fileExtension}`;
        const filepath = join(uploadsDir, filename);
        
        const buffer = await imageFile.arrayBuffer();
        writeFileSync(filepath, Buffer.from(buffer));
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