# 📦 Instalación de Docker Desktop para macOS

## ⚠️ REQUISITO PREVIO NECESARIO

Para ejecutar este proyecto de Magento, **DEBES tener Docker instalado**. Sigue estos pasos:

## Paso 1: Descargar Docker Desktop

1. Ve a: https://www.docker.com/products/docker-desktop/
2. Haz clic en **Download for Mac**
3. Elige la versión según tu Mac:
   - **Apple Silicon** (M1, M2, M3): Descarga la versión ARM
   - **Intel**: Descarga la versión Intel

## Paso 2: Instalar Docker Desktop

1. Abre el archivo `.dmg` descargado
2. Arrastra el icono de Docker a la carpeta **Applications**
3. Abre Docker desde Applications
4. Acepta los términos y condiciones
5. Docker te pedirá tu contraseña de macOS (necesita permisos de administrador)
6. Espera a que Docker se inicie completamente (verás el icono de Docker en la barra de menú superior)

## Paso 3: Verificar la Instalación

Abre una terminal y ejecuta:

```bash
docker --version
docker-compose --version
```

Deberías ver algo como:
```
Docker version 24.0.x, build xxxxx
Docker Compose version v2.x.x
```

## Paso 4: Configurar Docker Desktop (Recomendado)

1. Haz clic en el icono de Docker en la barra de menú
2. Selecciona **Settings** (Preferencias)
3. Ve a **Resources** → **Advanced**
4. Ajusta los recursos:
   - **CPUs**: Al menos 2 (recomendado 4)
   - **Memory**: Al menos 4GB (recomendado 6-8GB)
   - **Disk**: Al menos 20GB
5. Haz clic en **Apply & Restart**

## Paso 5: Continuar con la Instalación de Magento

Una vez Docker esté instalado y corriendo:

```bash
# Inicia el entorno
./start.sh

# Instala Magento
./install-magento.sh
```

---

## Alternativa: Instalación sin Docker (Más Complejo)

Si no quieres usar Docker, necesitarás instalar manualmente:

### 1. Instalar Homebrew (si no lo tienes)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Instalar PHP 8.1
```bash
brew install php@8.1
brew link php@8.1
```

### 3. Instalar Composer
```bash
brew install composer
```

### 4. Instalar MySQL
```bash
brew install mysql
brew services start mysql
```

### 5. Instalar Elasticsearch
```bash
brew tap elastic/tap
brew install elastic/tap/elasticsearch-full
brew services start elasticsearch-full
```

### 6. Instalar Redis
```bash
brew install redis
brew services start redis
```

### 7. Instalar Nginx
```bash
brew install nginx
brew services start nginx
```

### 8. Configurar todo manualmente

Esto requiere configurar:
- PHP-FPM
- Virtual hosts de Nginx
- Base de datos MySQL
- Permisos de archivos
- Variables de entorno

**⚠️ NO RECOMENDADO**: Esta opción es mucho más compleja y propensa a errores. Es mejor usar Docker.

---

## ❓ ¿Por Qué Docker?

Docker es la forma recomendada porque:

✅ **Fácil**: Todo está preconfigurado
✅ **Aislado**: No afecta tu sistema macOS
✅ **Reproducible**: Funciona igual en cualquier ordenador
✅ **Completo**: Incluye todo lo necesario (PHP, MySQL, Elasticsearch, Redis, Nginx)
✅ **Limpio**: Fácil de desinstalar (solo elimina Docker)

---

## 🆘 Problemas con Docker

### Docker no inicia
- Reinicia tu Mac
- Verifica que tienes suficiente espacio en disco (al menos 20GB libres)
- Asegúrate de tener macOS 11 o superior

### Docker pide actualizar
- Ve a Docker Desktop → Check for updates
- Descarga e instala la última versión

### Error de permisos
- Docker necesita permisos de administrador
- Asegúrate de introducir tu contraseña de macOS cuando te la pida

### Docker muy lento
- Aumenta la RAM asignada en Docker Settings
- Cierra otras aplicaciones pesadas
- Considera actualizar tu Mac si es muy antiguo

---

## 📞 Soporte

Si tienes problemas instalando Docker:
- Documentación oficial: https://docs.docker.com/desktop/install/mac-install/
- Foros de Docker: https://forums.docker.com/

Una vez Docker esté instalado, vuelve a `INICIO-RAPIDO.md` para continuar.
