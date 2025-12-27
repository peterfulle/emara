# 🤝 Guía de Colaboración

## Para tu Colaborador

### 1️⃣ Requisitos Previos

- Docker Desktop instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop))
- Git instalado
- VS Code con la extensión **Live Share**
- Cuenta en [Magento Marketplace](https://marketplace.magento.com/)

### 2️⃣ Clonar y Configurar

```bash
# Clonar el repositorio
git clone https://github.com/peterfulle/emara.git
cd emara

# Crear archivo con credenciales de Magento
# Puedes usar estas credenciales compartidas del equipo:
mkdir -p src
cat > src/auth.json << EOF
{
    "http-basic": {
        "repo.magento.com": {
            "username": "ce75ffb43e9f48e566d561a5de7bcd3f",
            "password": "1512c954b08a95e06b6db1803319f57e"
        }
    }
}
EOF

# Iniciar contenedores Docker
docker-compose up -d

# Esperar a que los contenedores estén listos (2-3 minutos)
docker ps
```

### 3️⃣ Instalar Magento

```bash
# Dar permisos al script
chmod +x install-magento.sh

# Ejecutar instalación (puede tardar 10-15 minutos)
./install-magento.sh
```

### 4️⃣ Verificar Instalación

Abre tu navegador en:
- Frontend: http://localhost
- Admin: http://localhost/admin_li71oj1
  - Usuario: `admin`
  - Contraseña: `Admin123!`

---

## 🔄 Flujo de Trabajo Git

### Trabajando en una Nueva Funcionalidad

```bash
# 1. Asegurarte de estar en main actualizado
git checkout main
git pull origin main

# 2. Crear una rama para tu feature
git checkout -b feature/nombre-de-tu-feature

# 3. Hacer cambios y commits
git add .
git commit -m "Descripción clara de tus cambios"

# 4. Subir tu rama
git push origin feature/nombre-de-tu-feature

# 5. Crear Pull Request en GitHub
# Ve a https://github.com/peterfulle/emara/pulls
# Click en "New Pull Request"
```

### Obtener Cambios de otros

```bash
# Traer últimos cambios
git checkout main
git pull origin main

# Actualizar tu rama feature con los cambios de main
git checkout feature/tu-feature
git merge main
```

---

## 💻 VS Code Live Share

### Configurar Live Share

1. Instala la extensión:
   - Abre VS Code
   - Ve a Extensions (⌘+Shift+X)
   - Busca "Live Share"
   - Instala "Live Share Extension Pack"

2. Inicia sesión con tu cuenta GitHub/Microsoft

### Compartir Sesión (Host)

```
1. Click en "Live Share" en la barra de estado (abajo)
2. Click "Share" 
3. Copia el link y envíalo a tu colaborador
```

### Unirse a Sesión (Guest)

```
1. Click en "Live Share" en la barra de estado
2. Click "Join"
3. Pega el link que te compartieron
```

**Nota:** Live Share solo comparte el código, NO la base de datos ni Docker.

---

## 🐳 Comandos Docker Útiles

```bash
# Ver contenedores activos
docker ps

# Ver logs
docker logs magento_php
docker logs magento_web

# Reiniciar contenedor
docker restart magento_php

# Limpiar caché de Magento
docker exec magento_php bin/magento cache:flush

# Reindexar
docker exec magento_php bin/magento indexer:reindex

# Acceder al contenedor PHP
docker exec -it magento_php bash

# Detener todo
docker-compose down

# Iniciar todo
docker-compose up -d
```

---

## 📝 Comandos Magento Útiles

```bash
# Cambiar a modo desarrollador
docker exec magento_php bin/magento deploy:mode:set developer

# Ver configuración
docker exec magento_php bin/magento config:show

# Limpiar generados
docker exec magento_php bin/magento setup:upgrade
docker exec magento_php bin/magento setup:di:compile

# Desplegar contenido estático
docker exec magento_php bin/magento setup:static-content:deploy -f es_CL
```

---

---

## 🔄 Sincronizar Base de Datos entre Colaboradores

**Importante:** Cada desarrollador tiene su propia base de datos local. Para trabajar con los mismos datos:

### Exportar tu Base de Datos (Quien tiene los datos)

```bash
# Ejecutar el script de exportación
./export-db.sh

# Esto creará un archivo en backups/magento-FECHA.sql
# Comparte este archivo por:
# - Google Drive
# - Dropbox  
# - WeTransfer
# - Slack/Discord
```

### Importar Base de Datos (Quien recibe los datos)

```bash
# Descargar el archivo .sql que te compartieron
# Ejecutar el script de importación
./import-db.sh backups/magento-20250127-120000.sql

# El script te pedirá confirmación antes de sobrescribir tu BD
```

**Cuándo sincronizar la BD:**
- ✅ Al inicio del proyecto (primera vez)
- ✅ Cuando se agregan productos nuevos
- ✅ Cuando se cambia configuración importante
- ❌ NO es necesario para cambios de código/diseño

---

## 🚨 Problemas Comunes

### Puerto ya en uso

```bash
# Ver qué está usando el puerto 80
lsof -i :80

# Cambiar puerto en docker-compose.yml
# Edita la línea de ports del servicio web:
ports:
  - "8080:80"  # Ahora accede en http://localhost:8080
```

### Base de datos vacía después de clonar

Es normal. Tienes dos opciones:

**Opción A: Usar la base de datos con todos los datos (Recomendado)**
```bash
# Pide el archivo .sql al equipo y luego:
./import-db.sh backups/magento-YYYYMMDD-HHMMSS.sql
```

**Opción B: Empezar desde cero**
```bash
# Reinstalar Magento desde cero
./install-magento.sh
# Tendrás una tienda vacía sin productos de muestra
```

### Permisos en archivos

```bash
docker exec -u root magento_php chown -R www-data:www-data /var/www/html
docker exec -u root magento_php chmod -R 755 /var/www/html
```

---

## 📞 Soporte

Si tienes problemas, contacta a Peter o crea un issue en GitHub.
