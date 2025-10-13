# Database Setup Guide

## Step 1: Check PostgreSQL Installation

First, check if PostgreSQL is installed and running:

```bash
sudo systemctl status postgresql
```

If it's not running, start it:

```bash
sudo systemctl start postgresql
```

## Step 2: Create PostgreSQL User

Switch to the postgres user and create your database user:

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside PostgreSQL prompt, run:
CREATE USER user WITH PASSWORD 'your_password';
ALTER USER user WITH SUPERUSER;
\q
```

Or do it in one command:

```bash
sudo -u postgres createuser -s user
```

## Step 3: Create Database

Now create the database:

```bash
createdb vibesync
```

## Step 4: Run Schema

Apply the database schema:

```bash
psql vibesync < backend/db/schema.sql
```

## Step 5: Create .env File

Create your `.env` file:

```bash
cp .env.example .env
```

Then edit `.env` and update the DATABASE_URL if needed:

```
DATABASE_URL=postgresql://user@localhost:5432/vibesync
JWT_SECRET=change-this-to-a-random-secret-key
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev
```

## Step 6: Start Backend

Start the backend server:

```bash
bunx rork backend -p 7omq16pafeyh8vedwdyl6
```

## Alternative: Use Docker PostgreSQL

If you prefer Docker:

```bash
# Start PostgreSQL in Docker
docker run --name vibesync-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=vibesync \
  -p 5432:5432 \
  -d postgres:15

# Wait a few seconds for it to start, then run schema
psql postgresql://user:password@localhost:5432/vibesync < backend/db/schema.sql
```

Then update your `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/vibesync
```

## Troubleshooting

### Error: role "user" does not exist

This means PostgreSQL doesn't have a user named "user". Follow Step 2 above.

### Error: connection refused

PostgreSQL is not running. Start it with:

```bash
sudo systemctl start postgresql
```

### Error: database "vibesync" does not exist

Create the database first:

```bash
createdb vibesync
```
