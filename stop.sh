#!/bin/bash

# Script para detener todos los contenedores de Magento

echo "Deteniendo contenedores Docker..."
docker-compose down

echo ""
echo "Contenedores detenidos correctamente."
echo ""
echo "Para eliminar también los volúmenes (base de datos), ejecuta:"
echo "  docker-compose down -v"
