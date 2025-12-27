#!/bin/bash

# Script de instalación de Magento 2
# Este script instala Magento 2 usando Composer

echo "==========================================="
echo "Instalador de Magento 2"
echo "==========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables de configuración
MAGENTO_VERSION="2.4.6"
ADMIN_USER="admin"
ADMIN_PASSWORD="Admin123!"
ADMIN_EMAIL="admin@example.com"
ADMIN_FIRSTNAME="Admin"
ADMIN_LASTNAME="User"
BASE_URL="http://localhost"
DB_HOST="db"
DB_NAME="magento"
DB_USER="magento"
DB_PASSWORD="magento"
ELASTICSEARCH_HOST="elasticsearch"
REDIS_HOST="redis"

echo -e "${YELLOW}Paso 1: Verificando contenedores Docker...${NC}"
if ! docker ps | grep -q magento_php; then
    echo -e "${RED}Error: Los contenedores Docker no están corriendo.${NC}"
    echo "Por favor, ejecuta: docker-compose up -d"
    exit 1
fi
echo -e "${GREEN}✓ Contenedores Docker corriendo${NC}"
echo ""

echo -e "${YELLOW}Paso 2: Esperando que los servicios estén listos...${NC}"
sleep 10
echo -e "${GREEN}✓ Servicios listos${NC}"
echo ""

echo -e "${YELLOW}Paso 3: Instalando Magento con Composer...${NC}"
echo "Esto puede tardar varios minutos..."
docker exec magento_php composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition=$MAGENTO_VERSION /var/www/html

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudo instalar Magento con Composer.${NC}"
    echo ""
    echo "IMPORTANTE: Necesitas credenciales de Magento Marketplace."
    echo "1. Crea una cuenta en: https://marketplace.magento.com/"
    echo "2. Ve a: Mi Perfil > Claves de Acceso"
    echo "3. Genera nuevas claves de acceso"
    echo "4. Usa la 'Public Key' como username"
    echo "5. Usa la 'Private Key' como password"
    echo ""
    echo "Ejecuta el siguiente comando manualmente:"
    echo "docker exec -it magento_php bash"
    echo "cd /var/www/html"
    echo "composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition=$MAGENTO_VERSION ."
    exit 1
fi
echo -e "${GREEN}✓ Magento instalado con Composer${NC}"
echo ""

echo -e "${YELLOW}Paso 4: Configurando permisos...${NC}"
docker exec magento_php find /var/www/html/var /var/www/html/generated /var/www/html/pub/static /var/www/html/pub/media -type f -exec chmod g+w {} +
docker exec magento_php find /var/www/html/var /var/www/html/generated /var/www/html/pub/static /var/www/html/pub/media -type d -exec chmod g+ws {} +
docker exec magento_php chmod u+x /var/www/html/bin/magento
echo -e "${GREEN}✓ Permisos configurados${NC}"
echo ""

echo -e "${YELLOW}Paso 5: Instalando Magento...${NC}"
docker exec magento_php /var/www/html/bin/magento setup:install \
    --base-url=$BASE_URL \
    --db-host=$DB_HOST \
    --db-name=$DB_NAME \
    --db-user=$DB_USER \
    --db-password=$DB_PASSWORD \
    --admin-firstname=$ADMIN_FIRSTNAME \
    --admin-lastname=$ADMIN_LASTNAME \
    --admin-email=$ADMIN_EMAIL \
    --admin-user=$ADMIN_USER \
    --admin-password=$ADMIN_PASSWORD \
    --language=es_ES \
    --currency=EUR \
    --timezone=Europe/Madrid \
    --use-rewrites=1 \
    --search-engine=elasticsearch7 \
    --elasticsearch-host=$ELASTICSEARCH_HOST \
    --elasticsearch-port=9200 \
    --cache-backend=redis \
    --cache-backend-redis-server=$REDIS_HOST \
    --cache-backend-redis-db=0 \
    --page-cache=redis \
    --page-cache-redis-server=$REDIS_HOST \
    --page-cache-redis-db=1 \
    --session-save=redis \
    --session-save-redis-host=$REDIS_HOST \
    --session-save-redis-db=2

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudo instalar Magento.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Magento instalado correctamente${NC}"
echo ""

echo -e "${YELLOW}Paso 6: Configuración adicional...${NC}"
docker exec magento_php /var/www/html/bin/magento deploy:mode:set developer
docker exec magento_php /var/www/html/bin/magento cache:flush
echo -e "${GREEN}✓ Configuración completada${NC}"
echo ""

echo -e "${GREEN}==========================================="
echo "¡Instalación completada!"
echo "==========================================="
echo ""
echo "Accede a tu tienda en: $BASE_URL"
echo "Panel de administración: $BASE_URL/admin"
echo ""
echo "Credenciales de admin:"
echo "  Usuario: $ADMIN_USER"
echo "  Contraseña: $ADMIN_PASSWORD"
echo ""
echo "Base de datos (phpMyAdmin): http://localhost:8080"
echo "  Usuario: $DB_USER"
echo "  Contraseña: $DB_PASSWORD"
echo ""
echo -e "${YELLOW}Nota: Si ves errores 404, ejecuta:${NC}"
echo "docker exec magento_php /var/www/html/bin/magento setup:upgrade"
echo "docker exec magento_php /var/www/html/bin/magento setup:static-content:deploy -f"
echo "docker exec magento_php /var/www/html/bin/magento cache:flush"
echo "==========================================="
