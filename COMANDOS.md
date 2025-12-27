# 🔧 Comandos Útiles de Magento

## Comandos Rápidos

### Acceso Rápido al Contenedor PHP
```bash
docker exec -it magento_php bash
```

### Limpiar Todo el Sistema
```bash
# Limpia caché, regenera archivos estáticos y reindexar
docker exec magento_php bash -c "cd /var/www/html && \
    bin/magento cache:flush && \
    bin/magento setup:upgrade && \
    bin/magento setup:di:compile && \
    bin/magento setup:static-content:deploy -f es_ES && \
    bin/magento indexer:reindex"
```

### Ver URL del Admin
```bash
docker exec magento_php /var/www/html/bin/magento info:adminuri
```

### Crear Usuario Admin Adicional
```bash
docker exec magento_php /var/www/html/bin/magento admin:user:create \
    --admin-user="nuevo_admin" \
    --admin-password="Password123!" \
    --admin-email="nuevo@example.com" \
    --admin-firstname="Nombre" \
    --admin-lastname="Apellido"
```

## Gestión de Caché

```bash
# Limpiar todo el caché
docker exec magento_php /var/www/html/bin/magento cache:flush

# Ver tipos de caché
docker exec magento_php /var/www/html/bin/magento cache:status

# Deshabilitar caché (desarrollo)
docker exec magento_php /var/www/html/bin/magento cache:disable

# Habilitar caché (producción)
docker exec magento_php /var/www/html/bin/magento cache:enable
```

## Gestión de Productos

```bash
# Reindexar todos los índices
docker exec magento_php /var/www/html/bin/magento indexer:reindex

# Ver estado de los índices
docker exec magento_php /var/www/html/bin/magento indexer:status

# Reindexar índice específico
docker exec magento_php /var/www/html/bin/magento indexer:reindex catalog_product_price
```

## Modo de Despliegue

```bash
# Cambiar a modo desarrollador
docker exec magento_php /var/www/html/bin/magento deploy:mode:set developer

# Cambiar a modo producción
docker exec magento_php /var/www/html/bin/magento deploy:mode:set production

# Ver modo actual
docker exec magento_php /var/www/html/bin/magento deploy:mode:show
```

## Gestión de Módulos

```bash
# Listar todos los módulos
docker exec magento_php /var/www/html/bin/magento module:status

# Habilitar módulo
docker exec magento_php /var/www/html/bin/magento module:enable Vendor_ModuleName

# Deshabilitar módulo
docker exec magento_php /var/www/html/bin/magento module:disable Vendor_ModuleName

# Actualizar después de cambios en módulos
docker exec magento_php /var/www/html/bin/magento setup:upgrade
```

## Gestión de Contenido Estático

```bash
# Desplegar contenido estático en español
docker exec magento_php /var/www/html/bin/magento setup:static-content:deploy es_ES

# Desplegar en múltiples idiomas
docker exec magento_php /var/www/html/bin/magento setup:static-content:deploy es_ES en_US

# Forzar redespliegue
docker exec magento_php /var/www/html/bin/magento setup:static-content:deploy -f
```

## Base de Datos

```bash
# Hacer backup de la base de datos
docker exec magento_db mysqldump -u magento -pmagento magento > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i magento_db mysql -u magento -pmagento magento < backup.sql

# Acceder a MySQL CLI
docker exec -it magento_db mysql -u magento -pmagento magento

# Ver tablas
docker exec magento_db mysql -u magento -pmagento -e "SHOW TABLES;" magento
```

## Permisos

```bash
# Arreglar permisos (si hay problemas)
docker exec magento_php bash -c "cd /var/www/html && \
    find var generated pub/static pub/media app/etc -type f -exec chmod g+w {} + && \
    find var generated pub/static pub/media app/etc -type d -exec chmod g+ws {} + && \
    chmod u+x bin/magento"
```

## Logs

```bash
# Ver logs de Magento en tiempo real
docker exec -it magento_php tail -f /var/www/html/var/log/system.log

# Ver logs de excepciones
docker exec -it magento_php tail -f /var/www/html/var/log/exception.log

# Ver logs de Docker
docker-compose logs -f

# Ver logs de un contenedor específico
docker logs -f magento_php
```

## Cron

```bash
# Ejecutar cron manualmente
docker exec magento_php /var/www/html/bin/magento cron:run

# Ver tareas cron
docker exec magento_php /var/www/html/bin/magento cron:status
```

## Mantenimiento

```bash
# Activar modo mantenimiento
docker exec magento_php /var/www/html/bin/magento maintenance:enable

# Desactivar modo mantenimiento
docker exec magento_php /var/www/html/bin/magento maintenance:disable

# Ver estado
docker exec magento_php /var/www/html/bin/magento maintenance:status
```

## Configuración

```bash
# Ver configuración
docker exec magento_php /var/www/html/bin/magento config:show

# Establecer valor de configuración
docker exec magento_php /var/www/html/bin/magento config:set path/to/config value

# Cambiar URL base
docker exec magento_php /var/www/html/bin/magento setup:store-config:set --base-url="http://localhost/"
```

## Extensiones via Composer

```bash
# Instalar extensión
docker exec magento_php composer require vendor/module-name

# Actualizar extensión
docker exec magento_php composer update vendor/module-name

# Eliminar extensión
docker exec magento_php composer remove vendor/module-name

# Después de instalar/actualizar extensiones
docker exec magento_php /var/www/html/bin/magento setup:upgrade
docker exec magento_php /var/www/html/bin/magento setup:di:compile
docker exec magento_php /var/www/html/bin/magento cache:flush
```

## Importar/Exportar Datos

```bash
# Exportar productos
docker exec magento_php /var/www/html/bin/magento export:products

# Importar productos
docker exec magento_php /var/www/html/bin/magento import:products --file=products.csv
```

## Testing

```bash
# Ejecutar tests unitarios
docker exec magento_php /var/www/html/vendor/bin/phpunit -c /var/www/html/dev/tests/unit/phpunit.xml.dist

# Ejecutar tests de integración
docker exec magento_php /var/www/html/vendor/bin/phpunit -c /var/www/html/dev/tests/integration/phpunit.xml.dist
```

## Troubleshooting

```bash
# Verificar requisitos del sistema
docker exec magento_php /var/www/html/bin/magento setup:di:compile-multi-tenant

# Reparar base de datos
docker exec magento_php /var/www/html/bin/magento setup:db:status

# Limpiar todo (emergencia)
docker exec magento_php bash -c "cd /var/www/html && \
    rm -rf var/cache/* var/page_cache/* var/view_preprocessed/* pub/static/* generated/* && \
    bin/magento cache:flush && \
    bin/magento setup:upgrade && \
    bin/magento setup:di:compile && \
    bin/magento setup:static-content:deploy -f"
```

## Reiniciar Todo

```bash
# Reiniciar todos los contenedores
docker-compose restart

# Reiniciar contenedor específico
docker-compose restart php

# Reconstruir contenedores (si cambias docker-compose.yml)
docker-compose down
docker-compose up -d --build
```
