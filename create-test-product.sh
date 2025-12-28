#!/bin/bash

# Token de admin
TOKEN="eyJraWQiOiIxIiwiYWxnIjoiSFMyNTYifQ.eyJ1aWQiOjEsInV0eXBpZCI6MiwiaWF0IjoxNzY2OTYwMzgwLCJleHAiOjE3NjY5NjM5ODB9.Vp1faRtBWuxV0g90myvm0yEpRdqAjtkU7S-0I1WYjxI"

echo "Creando producto de prueba en Magento..."

# Crear el producto
docker-compose exec -T php bash -c "curl -X POST 'http://localhost/rest/V1/products' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $TOKEN' \
  -d '{
    \"product\": {
      \"sku\": \"vestido-verano-cl\",
      \"name\": \"Vestido de Verano Emara\",
      \"attribute_set_id\": 4,
      \"price\": 45990,
      \"status\": 1,
      \"visibility\": 4,
      \"type_id\": \"simple\",
      \"weight\": 0.5,
      \"extension_attributes\": {
        \"stock_item\": {
          \"qty\": 100,
          \"is_in_stock\": true
        }
      },
      \"custom_attributes\": [
        {
          \"attribute_code\": \"description\",
          \"value\": \"Vestido ligero y elegante perfecto para el verano chileno. Confeccionado en tela suave y transpirable, ideal para días soleados.\"
        },
        {
          \"attribute_code\": \"short_description\",
          \"value\": \"Vestido de verano elegante y cómodo\"
        },
        {
          \"attribute_code\": \"meta_title\",
          \"value\": \"Vestido de Verano Emara\"
        },
        {
          \"attribute_code\": \"meta_description\",
          \"value\": \"Vestido ligero perfecto para el verano\"
        }
      ]
    }
  }'" | jq '.'

echo ""
echo "✅ Producto creado con SKU: vestido-verano-cl"
echo "Precio: $45.990 CLP"
