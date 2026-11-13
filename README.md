# Ceylon Paradise Tours — Travel Website

A modern, SEO-optimized tour booking website built with Next.js. Features an admin panel for managing packages and destinations, and WhatsApp integration for customer inquiries.

## Features

- **Public Site**: Browse tour packages and destinations with beautiful, responsive design
- **Plan Your Trip**: Customers select multiple destinations and inquire via WhatsApp with pre-filled messages
- **Admin Panel**: Full CRUD for packages and destinations, with image uploads
- **SEO Optimized**: Server-side rendering, auto-generated sitemap, structured data (JSON-LD), meta tags
- **WhatsApp Integration**: Pre-filled inquiry messages that open directly in WhatsApp

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite (dev) / MySQL (production on Hostinger)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Hostinger Managed Node.js Hosting

## Quick Start (Local Development)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd travel-tour

# 2. Install dependencies
npm install

# 3. Copy environment file and edit it
cp .env.example .env
# Edit .env with your WhatsApp number, admin credentials, etc.

# 4. Set up database, generate Prisma client, and seed sample data
npm run setup

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

**Default admin login:** `admin@demo.com` / `admin123`

## Deploy to Hostinger

### Option A: Managed Node.js Hosting (Recommended)

1. Push code to GitHub
2. In hPanel: **Websites > Add Website > Node.js Web App**
3. Connect your GitHub repo
4. Set environment variables in hPanel:
   - `DATABASE_URL` = your MySQL connection string (from hPanel > Databases)
   - `NEXTAUTH_SECRET` = random string (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = `https://yourdomain.com`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = your WhatsApp business number
   - `NEXT_PUBLIC_SITE_NAME` = your business name
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
5. Set build command: `npm run build`
6. Set start command: `npm start`

### Switch to MySQL for Production

1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="mysql://username:password@host:3306/database_name"
   ```
3. Run `npx prisma db push` to create tables
4. Run `npm run seed` to add admin user and sample data

### After Deployment

1. **Google Search Console**: Add your site and submit the sitemap at `https://yourdomain.com/sitemap.xml`
2. **Google Business Profile**: Create one for local SEO
3. **Update contact info**: Edit phone numbers, email, and address in the footer and contact page components

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── packages/      # Tour packages listing & detail
│   │   ├── destinations/  # Destinations listing & detail
│   │   ├── plan/          # Multi-destination picker + WhatsApp
│   │   ├── about/         # About page
│   │   └── contact/       # Contact page
│   ├── admin/             # Admin panel (protected)
│   │   ├── dashboard/     # Overview stats
│   │   ├── packages/      # CRUD packages
│   │   └── destinations/  # CRUD destinations
│   ├── api/               # API routes
│   ├── sitemap.ts         # Auto-generated sitemap
│   └── robots.ts          # Robots.txt
├── components/            # Reusable UI components
├── lib/                   # Database, auth, helpers
└── prisma/
    ├── schema.prisma      # Database schema
    └── seed.ts            # Sample data seeder
```

## Customization

- **Colors**: Edit `tailwind.config.ts` — change `primary` and `accent` color palettes
- **WhatsApp Number**: Update `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env`
- **Site Name**: Update `NEXT_PUBLIC_SITE_NAME` in `.env`
- **Contact Info**: Edit `src/components/Footer.tsx` and `src/app/(public)/contact/page.tsx`
- **Destination Categories**: Edit the `CATEGORIES` array in `src/components/DestinationForm.tsx`
