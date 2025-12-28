# Productos Creados en Magento

## ✅ Productos Disponibles

Se han creado 4 productos de prueba con precios chilenos:

### 1. **Vestido de Verano Emara**
- **SKU:** `vestido-verano-cl`
- **Precio:** $45.990 CLP
- **Stock:** 100 unidades
- **Estado:** Activo y visible

### 2. **Blusa Elegante Emara**
- **SKU:** `blusa-elegante-cl`
- **Precio:** $32.990 CLP
- **Stock:** 50 unidades
- **Estado:** Activo y visible

### 3. **Pantalón de Lino Emara**
- **SKU:** `pantalon-lino-cl`
- **Precio:** $54.990 CLP
- **Stock:** 75 unidades
- **Estado:** Activo y visible

### 4. **Camisa de Algodón Emara**
- **SKU:** `camisa-algodon-cl`
- **Precio:** $39.990 CLP
- **Stock:** 60 unidades
- **Estado:** Activo y visible

## 🔄 Actualizaciones Realizadas

1. ✅ Productos creados en Magento via REST API
2. ✅ Stock asignado a cada producto
3. ✅ Índices reindexados
4. ✅ Caché limpiada
5. ✅ Formato de precio actualizado a formato chileno ($32.990)
6. ✅ Moneda configurada en CLP

## 🌐 Ver los Productos

### En el Frontend (Next.js)
```bash
cd /Users/peterfulle/Desktop/emara/frontend
npm run dev
```

Luego visita: http://localhost:3001

Los productos aparecerán automáticamente en el home.

### En Magento Admin

1. Accede a: http://192.168.100.186/admin_li71oj1
2. Ve a: **Catalog → Products**
3. Verás los 4 productos listados

## 📝 Próximos Pasos Opcionales

Si quieres mejorar los productos:

### Agregar Imágenes
Puedes subir imágenes desde el admin de Magento:
1. Edita el producto
2. Ve a la sección "Images and Videos"
3. Sube la imagen del producto

### Agregar Descripciones
```bash
# Ejemplo para agregar descripción al vestido
curl -X PUT "http://192.168.100.186/rest/V1/products/vestido-verano-cl" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "product": {
      "custom_attributes": [
        {
          "attribute_code": "description",
          "value": "Vestido ligero y elegante perfecto para el verano chileno."
        }
      ]
    }
  }'
```

### Asignar a Categorías
Desde el admin de Magento, edita cada producto y asígnalo a las categorías apropiadas.

## 🎯 Precios Chilenos

Todos los productos usan:
- **Moneda:** CLP (Peso Chileno)
- **Formato:** $45.990 (con punto como separador de miles)
- **Rango de precios:** Entre $32.990 y $54.990

## 📊 Verificación GraphQL

Para verificar que los productos están disponibles:

```bash
curl -X POST "http://192.168.100.186/graphql" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ products(filter: {}, pageSize: 10) { total_count items { name sku price_range { minimum_price { final_price { value currency } } } } } }"
  }'
```

## 🛒 Flujo Completo

Ahora puedes:
1. Ver los productos en el home
2. Hacer clic en un producto
3. Agregar al carrito
4. Ir al checkout
5. Pagar con Webpay Plus

Todo funcionando end-to-end! 🎉
