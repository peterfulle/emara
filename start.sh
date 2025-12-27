#!/bin/bash

# Script simplificado para iniciar Magento sin instalación automática
# Útil cuando quieres instalar Magento manualmente o ya está instalado

echo "==========================================="
echo "Iniciando entorno Magento"
echo "==========================================="
echo ""

# Iniciar contenedores
echo "Iniciando contenedores Docker..."
docker-compose up -d

echo ""
echo "Esperando que los servicios estén listos..."
sleep 15

echo ""
echo "==========================================="
echo "Entorno iniciado correctamente"
echo "==========================================="
echo ""
echo "Servicios disponibles:"
echo "  - Web: http://localhost"
echo "  - Admin: http://localhost/admin"
echo "  - phpMyAdmin: http://localhost:8080"
echo "  - Elasticsearch: http://localhost:9200"
echo ""
echo "Para instalar Magento, ejecuta:"
echo "  chmod +x install-magento.sh"
echo "  ./install-magento.sh"
echo ""
echo "O instala manualmente:"
echo "  docker exec -it magento_php bash"
echo "==========================================="
