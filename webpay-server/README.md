# Webpay Plus - Servidor Python

Servidor Flask para manejar transacciones de Webpay Plus usando el SDK oficial de Transbank.

## Características

- ✅ SDK oficial de Transbank para Python
- ✅ Soporte para ambiente de integración y producción
- ✅ API REST con Flask
- ✅ CORS habilitado para frontend
- ✅ Código de comercio de producción: **597053036691**

## Requisitos

- Python 3.8+
- pip

## Instalación

1. Crear entorno virtual:
```bash
cd webpay-server
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

## Configuración

### Variables de Entorno (.env)

```env
TRANSBANK_COMMERCE_CODE=597053036691
TRANSBANK_API_KEY=tu_api_key_de_produccion
TRANSBANK_ENVIRONMENT=INTEGRACION  # o PRODUCCION
BASE_URL=http://localhost:3001
PORT=5001
DEBUG=True
```

### Ambientes

**Integración (Testing):**
- Código de comercio: 597055555532
- API Key: 579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
- Para pruebas y desarrollo

**Producción:**
- Código de comercio: **597053036691** (tu código)
- API Key: Solicitar a Transbank en soporte@transbank.cl
- Para transacciones reales

## Uso

### Iniciar el servidor

```bash
# Activar entorno virtual
source venv/bin/activate

# Iniciar servidor
python app.py
```

El servidor estará disponible en `http://localhost:5001`

### Script de inicio rápido

```bash
./start-webpay.sh
```

## API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "Webpay Plus Python Server",
  "environment": "INTEGRACION",
  "commerce_code": "597053036691"
}
```

### Crear Transacción
```http
POST /webpay/create
Content-Type: application/json

{
  "orderId": "order_123",
  "amount": 10000,
  "buyOrder": "ORDER-12345",
  "returnUrl": "http://localhost:3001/checkout/webpay/return"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction",
  "token": "01ab89c...",
  "buyOrder": "ORDER-12345",
  "amount": 10000
}
```

### Confirmar Transacción
```http
POST /webpay/commit
Content-Type: application/json

{
  "token": "01ab89c..."
}
```

**Response (Exitoso):**
```json
{
  "success": true,
  "vci": "TSY",
  "amount": 10000,
  "status": "AUTHORIZED",
  "buyOrder": "ORDER-12345",
  "sessionId": "session_order_123_...",
  "cardDetail": {
    "cardNumber": "6623"
  },
  "authorizationCode": "1213",
  "paymentTypeCode": "VN",
  "responseCode": 0,
  "message": "Pago aprobado exitosamente"
}
```

### Obtener Estado
```http
GET /webpay/status?token=01ab89c...
```

## Flujo de Pago

1. **Frontend crea orden** → `/api/orders`
2. **Frontend solicita transacción** → `POST /webpay/create`
3. **Usuario redirigido** → URL de Webpay con token
4. **Usuario paga** → Formulario de Transbank
5. **Transbank redirige** → `returnUrl` con token
6. **Frontend confirma** → `POST /webpay/commit`
7. **Mostrar resultado** → Página de confirmación

## Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 0 | Transacción aprobada |
| -1 | Rechazo de transacción |
| -2 | Transacción debe reintentarse |
| -3 | Error en transacción |
| -4 | Rechazo de transacción |
| -5 | Rechazo por error de tasa |
| -6 | Excede cupo máximo mensual |
| -7 | Excede límite diario por transacción |
| -8 | Rubro no autorizado |

## Testing

### Tarjetas de Prueba (Ambiente de Integración)

**Visa:**
- Número: 4051 8856 0000 0002
- CVV: 123
- Fecha: Cualquier fecha futura

**Mastercard:**
- Número: 5186 0595 0000 0002
- CVV: 123
- Fecha: Cualquier fecha futura

**Redcompra:**
- Número: 4051 8860 0000 0001

**Contraseña para todas:** 123

## Logs

El servidor muestra logs detallados:

```
Creating Webpay transaction:
  Buy Order: ORDER-12345
  Session ID: session_order_123_1735586400.123
  Amount: $10000 CLP
  Return URL: http://localhost:3001/checkout/webpay/return

Transaction created successfully:
  Token: 01ab89c...
  URL: https://webpay3gint.transbank.cl/webpayserver/initTransaction

✓ Payment approved successfully
```

## Troubleshooting

### Error: Module 'transbank' not found
```bash
pip install transbank-sdk
```

### Error: Port 5001 already in use
Cambiar el puerto en `.env`:
```env
PORT=5002
```

### Error de CORS
Verificar que la URL del frontend esté correcta en las configuraciones.

## Documentación Oficial

- [Transbank Developers](https://www.transbankdevelopers.cl)
- [SDK Python](https://github.com/TransbankDevelopers/transbank-sdk-python)
- [Webpay Plus](https://www.transbankdevelopers.cl/producto/webpay)

## Soporte

- **Email:** soporte@transbank.cl
- **Teléfono:** 600 638 6380 (fijo) / 562 2661 2700 (móvil)
- **Slack:** [Transbank Developers](https://transbank-developers.slack.com)

## Pasar a Producción

1. Solicitar API Key de producción a Transbank
2. Actualizar `.env`:
   ```env
   TRANSBANK_ENVIRONMENT=PRODUCCION
   TRANSBANK_API_KEY=tu_api_key_de_produccion
   ```
3. Actualizar `app.py` para usar credenciales de producción
4. Validar integración con Transbank
5. Desplegar en servidor con HTTPS

## Licencia

MIT
