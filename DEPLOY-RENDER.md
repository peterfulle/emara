# Guía de Despliegue Frontend en Render

## 📋 Requisitos Previos
- Cuenta en Render.com (gratis)
- Repositorio GitHub actualizado
- Backend Magento en AWS funcionando (http://3.235.86.142)

## 🚀 Pasos para Desplegar en Render

### 1. Preparar el Proyecto

El proyecto ya está preparado con:
- ✅ `package.json` con scripts de build
- ✅ `next.config.ts` configurado
- ✅ Variables de entorno en `.env.example`

### 2. Crear Proyecto en Render

1. **Ir a Render:** https://dashboard.render.com/
2. **Clic en "New +"** → **"Web Service"**
3. **Conectar GitHub:**
   - Conectar tu cuenta GitHub
   - Seleccionar repositorio: `peterfulle/emara`
   - Render detectará automáticamente que es un proyecto Next.js

### 3. Configurar el Servicio

**Configuración del Web Service:**

```
Name: emara-frontend
Region: Oregon (o el más cercano a Chile)
Branch: main
Root Directory: frontend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Instance Type: Free (o Starter si necesitas más recursos)
```

### 4. Variables de Entorno

En la sección **Environment** de Render, agregar:

```
NEXT_PUBLIC_API_URL=http://3.235.86.142
NEXT_PUBLIC_BACKEND_URL=http://3.235.86.142
NEXT_PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
NEXT_PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
WEBPAY_COMMERCE_CODE=597055555532
WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
NODE_ENV=production
```

**⚠️ IMPORTANTE para Producción:**
Cuando vayas a producción con clientes reales, reemplaza las credenciales de Webpay con las de producción:
- Obtén tus credenciales reales en: https://portal.transbank.cl/
- Actualiza las variables de entorno en Render

### 5. Habilitar Auto-Deploy

Render desplegará automáticamente cada vez que hagas push a `main`:
- En **Settings** → **Build & Deploy**
- Verificar que "Auto-Deploy" esté en **Yes**

### 6. Desplegar

1. Clic en **"Create Web Service"**
2. Render comenzará el build y deploy (toma ~5-10 minutos)
3. Una vez completado, tendrás una URL: `https://emara.onrender.com`

### 7. Configurar CORS en Magento (AWS)

El backend necesita permitir requests desde Render:

```bash
# Conectar a AWS
ssh -i ~/.ssh/emarakey.pem ubuntu@3.235.86.142

# Editar configuración de Nginx
sudo nano ~/emara/nginx/default.conf

# Agregar en el bloque location /
add_header 'Access-Control-Allow-Origin' 'https://emara.onrender.com' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;

# Reiniciar nginx
cd ~/emara
docker-compose restart web
```

### 8. Verificar Despliegue

- **Frontend:** https://emara.onrender.com
- **Backend API:** http://3.235.86.142/rest/V1/
- **Admin Magento:** http://3.235.86.142/admin_li71oj1

## 🔧 Comandos Útiles

### Ver logs del frontend
```bash
# En Render Dashboard → Logs
```

### Rebuild manual
```bash
# En Render Dashboard → Manual Deploy → "Deploy latest commit"
```

### Actualizar variables de entorno
```bash
# Render Dashboard → Environment → Edit → Save
# Esto triggereará un nuevo deploy automático
```

## 🌐 Dominio Personalizado (Opcional)

Si tienes un dominio (ej: emara.cl):

1. **En Render:**
   - Settings → Custom Domains
   - Agregar tu dominio: `www.emara.cl` y `emara.cl`

2. **En tu proveedor DNS:**
   - Agregar registro CNAME: `www` → `emara.onrender.com`
   - Agregar registro A: `@` → IP que Render te proporcione

3. **SSL automático:** Render configurará SSL/HTTPS gratis con Let's Encrypt

## 📊 Monitoreo

Render Dashboard muestra:
- **Logs en tiempo real**
- **Métricas de CPU/memoria**
- **Estado del servicio**
- **Historial de deploys**

## 🚨 Troubleshooting

### Build falla
- Verificar logs en Render
- Asegurar que `npm run build` funciona localmente
- Verificar Node version en `package.json`

### Frontend no se conecta al backend
- Verificar variables de entorno en Render
- Verificar CORS en Magento
- Verificar firewall AWS Lightsail (puerto 80 abierto)

### Webpay no funciona
- Verificar que las credenciales están correctas
- Para producción, usar credenciales reales de Transbank
- Verificar logs de la API `/api/webpay`

## 🎯 Próximos Pasos

Una vez desplegado:

1. ✅ Configurar dominio personalizado
2. ✅ Configurar HTTPS en AWS Lightsail (opcional)
3. ✅ Actualizar credenciales Webpay a producción
4. ✅ Configurar backups automáticos en AWS
5. ✅ Monitorear performance con Render Analytics
6. ✅ Configurar notificaciones de deploy en Slack/Email

## 💰 Costos Estimados

- **Render (Frontend):** $0/mes (tier gratuito) o $7/mes (Starter)
- **AWS Lightsail (Backend):** $40/mes (8GB RAM)
- **Total:** ~$40-47/mes

---

¿Necesitas ayuda? Revisa los logs en Render o AWS para diagnosticar problemas.
