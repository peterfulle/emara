# Integración Webpay Plus - Instrucciones Finales

## ✅ Archivos Creados

Se han creado los siguientes archivos para la integración de Webpay Plus:

1. **Componentes:**
   - `/frontend/components/WebpayPayment.tsx` - Componente de selección de pago Webpay

2. **API Routes:**
   - `/frontend/app/api/webpay/create/route.ts` - Crea transacción Webpay
   - `/frontend/app/api/webpay/commit/route.ts` - Confirma transacción Webpay

3. **Páginas:**
   - `/frontend/app/checkout/webpay/return/page.tsx` - Página de retorno después del pago

4. **Actualizado:**
   - `/frontend/app/checkout/page.tsx` - Integración con Webpay en el flujo de checkout
   - `/frontend/.env.local` - Variables de entorno actualizadas

## 🔧 Configuración Pendiente

### 1. Obtener Token de Admin de Magento

Necesitas obtener un token de administrador para que las API routes puedan comunicarse con Magento:

```bash
# Desde fuera del contenedor
curl -X POST "http://192.168.100.186/rest/V1/integration/admin/token" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

El resultado será un token largo como: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

### 2. Actualizar .env.local

Agrega el token obtenido al archivo `/frontend/.env.local`:

```bash
MAGENTO_ADMIN_TOKEN=tu-token-aqui
```

### 3. Configurar Webpay en Magento Admin

1. Accede al admin: http://192.168.100.186/admin_li71oj1
2. Ve a: **Stores → Configuration → Sales → Payment Methods**
3. Busca **Transbank Webpay Plus**
4. Configura:
   - **Habilitado:** Sí
   - **Ambiente:** Integración (para pruebas)
   - **Título:** Webpay Plus
   - **Código de comercio:** 597055555532 (viene por defecto para pruebas)
   - **Api Key:** 579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C (viene por defecto)
   - **URL de retorno:** `http://localhost:3001/checkout/webpay/return`

5. Guarda la configuración

### 4. Reiniciar el frontend

```bash
cd /Users/peterfulle/Desktop/emara/frontend
npm run dev
```

## 🧪 Pruebas

### Tarjetas de Prueba (Ambiente de Integración)

**Tarjeta de Crédito:**
- Número: `4051885600446623`
- CVV: `123`
- Fecha: cualquier fecha futura
- RUT: `11.111.111-1`

**Tarjeta de Débito:**
- Número: `5186059559590568`
- CVV: `123`
- RUT: `11.111.111-1`

## 📝 Flujo de Pago

1. El usuario llena el formulario de checkout
2. Al hacer clic en "Realizar Pedido":
   - Se crea la orden en Magento
   - Se inicia una transacción con Webpay
   - El usuario es redirigido a la página de Transbank
3. El usuario completa el pago en Transbank
4. Transbank redirige de vuelta a `/checkout/webpay/return`
5. Se confirma la transacción y se muestra el resultado

## 🔐 Seguridad

- El token de admin NUNCA debe exponerse al frontend
- Solo se usa en las API routes (server-side)
- Las transacciones son manejadas por Transbank con encriptación SSL

## 📦 Para Producción

Cuando estés listo para producción:

1. Obtén tu código de comercio y llave secreta real de Transbank
2. En Magento Admin, cambia el ambiente a "Producción"
3. Ingresa tu código de comercio y Api Key reales
4. Actualiza `NEXT_PUBLIC_APP_URL` en `.env.local` con tu dominio real
5. Configura el return URL en Magento con tu dominio de producción

## ❓ Solución de Problemas

Si el pago no funciona:

1. Verifica que el módulo Webpay esté habilitado en Magento
2. Revisa que el token de admin sea válido
3. Verifica las URLs en `.env.local`
4. Revisa los logs del navegador y la consola del servidor
5. Verifica que la configuración de Webpay en Magento sea correcta

## 🎯 Próximos Pasos

1. Obtener el token de admin
2. Actualizar .env.local con el token
3. Configurar Webpay en Magento admin
4. Probar el flujo completo de pago
5. Verificar que las órdenes se creen correctamente en Magento
