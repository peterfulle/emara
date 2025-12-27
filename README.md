# 🛍️ Ecommerce con Magento 2

Proyecto de tienda online desarrollado con Magento 2.4.6, configurado con Docker para facilitar el desarrollo y despliegue.

## 📋 Requisitos Previos

- **Docker Desktop** instalado y corriendo
- **Docker Compose** (incluido con Docker Desktop)
- Al menos **4GB de RAM** libre para los contenedores
- **Credenciales de Magento Marketplace** (gratis) para descargar Magento

### Obtener Credenciales de Magento Marketplace

1. Crea una cuenta en [Magento Marketplace](https://marketplace.magento.com/)
2. Ve a **Mi Perfil → Claves de Acceso**
3. Haz clic en **Crear Nuevas Claves de Acceso**
4. Guarda la **Public Key** (username) y **Private Key** (password)

## 🚀 Instalación Rápida

### Paso 1: Iniciar el entorno Docker

```bash
# Dar permisos de ejecución a los scripts
chmod +x start.sh install-magento.sh stop.sh

# Iniciar los contenedores
./start.sh
```

Esto iniciará todos los servicios necesarios:
- **Nginx** (servidor web)
- **PHP-FPM** (procesador PHP)
- **MySQL** (base de datos)
- **Elasticsearch** (motor de búsqueda)
- **Redis** (caché y sesiones)
- **phpMyAdmin** (gestión de BD)

### Paso 2: Instalar Magento

```bash
# Ejecutar el script de instalación
./install-magento.sh
```

Durante la instalación, se te pedirán las credenciales de Magento Marketplace:
- **Username**: Tu Public Key
- **Password**: Tu Private Key

La instalación puede tardar **10-20 minutos** dependiendo de tu conexión a internet.

## 🔑 Acceso a la Plataforma

Una vez instalado, podrás acceder a:

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Tienda (Frontend)** | http://localhost | - |
| **Panel Admin** | http://localhost/admin | Usuario: `admin`<br>Password: `Admin123!` |
| **phpMyAdmin** | http://localhost:8080 | Usuario: `magento`<br>Password: `magento` |
| **Elasticsearch** | http://localhost:9200 | - |

## 📁 Estructura del Proyecto

```
emara/
├── docker-compose.yml      # Configuración de contenedores Docker
├── nginx/
│   └── default.conf        # Configuración del servidor Nginx
├── php/
│   └── php.ini            # Configuración de PHP
├── src/                   # Código fuente de Magento (se crea al instalar)
├── install-magento.sh     # Script de instalación
├── start.sh              # Script para iniciar contenedores
├── stop.sh               # Script para detener contenedores
└── README.md             # Esta documentación
```

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Iniciar contenedores
./start.sh
# o manualmente:
docker-compose up -d

# Detener contenedores
./stop.sh
# o manualmente:
docker-compose down

# Ver logs
docker-compose logs -f

# Ver estado de contenedores
docker ps
```

### Comandos de Magento

```bash
# Acceder al contenedor PHP
docker exec -it magento_php bash

# Dentro del contenedor, ejecutar comandos de Magento:
cd /var/www/html

# Limpiar caché
bin/magento cache:flush

# Reindexar
bin/magento indexer:reindex

# Compilar archivos estáticos
bin/magento setup:static-content:deploy -f es_ES

# Modo desarrollador (recomendado para desarrollo)
bin/magento deploy:mode:set developer

# Modo producción (para sitios en vivo)
bin/magento deploy:mode:set production

# Ver información del sistema
bin/magento info:adminuri
```

### Gestión de Base de Datos

```bash
# Backup de la base de datos
docker exec magento_db mysqldump -u magento -pmagento magento > backup.sql

# Restaurar backup
docker exec -i magento_db mysql -u magento -pmagento magento < backup.sql

# Acceder a MySQL
docker exec -it magento_db mysql -u magento -pmagento magento
```

## 🎨 Personalización

### Cambiar Idioma y Moneda

El sistema está configurado por defecto en español (España) y euros. Para cambiar:

```bash
docker exec magento_php /var/www/html/bin/magento setup:install \
    --language=en_US \
    --currency=USD \
    --timezone=America/New_York
```

### Instalar Tema Personalizado

1. Coloca tu tema en `src/app/design/frontend/[Vendor]/[Theme]`
2. Actívalo desde el panel de administración:
   - **Contenido → Diseño → Configuración**
   - Selecciona tu tienda y aplica el tema

### Instalar Extensiones

```bash
# Acceder al contenedor
docker exec -it magento_php bash

# Instalar extensión vía Composer
composer require vendor/module-name

# Habilitar extensión
bin/magento module:enable Vendor_ModuleName

# Actualizar base de datos
bin/magento setup:upgrade

# Compilar
bin/magento setup:di:compile
```

## 🐛 Solución de Problemas

### Error 404 en todas las páginas

```bash
docker exec magento_php /var/www/html/bin/magento setup:upgrade
docker exec magento_php /var/www/html/bin/magento setup:static-content:deploy -f
docker exec magento_php /var/www/html/bin/magento cache:flush
```

### Problemas de permisos

```bash
docker exec magento_php chmod -R 777 /var/www/html/var
docker exec magento_php chmod -R 777 /var/www/html/generated
docker exec magento_php chmod -R 777 /var/www/html/pub/static
docker exec magento_php chmod -R 777 /var/www/html/pub/media
```

### La página del admin es muy lenta

Asegúrate de estar en modo desarrollador:

```bash
docker exec magento_php /var/www/html/bin/magento deploy:mode:set developer
docker exec magento_php /var/www/html/bin/magento cache:disable block_html full_page
```

### Elasticsearch no funciona

```bash
# Verificar que Elasticsearch está corriendo
curl http://localhost:9200

# Si no responde, reiniciar el contenedor
docker-compose restart elasticsearch
```

## 📚 Recursos Adicionales

- [Documentación oficial de Magento](https://devdocs.magento.com/)
- [Magento Marketplace](https://marketplace.magento.com/)
- [Foros de la comunidad](https://community.magento.com/)
- [Magento Stack Exchange](https://magento.stackexchange.com/)

## ⚙️ Configuración de Producción

Para desplegar en producción, considera:

1. **Cambiar contraseñas** en `docker-compose.yml`
2. **Configurar SSL/HTTPS** en Nginx
3. **Modo producción**: `bin/magento deploy:mode:set production`
4. **Optimizar**: `bin/magento setup:di:compile`
5. **Configurar backups automáticos**
6. **Configurar email** (SMTP)
7. **Aumentar recursos** de los contenedores Docker

## 📝 Notas Importantes

- **Primer acceso al admin**: Puede tardar 1-2 minutos en cargar la primera vez
- **Desarrollo local**: El modo developer no cachea, facilitando el desarrollo
- **RAM**: Magento requiere al menos 2GB de RAM para funcionar correctamente
- **Composer**: Guarda tus credenciales de Marketplace, se usarán para instalar extensiones

## 🤝 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica que todos los contenedores estén corriendo: `docker ps`
3. Consulta la documentación oficial de Magento
4. Revisa los foros de la comunidad

---

**¡Feliz venta! 🎉**
