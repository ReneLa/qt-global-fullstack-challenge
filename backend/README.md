# Backend

## Setup

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Setup database
npx prisma migrate dev
npx prisma generate
```

## Run

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

## Scripts

- `pnpm dev` - Start dev server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `npx prisma studio` - Open database GUI
- `npx prisma migrate dev` - Create/apply migrations
- `npx prisma generate` - Regenerate Prisma client

Server runs on `http://localhost:4000`
