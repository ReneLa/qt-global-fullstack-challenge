# Backend

Express API server with Prisma ORM and SQLite database.

## Setup

**Requirements:** Node.js 22+ and pnpm

```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Development

```bash
# Start dev server (hot reload)
pnpm dev
```

Server runs on http://localhost:4000

## Production Build

```bash
pnpm build
pnpm start
```

## Useful Commands

```bash
# Open database GUI
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## API Documentation

Once running, visit http://localhost:4000/docs for Swagger docs.

## Key Features

- RESTful user CRUD operations
- Protobuf export endpoint (`/users/export`)
- RSA signature verification
- Weekly stats aggregation
- Request validation with Zod
