# qt-global-fullstack-challenge

A fullstack application with Next.js frontend and Express backend.

## Prerequisites

- [Docker](https://www.docker.com/get-started) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Running with Docker

### Quick Start

1. Clone the repository and navigate to the project directory:

```bash
cd qt-global-fullstack-challenge
```

2. Build and start all services:

```bash
docker-compose up --build
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/docs

### Environment Setup

The backend uses SQLite for data persistence. The database file is persisted using Docker volumes, so your data will remain even after stopping the containers.

#### Docker Compose Environment Variables

The `NEXT_PUBLIC_API_URL` environment variable controls where the browser sends API requests. You can customize it by creating a `.env` file in the project root:

```bash
# Optional - defaults work for local development
cp .env.example .env
```

**Important**: For local Docker development, `http://localhost:4000` is correct because your browser accesses the backend through Docker's port mapping on your host machine.

For production deployments, change it to your actual API domain:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

#### Backend Configuration (Optional)

For backend-specific configuration, create a `.env` file:

```bash
cp backend/.env.example backend/.env
```

### Docker Commands

**Start services** (with build):

```bash
docker-compose up --build
```

**Start services** (without rebuilding):

```bash
docker-compose up
```

**Start in detached mode** (runs in background):

```bash
docker-compose up -d
```

**Stop services**:

```bash
docker-compose down
```

**View logs**:

```bash
docker-compose logs -f
```

**Rebuild a specific service**:

```bash
docker-compose build backend
docker-compose build frontend
```

### Troubleshooting

**Port conflicts**: If ports 3000 or 4000 are already in use, you can modify the port mappings in `docker-compose.yml`.

**Database issues**: If you need to reset the database, stop the containers and remove the database file:

```bash
docker-compose down
rm backend/prisma/dev.db
docker-compose up --build
```

**Fresh build**: To rebuild everything from scratch:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Development

For local development without Docker:

### Backend

```bash
cd backend
pnpm install
pnpm dev
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Architecture

- **Backend**: Express.js with TypeScript, Prisma ORM, SQLite database
- **Frontend**: Next.js 15 with React 19, TailwindCSS, React Query
- **API**: RESTful endpoints with Swagger documentation
- **Data Verification**: Protobuf-based user verification system
