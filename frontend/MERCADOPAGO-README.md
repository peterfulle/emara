# Integración de Mercado Pago

## Configuración de Credenciales

### 1. Crear cuenta en Mercado Pago

1. Ve a https://www.mercadopago.cl
2. Crea una cuenta o inicia sesión
3. Ve a "Tu negocio" > "Configuración" > "Credenciales"

### 2. Obtener credenciales de TEST

Para pruebas, necesitas:

- **Public Key** (comienza con `TEST-`)
- **Access Token** (comienza con `TEST-`)

### 3. Configurar variables de entorno

En tu archivo `.env.local`:

```env
# Mercado Pago - Credenciales de TEST
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxx
```

### 4. Tarjetas de prueba

Para hacer pruebas, usa estas tarjetas:

**Visa aprobada:**
- Número: `4509 9535 6623 3704`
- CVV: `123`
- Fecha de vencimiento: Cualquier fecha futura
- Nombre: `APRO`

**Mastercard rechazada:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha de vencimiento: Cualquier fecha futura
- Nombre: `OTHE`

**Más tarjetas:** https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

### 5. Credenciales de PRODUCCIÓN

Cuando estés listo para producción:

1. Ve a "Credenciales de producción"
2. Activa tus credenciales de producción
3. Reemplaza las credenciales TEST por las de producción:

```env
# Mercado Pago - Credenciales de PRODUCCIÓN
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxx
```

### 6. Webhook de notificaciones

1. En el panel de Mercado Pago, ve a "Webhooks"
2. Configura la URL de notificaciones: `https://tudominio.com/api/mercadopago/webhook`
3. Selecciona el evento `payment`

## Flujo de Pago

1. Usuario completa el formulario de checkout
2. Se crea la orden en la base de datos (estado: pending)
3. Se crea una preferencia de pago en Mercado Pago
4. Usuario es redirigido a Mercado Pago para pagar
5. Mercado Pago redirige a `/checkout/success` o `/checkout/failure`
6. Webhook actualiza el estado de la orden automáticamente

## URLs de Retorno

- **Éxito:** `https://tudominio.com/checkout/success?order=ORD-12345`
- **Fallo:** `https://tudominio.com/checkout/failure`
- **Pendiente:** `https://tudominio.com/checkout/pending`

## Estados de Pago

- `pending`: Pago pendiente
- `paid`: Pago aprobado
- `failed`: Pago rechazado

## Estados de Orden

- `pending`: Orden creada, pago pendiente
- `processing`: Pago aprobado, procesando orden
- `shipped`: Orden enviada
- `delivered`: Orden entregada
- `cancelled`: Orden cancelada

## Soporte

Documentación oficial: https://www.mercadopago.com.ar/developers/es/docs
