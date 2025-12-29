#!/bin/bash
set -e

echo "🔧 Iniciando build..."

# Si no hay DATABASE_URL, crear una temporal para SQLite
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL no encontrada, usando SQLite temporal para build"
  export DATABASE_URL="file:./prisma/dev.db"
fi

echo "📦 Generando Prisma Client..."
npx prisma generate

echo "🏗️  Construyendo Next.js..."
next build

echo "✅ Build completado!"
