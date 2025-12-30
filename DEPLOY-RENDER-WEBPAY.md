# Despliegue en Render - Emara con Webpay Plus

## 📋 Prerequisitos

1. Cuenta en [Render.com](https://render.com)
2. Repositorio en GitHub con el código
3. Credenciales de Transbank (Código de Comercio y API Key)

## 🚀 Pasos para Deploy

### 1. Preparar el Repositorio

```bash
# Hacer commit de todos los cambios
cd /Users/peterfulle/Desktop/emara
git add .
git commit -m "feat: Agregar integración Webpay Plus con seguimiento de transacciones"
git push origin main
```

### 2. Configurar Base de Datos PostgreSQL en Render

1. Ir a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" → "PostgreSQL"
3. Configurar:
   - **Name**: `emara-db`
   - **Database**: `emara`
   - **User**: `emara`
   - **Region**: `Oregon (US West)`
   - **Plan**: `Free`
4. Click "Create Database"
5. Copiar la **Internal Database URL** (la necesitarás después)

### 3. Desplegar Frontend (Next.js)

1. En Render Dashboard, click "New +" → "Web Service"
2. Conectar tu repositorio GitHub `peterfulle/emara`
3. Configurar:
   - **Name**: `emara-frontend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Runtime**: `Node`
   - **Build Command**: `chmod +x ./render-build.sh && ./render-build.sh`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. **Variables de Entorno** (Environment):
   ```
   NODE_ENV=production
   DATABASE_URL=<Pegar Internal Database URL de PostgreSQL>
   JWT_SECRET=<Generar secreto aleatorio fuerte>
   NEXT_PUBLIC_WEBPAY_URL=https://emara-webpay.onrender.com
   NEXT_PUBLIC_APP_URL=https://emara-frontend.onrender.com
   ```

5. Click "Create Web Service"

### 4. Desplegar Servidor Webpay (Python)

1. En Render Dashboard, click "New +" → "Web Service"
2. Conectar el mismo repositorio
3. Configurar:
   - **Name**: `emara-webpay`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `webpay-server`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: `Free`

4. **Variables de Entorno** (Environment):
   ```
   TRANSBANK_COMMERCE_CODE=597055555532
   TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
   TRANSBANK_ENVIRONMENT=INTEGRACION
   BASE_URL=https://emara-frontend.onrender.com
   PORT=5000
   ```

5. Click "Create Web Service"

### 5. Migrar Base de Datos

Una vez que el frontend esté desplegado:

1. Ir al servicio `emara-frontend` en Render
2. Click en "Shell" (terminal)
3. Ejecutar:
   ```bash
   cd /opt/render/project/src/frontend
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 6. Crear Usuario Admin

En el Shell del frontend:
```bash
node scripts/create-admin.ts
```

## 🔐 Cambiar a Producción de Transbank

Cuando Transbank apruebe tu integración:

1. Ve al servicio `emara-webpay` en Render
2. Actualiza las variables de entorno:
   ```
   TRANSBANK_COMMERCE_CODE=597053036691
   TRANSBANK_API_KEY=<API Key de Producción>
   TRANSBANK_ENVIRONMENT=PRODUCCION
   ```
3. Click "Save Changes" (se reiniciará automáticamente)

## 📝 URLs Finales

- **Frontend**: `https://emara-frontend.onrender.com`
- **Webpay Server**: `https://emara-webpay.onrender.com`
- **Admin Panel**: `https://emara-frontend.onrender.com/admin/login`

## ⚠️ Consideraciones de Render Free Tier

- Los servicios se duermen después de 15 minutos de inactividad
- Primera petición después de dormir tarda ~30 segundos
- Base de datos PostgreSQL tiene 90 días de retención
- Para mantener activo, considera usar un servicio de "ping" como UptimeRobot

## 🔧 Solución de Problemas

### Error de migración de base de datos
```bash
# En Shell del frontend
npx prisma migrate reset --force
npx prisma migrate deploy
```

### Variables de entorno no actualizadas
- Después de cambiar variables, hacer "Manual Deploy" en Render

### Logs
- Cada servicio tiene una pestaña "Logs" en Render
- Ver logs en tiempo real para debugging

## 📧 Soporte

Email de contacto Transbank: carolinasaezcanales@gmail.com
Código de Comercio Producción: 597053036691
