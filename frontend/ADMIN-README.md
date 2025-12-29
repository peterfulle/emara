# 🛠️ Panel de Administración Emara

Backend administrador moderno construido con Next.js, Prisma y TypeScript.

## 📋 Características

- ✅ Autenticación JWT
- ✅ CRUD completo de productos
- ✅ Gestión de órdenes
- ✅ Gestión de clientes
- ✅ Dashboard con estadísticas
- ✅ Log de actividad
- ✅ SQLite (desarrollo) / PostgreSQL (producción)
- ✅ API REST completa
- ✅ UI minimalista estilo Magento

## 🚀 Instalación Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local

# 3. Ejecutar migraciones
npm run db:migrate

# 4. Crear usuario administrador
npm run db:seed

# 5. Iniciar servidor de desarrollo
npm run dev
```

## 🔑 Credenciales por Defecto

```
Email: admin@emara.cl
Password: Admin123!
```

## 📁 Estructura de la Base de Datos

### Tablas Principales

- **users** - Usuarios administradores
- **products** - Catálogo de productos
- **customers** - Clientes de la tienda
- **orders** - Órdenes de compra
- **order_items** - Items de cada orden
- **addresses** - Direcciones de clientes
- **settings** - Configuración del sitio
- **activity_logs** - Log de actividades

## 🔌 API Endpoints

### Autenticación

```
POST /api/admin/auth/login
Body: { email, password }
Response: { token, user }

GET /api/admin/auth/verify
Headers: Authorization: Bearer <token>
Response: { user }
```

### Productos

```
GET /api/admin/products
Query: page, limit, search, category, active
Headers: Authorization: Bearer <token>
Response: { products[], pagination }

POST /api/admin/products
Headers: Authorization: Bearer <token>
Body: { sku, name, price, category, ... }
Response: { product }

GET /api/admin/products/[id]
Response: { product }

PUT /api/admin/products/[id]
Headers: Authorization: Bearer <token>
Body: { name, price, stock, ... }
Response: { product }

DELETE /api/admin/products/[id]
Headers: Authorization: Bearer <token>
Response: { success }
```

## 🌐 Despliegue en Render

### 1. Crear PostgreSQL Database

1. Ve a Render Dashboard
2. Click en "New +" → "PostgreSQL"
3. Nombre: `emara-db`
4. Plan: Free o Starter
5. Guarda el `DATABASE_URL` interno

### 2. Configurar Web Service

1. Ve a tu servicio `emara-frontend`
2. Environment → Add Environment Variables:

```env
DATABASE_URL=<tu-url-postgresql-de-render>
JWT_SECRET=<genera-un-secreto-seguro-de-32-caracteres>
```

3. Settings → Build & Deploy:
   - Build Command: `./render-build.sh`
   - Start Command: `npm start`

### 3. Generar JWT Secret Seguro

```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Desplegar

```bash
git add .
git commit -m "feat: Panel de administración completo"
git push origin main
```

Render detectará el push y desplegará automáticamente.

### 5. Crear Usuario Admin en Producción

Una vez desplegado, ejecuta en la consola de Render:

```bash
npm run db:seed
```

O conéctate a PostgreSQL y ejecuta:

```sql
INSERT INTO users (id, email, password, name, role, active, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@emara.cl',
  '$2a$12$hash_de_bcrypt_aqui',
  'Administrador',
  'superadmin',
  true,
  NOW(),
  NOW()
);
```

## 📱 Uso del Panel

### Acceder al Panel

```
URL: https://emara-frontend.onrender.com/admin/login
```

### Flujo de Autenticación

1. Ingresar email y contraseña
2. El sistema genera un JWT token
3. Token se guarda en localStorage
4. Todas las peticiones incluyen: `Authorization: Bearer <token>`
5. Token válido por 7 días

### Gestión de Productos

**Listar Productos:**
- Panel: `/admin/products`
- Búsqueda por nombre, SKU o categoría
- Filtros por estado (activo/inactivo)
- Paginación

**Crear Producto:**
```typescript
const product = {
  sku: 'PROD-001',
  name: 'Vestido Elegante',
  description: 'Vestido negro elegante...',
  price: 49990,
  salePrice: 39990, // opcional
  stock: 10,
  images: ['url1.jpg', 'url2.jpg'],
  category: 'vestidos',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Negro', 'Azul'],
  active: true,
  featured: false
}
```

**Actualizar Producto:**
- Solo envía los campos que cambian
- SKU se puede modificar si no existe duplicado
- Actualización de stock en tiempo real

## 🔒 Seguridad

### Passwords

- Hasheadas con bcrypt (12 rounds)
- Nunca se almacenan en texto plano
- Verificación segura con timing-safe comparison

### JWT Tokens

- Algoritmo HS256
- Expiración de 7 días
- Secret almacenado en variable de entorno
- Compatible con Edge Runtime de Next.js

### Authorization

- Todas las rutas `/api/admin/*` requieren autenticación
- Excepto `/api/admin/auth/login`
- Token verificado en cada request
- Usuario debe estar activo

## 📊 Base de Datos

### Desarrollo (SQLite)

```env
DATABASE_URL="file:./dev.db"
```

- Base de datos local en `prisma/dev.db`
- Ideal para desarrollo
- No requiere servidor externo

### Producción (PostgreSQL)

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

- Base de datos PostgreSQL en Render
- Backups automáticos
- Mejor rendimiento para producción

### Comandos Útiles

```bash
# Ver base de datos con UI
npm run db:studio

# Generar nuevo cliente de Prisma
npm run db:generate

# Crear migración
npm run db:migrate

# Push schema sin migración (desarrollo)
npm run db:push
```

## 🎨 Personalización

### Modificar el Schema

1. Edita `prisma/schema.prisma`
2. Ejecuta `npm run db:migrate`
3. Genera el cliente: `npm run db:generate`

### Agregar Nuevas Rutas API

Crea archivo en `app/api/admin/[ruta]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  // Verificar auth
  const token = request.headers.get('authorization')?.substring(7);
  const payload = await verifyToken(token);
  
  if (!payload) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  
  // Tu lógica aquí
  return NextResponse.json({ data: 'tu respuesta' });
}
```

## 🐛 Troubleshooting

### Error: Prisma Client not found

```bash
npm run db:generate
```

### Error: Database not found

```bash
npm run db:migrate
```

### Error: JWT Secret not configured

Agrega `JWT_SECRET` a tu `.env.local` o variables de entorno de Render.

### Error: Cannot connect to database

Verifica que `DATABASE_URL` esté correctamente configurada.

## 📈 Próximas Funcionalidades

- [ ] Gestión de órdenes (crear, actualizar, cancelar)
- [ ] Panel de clientes
- [ ] Subida de imágenes a S3/Cloudinary
- [ ] Reportes y analytics
- [ ] Configuración de sitio (taxes, shipping)
- [ ] Notificaciones por email
- [ ] Roles y permisos granulares
- [ ] Exportación de datos (CSV, Excel)
- [ ] Integración con Webpay (tracking)

## 📝 Licencia

Propietario - Emara Store © 2025
