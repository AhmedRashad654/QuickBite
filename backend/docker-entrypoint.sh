#!/bin/sh

echo "Waiting for postgres to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ Postgres is up and running!"

echo "🚀 Running Knex database migrations..."
npm run migrate:latest

echo "📦 Creating database partitions for orders..."
npm run script:create-partitions

echo "🎬 Starting the QuickBite application..."
exec "$@"