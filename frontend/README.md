# Frontend

Next.js 15 app with React 19 and TailwindCSS.

## Setup

**Requirements:** Node.js 22+ and pnpm

```bash
# Install dependencies
pnpm install
```

## Development

```bash
# Start dev server
pnpm dev
```

App runs on http://localhost:3000

**Note:** Backend must be running on http://localhost:4000

## Production Build

```bash
pnpm build
pnpm start
```

## Key Features

- User management (create, edit, delete)
- Signature verification with protobuf
- Weekly stats dashboard with charts
- Server health monitoring
- Offline detection
- Dark/light theme
- Responsive design

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **UI:** Shadcn UI + TailwindCSS v4
- **State:** React Query + Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
