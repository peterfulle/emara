#!/bin/bash

# Obtener token de administrador de Magento
echo "Obteniendo token de administrador..."

TOKEN=$(docker-compose exec -T php bash -c "cd /var/www/html && curl -X POST 'http://localhost/rest/V1/integration/admin/token' \
  -H 'Content-Type: application/json' \
  -d '{\"username\":\"admin\",\"password\":\"Admin123!\"}' 2>/dev/null")

# Limpiar el token (quitar comillas)
TOKEN=$(echo $TOKEN | tr -d '"')

echo ""
echo "Token de administrador:"
echo $TOKEN
echo ""
echo "Agrega este token a tu archivo .env.local:"
echo "MAGENTO_ADMIN_TOKEN=$TOKEN"
