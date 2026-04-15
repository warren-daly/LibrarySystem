import { bookDataAccess} from '../data-access/books-data-access.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { insertBookSchema, updateBookSchema, deleteBookSchema } from '../db/validation.js';

export const bookService = {

  async getBookById(id) {
    const book = await bookDataAccess.findById(id);

    if (!book)
      throw new NotFoundError('Book not found');

    return book;
  },

  async getBookByTitle(title) {
    const book = await bookDataAccess.findByTitle(title);

    if (!book)
      throw new NotFoundError('Book not found');

    return book;
  },

  async getAllBooks() {
    return bookDataAccess.findAll();
  },

  async getBooksByGenre(genre) {
    return bookDataAccess.findByGenre(genre);
  },

  async createBook(bookData) {

    const validated = insertBookSchema.parse(bookData);

    return bookDataAccess.create(validated);
  },

  async updateBook(id, bookData) {

    const validated = updateBookSchema.parse(bookData);

    const updated = await bookDataAccess.update(id, validated);

    if (!updated)
      throw new NotFoundError('Book not found after update');

    return updated;
  },

  async deleteBook(id) {

    const validated = deleteBookSchema.parse({ id });

    const deleted = await bookDataAccess.delete(validated.id);

    if (!deleted)
      throw new NotFoundError('Book not found to delete');

    return deleted;
  }
};