# 🏗️ Arquitectura del Proyecto

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Navegador)                      │
│                     http://localhost                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX (Puerto 80/443)                         │
│                      Servidor Web                                │
│  - Sirve archivos estáticos                                      │
│  - Proxy para PHP-FPM                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHP-FPM (Puerto 9000)                         │
│                  Magento 2.4.6 Application                       │
│  - Procesa lógica de negocio                                     │
│  - Renderiza páginas dinámicas                                   │
│  - Gestiona pedidos, productos, usuarios                         │
└─────┬─────────────┬─────────────┬──────────────┬────────────────┘
      │             │             │              │
      ▼             ▼             ▼              ▼
┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌──────────────┐
│  MySQL   │ │  Redis   │ │Elasticsearch│ │    Redis     │
│ (Puerto  │ │ (Puerto  │ │  (Puerto    │ │   (Cache)    │
│  3306)   │ │  6379)   │ │   9200)     │ │              │
│          │ │          │ │             │ │              │
│ Base de  │ │ Sesiones │ │  Búsqueda   │ │  Caché de    │
│  Datos   │ │    de    │ │     de      │ │  Páginas     │
│          │ │ Usuarios │ │  Productos  │ │              │
└──────────┘ └──────────┘ └─────────────┘ └──────────────┘
```

## 📁 Estructura de Archivos del Proyecto

```
emara/
│
├── 📄 docker-compose.yml          # Configuración de contenedores Docker
│   └── Define: web, php, db, elasticsearch, redis, phpmyadmin
│
├── 📁 nginx/
│   └── 📄 default.conf            # Configuración del servidor Nginx
│       └── Reglas de reescritura, proxy PHP-FPM
│
├── 📁 php/
│   └── 📄 php.ini                 # Configuración de PHP
│       └── Límites de memoria, tiempo de ejecución
│
├── 📁 src/                        # (Se crea al instalar Magento)
│   ├── 📁 app/                    # Código de la aplicación
│   │   ├── 📁 code/              # Módulos personalizados
│   │   ├── 📁 design/            # Temas personalizados
│   │   └── 📁 etc/               # Configuración
│   ├── 📁 bin/
│   │   └── magento               # CLI de Magento
│   ├── 📁 pub/
│   │   ├── 📁 static/            # Archivos estáticos (CSS, JS, imágenes)
│   │   └── 📁 media/             # Imágenes de productos
│   ├── 📁 var/
│   │   ├── 📁 log/               # Logs de Magento
│   │   └── 📁 cache/             # Caché de archivos
│   └── 📁 vendor/                # Dependencias de Composer
│
├── 🔧 Scripts de Utilidad:
│   ├── start.sh                   # Inicia contenedores Docker
│   ├── stop.sh                    # Detiene contenedores
│   └── install-magento.sh         # Instala Magento
│
├── 📚 Documentación:
│   ├── README.md                  # Documentación completa
│   ├── INICIO-RAPIDO.md          # Guía rápida de inicio
│   ├── COMANDOS.md               # Lista de comandos útiles
│   ├── INSTALAR-DOCKER.md        # Guía de instalación de Docker
│   └── ARQUITECTURA.md           # Este archivo
│
└── ⚙️ Configuración:
    ├── .env.example              # Variables de entorno de ejemplo
    └── .gitignore                # Archivos ignorados por Git
