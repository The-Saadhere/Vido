# Vido

A full-stack video-sharing platform built with Next.js, where users can register, upload videos, and watch content in a clean, responsive interface.

## What It Does

Vido is a YouTube-inspired application that lets users:

- Create an account and log in securely
- Upload videos with automatic thumbnail generation
- Browse and watch uploaded videos
- View their own uploaded content

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Framework     | Next.js 16 (App Router)            |
| Language      | TypeScript                          |
| UI            | React 19, Tailwind CSS, DaisyUI    |
| Database      | MongoDB with Mongoose               |
| Authentication| NextAuth.js (JWT strategy)         |
| Video Hosting | ImageKit                            |
| Icons         | Lucide React                        |
| Password Hashing | bcryptjs                        |

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth/              # NextAuth + registration endpoints
│   │   ├── upload-auth/       # ImageKit upload authentication
│   │   └── videos/            # Video CRUD endpoints
│   ├── components/            # Shared UI components
│   ├── signIn/                # Sign-in page
│   ├── signUp/                # Sign-up page
│   └── upload-video/          # Video upload page
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── db.ts                  # MongoDB connection with caching
│   └── api-client.ts          # API utility functions
├── Models/
│   ├── User.ts                # User schema (email, password)
│   └── Video.ts               # Video schema (title, description, URLs, transforms)
└── public/                    # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- ImageKit account

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### Installation

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Routes

| Method | Endpoint             | Description                  |
|--------|----------------------|------------------------------|
| GET    | /api/videos          | Fetch all videos             |
| POST   | /api/videos          | Create a new video (auth required) |
| POST   | /api/auth/register   | Register a new user          |
| POST   | /api/auth/[...nextauth] | NextAuth sign-in/sign-out |

## License

This project is for educational purposes.
