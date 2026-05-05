import { bookService } from '$lib/server/services/books-service.js';
import { fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

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

      // Validate image file
      if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
        return fail(400, { errors: { image: 'Please select a valid image file' } });
      }

      // Validate file size (e.g., max 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > MAX_FILE_SIZE) {
        return fail(400, { errors: { image: 'Image must be less than 5MB' } });
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

      try {
        // Convert image file to base64
        const buffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const mimeType = imageFile.type || 'image/png';
        const imageData = `data:${mimeType};base64,${base64Image}`;

        const bookData = {
          title: formData.get('title'),
          author: formData.get('author'),
          description: formData.get('description'),
          genre: formData.get('genre'),
          image: imageData, // Store as data URI
          price: Number(formData.get('price')),
          stock: Number(formData.get('stock'))
        };

        await bookService.createBook(bookData);
        return { success: true };

      } catch (fileError) {
        console.error('Failed to process image:', fileError);
        return fail(500, { errors: { image: 'Failed to process image file' } });
      }

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

      let imageData = existingBook.image;

      // If a new image is provided, convert it to base64
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        // Validate file size
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (imageFile.size > MAX_FILE_SIZE) {
          return fail(400, { errors: { image: 'Image must be less than 5MB' } });
        }

        try {
          const buffer = await imageFile.arrayBuffer();
          const base64Image = Buffer.from(buffer).toString('base64');
          const mimeType = imageFile.type || 'image/png';
          imageData = `data:${mimeType};base64,${base64Image}`;
        } catch (fileError) {
          console.error('Failed to process new image:', fileError);
          return fail(500, { errors: { image: 'Failed to process image file' } });
        }
      }

      const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        description: formData.get('description'),
        genre: formData.get('genre'),
        image: imageData,
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