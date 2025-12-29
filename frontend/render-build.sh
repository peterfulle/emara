#!/bin/bash

echo "🔧 Configurando Prisma para PostgreSQL..."

# Si DATABASE_URL no está configurado, usar PostgreSQL por defecto
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️ DATABASE_URL no configurado, usando SQLite"
else
    echo "✅ DATABASE_URL configurado, usando PostgreSQL"
    
    # Actualizar el schema para usar PostgreSQL
    sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
fi

echo "📦 Generando Prisma Client..."
npx prisma generate

echo "🗄️ Ejecutando migraciones..."
npx prisma migrate deploy

echo "🏗️ Build de Next.js..."
npm run build

echo "✅ Build completado"