```

## 🔄 Flujo de Datos

### 1️⃣ Petición del Cliente
```
Usuario → Navegador → http://localhost → Nginx (Puerto 80)
```

### 2️⃣ Procesamiento PHP
```
Nginx → PHP-FPM (Puerto 9000) → Magento Application
```

### 3️⃣ Acceso a Base de Datos
```
Magento → MySQL (Puerto 3306) → Consulta/Guarda datos
```

### 4️⃣ Búsqueda de Productos
```
Magento → Elasticsearch (Puerto 9200) → Índice de búsqueda
```

### 5️⃣ Gestión de Caché
```
Magento → Redis (Puerto 6379) → Almacena caché y sesiones
```

### 6️⃣ Respuesta al Cliente
```
Magento → PHP-FPM → Nginx → Navegador → Usuario
```

## 🐳 Contenedores Docker

| Contenedor | Imagen | Puerto | Función |
|------------|--------|--------|---------|
| `magento_web` | `nginx:alpine` | 80, 443 | Servidor web |
| `magento_php` | `bitnami/magento:2.4.6` | 9000 | Procesador PHP |
| `magento_db` | `mysql:8.0` | 3306 | Base de datos |
| `magento_elasticsearch` | `elasticsearch:7.17.9` | 9200 | Motor de búsqueda |
| `magento_redis` | `redis:7-alpine` | 6379 | Caché y sesiones |
| `magento_phpmyadmin` | `phpmyadmin:latest` | 8080 | Gestión de BD |

## 💾 Volúmenes de Docker

Los volúmenes persisten los datos aunque se detengan los contenedores:

- **db-data**: Almacena la base de datos MySQL
- **elasticsearch-data**: Almacena índices de búsqueda
- **src/**: Código fuente de Magento (montado desde el host)

## 🌐 Red de Docker

Todos los contenedores están en la red `magento-network`, permitiendo que se comuniquen entre sí:

```
magento_web ←→ magento_php
magento_php ←→ magento_db
magento_php ←→ magento_elasticsearch
magento_php ←→ magento_redis
```

## 🔐 Seguridad

### Credenciales por Defecto (CAMBIAR EN PRODUCCIÓN)

- **MySQL Root**: `magento_root`
- **MySQL User**: `magento` / `magento`
- **Admin Magento**: `admin` / `Admin123!`
- **phpMyAdmin**: `magento` / `magento`

### Recomendaciones de Seguridad

1. **Cambiar contraseñas** en `docker-compose.yml`
2. **Configurar HTTPS** con certificados SSL
3. **Limitar acceso** a phpMyAdmin
4. **Activar modo producción** antes de lanzar
5. **Usar .env** para variables sensibles
6. **Actualizar regularmente** Magento y dependencias

## 📊 Rendimiento

### Recursos Necesarios

- **RAM**: Mínimo 4GB, recomendado 6-8GB
- **CPU**: Mínimo 2 cores, recomendado 4 cores
- **Disco**: Mínimo 20GB libres
- **Internet**: Para descargar dependencias (primera vez)

### Optimizaciones

1. **Modo Producción**: Caché activado, archivos compilados
2. **Redis**: Caché en memoria (muy rápido)
3. **Elasticsearch**: Búsqueda optimizada
4. **Nginx**: Compresión gzip, caché de archivos estáticos
5. **PHP OpCache**: Caché de bytecode PHP

## 🔄 Ciclo de Vida del Desarrollo

```
1. Desarrollo Local (modo developer)
   ↓
2. Testing (modo developer con datos de prueba)
   ↓
3. Staging (modo production en servidor de pruebas)
   ↓
4. Producción (modo production optimizado)
```

## 🛠️ Comandos de Gestión por Capa

### Capa de Infraestructura (Docker)
```bash
docker-compose up -d      # Iniciar
docker-compose down       # Detener
docker-compose restart    # Reiniciar
docker-compose logs -f    # Ver logs
```

### Capa de Aplicación (Magento)
```bash
bin/magento cache:flush           # Caché
bin/magento setup:upgrade         # Actualizar
bin/magento deploy:mode:set       # Modo
bin/magento indexer:reindex       # Reindexar
```

### Capa de Datos (MySQL)
```bash
mysqldump > backup.sql            # Backup
mysql < backup.sql                # Restaurar
```

## 📈 Monitoreo

### Logs Importantes

- **Magento**: `src/var/log/system.log`
- **Errores**: `src/var/log/exception.log`
- **Nginx**: `docker logs magento_web`
- **PHP**: `docker logs magento_php`
- **MySQL**: `docker logs magento_db`

### Métricas a Vigilar

- Uso de RAM de los contenedores
- Espacio en disco (volúmenes)
- Tiempo de respuesta de páginas
- Errores en logs
- Conexiones a base de datos

---

**Esta arquitectura está diseñada para ser escalable y fácil de mantener** 🚀
