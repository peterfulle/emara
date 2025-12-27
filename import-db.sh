#!/bin/bash

# Script para importar la base de datos de Magento

echo "🗄️  Importando base de datos de Magento..."

# Verificar que se pasó un archivo
if [ -z "$1" ]; then
    echo "❌ Error: Debes especificar el archivo SQL a importar"
    echo "Uso: ./import-db.sh archivo.sql"
    echo ""
    echo "Ejemplo: ./import-db.sh backups/magento-20250127-120000.sql"
    exit 1
fi

SQLFILE="$1"

# Verificar que el archivo existe
if [ ! -f "$SQLFILE" ]; then
    echo "❌ Error: El archivo $SQLFILE no existe"
    exit 1
fi

echo "📥 Importando desde: $SQLFILE"
echo "⚠️  Esto sobrescribirá tu base de datos actual"
read -p "¿Continuar? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Importación cancelada"
    exit 1
fi

# Importar base de datos
docker exec -i magento_db mysql -umagento -pmagento magento < "$SQLFILE"

if [ $? -eq 0 ]; then
    echo "✅ Base de datos importada exitosamente"
    echo ""
    echo "🔄 Limpiando caché..."
    docker exec magento_php bin/magento cache:flush
    
    echo "🔄 Reindexando..."
    docker exec magento_php bin/magento indexer:reindex
    
    echo ""
    echo "✅ ¡Todo listo! Puedes acceder a http://localhost"
else
    echo "❌ Error al importar la base de datos"
    exit 1
fi
