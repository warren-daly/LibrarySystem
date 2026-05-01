# Library System

A modern, full-featured library management system built with SvelteKit. Manage books, rentals, purchases, and user accounts with an intuitive interface and powerful backend.

**Live Demo:** [library-system-ten-beryl.vercel.app](https://library-system-ten-beryl.vercel.app)

## Features

### 📚 Book Management
- Browse and search library catalogue
- View detailed book information
- Check book availability and stock levels
- Filter by genre

### 🔄 Rental System
- Rent books for up to 14 days
- Track active and returned rentals
- Late fee management
- Rental history

### 🛒 Shopping Cart & Purchases
- Add books to cart (buy or rent)
- View cart totals
- Complete purchases
- Order history

### 👤 User Authentication
- Secure email/password registration
- Session-based authentication
- User profile management
- Role-based access control (Member/Admin)

### 👨‍💼 Admin Dashboard
- Manage book inventory
- View member statistics
- Monitor rental activity
- User management

### ⭐ Reviews & Ratings
- Leave reviews on rented books
- Rate books (1-5 stars)
- View community ratings

## Tech Stack

- **Frontend:** SvelteKit, Svelte 5, Bootstrap 5
- **Backend:** SvelteKit (SSR)
- **Database:** SQLite (Turso hosted)
- **Authentication:** Better Auth
- **ORM:** Drizzle ORM
- **Deployment:** Vercel
- **Email:** Resend

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Turso account (free tier available at [turso.tech](https://turso.tech))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/EspressoToastie/LibrarySystem.git
cd LibrarySystem
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the project root:

```dotenv
# Database (Turso)
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Authentication
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
ORIGIN=http://localhost:5173

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
```

4. **Set up the database**

First, create tables:
```bash
node -r dotenv/config ./src/lib/server/db/migrate-better-auth.js
node -r dotenv/config ./src/lib/server/db/migrate.js
```

Then seed with sample data:
```bash
node -r dotenv/config ./src/lib/server/db/seed.js
```

5. **Start development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development

### Project Structure

```
src/
├── lib/
│   ├── assets/          # Images, fonts, etc
│   ├── components/      # Reusable Svelte components
│   ├── constants/       # App constants
│   └── server/
│       ├── db/          # Database schemas & migrations
│       ├── email/       # Email service
│       ├── services/    # Business logic
│       └── auth.js      # Better Auth setup
├── routes/
│   ├── api/             # API endpoints
│   ├── auth/            # Authentication routes
│   ├── (protected)/     # Protected routes (require login)
│   └── (public)/        # Public routes
└── app.html             # Root HTML template
```

### Available Commands

```bash
# Development
npm run dev                 # Start dev server
npm run dev -- --open      # Start and open in browser

# Building
npm run build              # Build for production
npm run preview            # Preview production build

# Database
node -r dotenv/config ./src/lib/server/db/migrate.js          # Run migrations
node -r dotenv/config ./src/lib/server/db/seed.js             # Seed sample data

# Testing
npm run test               # Run tests
npm run test:ui            # Run tests with UI
```

## Database

### Architecture

The system uses **Turso** (hosted LibSQL) for production and local SQLite for development.

### Key Tables

- **user** - User accounts and profiles
- **session** - Authentication sessions
- **book** - Book catalogue
- **rental** - Book rental records
- **review** - User reviews and ratings
- **cart** - Shopping cart
- **order** - Purchase orders

### Migrations

Migrations are handled manually through scripts in `src/lib/server/db/`:
- `migrate-better-auth.js` - Creates authentication tables
- `migrate.js` - Creates application tables
- `seed.js` - Seeds sample data

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Select your GitHub repo
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add:
     - `TURSO_DATABASE_URL`
     - `TURSO_AUTH_TOKEN`
     - `BETTER_AUTH_SECRET`
     - `ORIGIN` (your Vercel URL)
     - `RESEND_API_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Configuration

### Better Auth Secret

Generate a secure secret:
```bash
openssl rand -base64 32
```

Or use Node:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Image URLs

Instead of uploading files (which Vercel doesn't support), provide image URLs:
- Use public image hosting (Unsplash, Pexels, Imgur, etc.)
- Or host images on a CDN (Cloudinary, AWS S3, etc.)

## Usage

### For Members

1. **Register** - Create account at `/auth/register`
2. **Browse** - View books in catalogue
3. **Rent** - Rent books for up to 14 days
4. **Purchase** - Buy books through cart
5. **Review** - Leave ratings on returned books

### For Admins

1. **Login** - Access at `/auth/login`
2. **Dashboard** - View admin panel at `/admin`
3. **Manage Books** - Add, edit, delete books
4. **View Members** - See all registered users
5. **Monitor Activity** - Check rentals and purchases

## Troubleshooting

### Database Connection Issues

**Error:** `TURSO_DATABASE_URL is not set`

**Solution:** Ensure `.env` file exists and has correct credentials:
```bash
echo $env:TURSO_DATABASE_URL  # PowerShell
echo $TURSO_DATABASE_URL      # Bash
```

### File Upload Errors on Vercel

**Error:** `mkdir '/var/task/static/uploads'`

**Solution:** Use image URLs instead of file uploads. Vercel is serverless and doesn't support file system writes.

### Auth Endpoint Not Found

**Error:** `[404] POST /api/auth/sign-up/email`

**Solution:** Ensure `src/routes/api/auth/[...rest]/+server.js` exists:
```javascript
import { auth } from '$lib/server/auth.js';

export async function POST({ request }) {
  return auth.handler(request);
}

export async function GET({ request }) {
  return auth.handler(request);
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review error logs in Vercel dashboard

## Roadmap

- [ ] Advanced search and filtering
- [ ] Book recommendations
- [ ] User notifications
- [ ] Multi-branch library support
- [ ] Mobile app
- [ ] Automated late fee calculations
- [ ] Wishlist feature
- [ ] Social sharing

---

**Made with ❤️ for book lovers everywhere**
