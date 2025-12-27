#!/bin/bash

# Script para exportar la base de datos de Magento

echo "🗄️  Exportando base de datos de Magento..."

# Crear carpeta backups si no existe
mkdir -p backups

# Nombre del archivo con fecha
FILENAME="backups/magento-$(date +%Y%m%d-%H%M%S).sql"

# Exportar base de datos
docker exec magento_db mysqldump -umagento -pmagento magento > "$FILENAME"

if [ $? -eq 0 ]; then
    echo "✅ Base de datos exportada exitosamente:"
    echo "   $FILENAME"
    echo ""
    echo "📤 Comparte este archivo con tu colaborador"
    echo "   Pueden usar: Google Drive, Dropbox, WeTransfer, etc."
else
    echo "❌ Error al exportar la base de datos"
    exit 1
fi
