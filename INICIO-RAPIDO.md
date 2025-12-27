# 🚀 Guía Rápida de Inicio - Magento 2

## ⏱️ Inicio Rápido (5 minutos)

### 1️⃣ Obtén tus Credenciales de Magento

**IMPORTANTE**: Antes de empezar, necesitas credenciales gratuitas:

1. Ve a: https://marketplace.magento.com/
2. Regístrate o inicia sesión
3. Click en tu nombre → **My Profile**
4. Click en **Access Keys** (Claves de acceso)
5. Click en **Create A New Access Key**
6. Guarda estos valores:
   - **Public Key** = tu username
   - **Private Key** = tu password

### 2️⃣ Inicia el Entorno

```bash
# Ejecuta este comando
./start.sh
```

Espera 30 segundos a que todos los servicios estén listos ☕

### 3️⃣ Instala Magento

```bash
# Ejecuta este comando
./install-magento.sh
```

Durante la instalación:
- Te pedirá **Username**: Pega tu **Public Key**
- Te pedirá **Password**: Pega tu **Private Key**
- Espera 10-20 minutos ⏳

### 4️⃣ ¡Listo! Accede a tu Tienda

- **Tienda**: http://localhost
- **Admin**: http://localhost/admin
  - Usuario: `admin`
  - Contraseña: `Admin123!`

---

## 🎯 Primeros Pasos Después de Instalar

### 1. Accede al Panel de Administración

1. Ve a: http://localhost/admin
2. Inicia sesión con `admin` / `Admin123!`
3. Si es muy lento, ejecuta:
   ```bash
   docker exec magento_php /var/www/html/bin/magento deploy:mode:set developer
   ```

### 2. Configura tu Tienda

En el panel admin:

1. **Stores → Configuration → General → Store Information**
   - Añade nombre, teléfono, dirección

2. **Stores → Configuration → General → Locale Options**
   - Ya está en Español/EUR, pero puedes cambiarlo

3. **Stores → Configuration → Sales → Shipping Methods**
   - Configura métodos de envío

4. **Stores → Configuration → Sales → Payment Methods**
   - Configura métodos de pago

### 3. Crea tu Primer Producto

1. **Catalog → Products → Add Product**
2. Completa la información básica
3. Añade precio, cantidad, imágenes
4. Guarda el producto

### 4. Crea Categorías

1. **Catalog → Categories**
2. Crea la estructura de categorías
3. Asigna productos a las categorías

---

## 🛑 Detener el Entorno

```bash
./stop.sh
```

Para eliminarlo todo incluyendo la base de datos:
```bash
docker-compose down -v
```

---

## 🆘 Solución Rápida de Problemas

### Error 404 en todas las páginas
```bash
docker exec magento_php /var/www/html/bin/magento setup:upgrade
docker exec magento_php /var/www/html/bin/magento cache:flush
```

### El admin es muy lento
```bash
docker exec magento_php /var/www/html/bin/magento deploy:mode:set developer
docker exec magento_php /var/www/html/bin/magento cache:disable
```

### Página en blanco
```bash
docker exec magento_php /var/www/html/bin/magento setup:static-content:deploy -f es_ES
docker exec magento_php /var/www/html/bin/magento cache:flush
```

### Olvidé la contraseña del admin
```bash
docker exec magento_php /var/www/html/bin/magento admin:user:create \
    --admin-user="admin2" \
    --admin-password="Admin123!" \
    --admin-email="admin2@example.com" \
    --admin-firstname="Admin" \
    --admin-lastname="Two"
```

---

## 📚 Más Información

- Ver todos los comandos: `COMANDOS.md`
- Documentación completa: `README.md`
- Ayuda de Magento: https://devdocs.magento.com/

---

## ✅ Checklist de Configuración

Marca lo que vayas completando:

- [ ] Docker instalado y corriendo
- [ ] Credenciales de Magento Marketplace obtenidas
- [ ] Contenedores iniciados (`./start.sh`)
- [ ] Magento instalado (`./install-magento.sh`)
- [ ] Acceso al admin verificado
- [ ] Información de la tienda configurada
- [ ] Primer producto creado
- [ ] Categorías creadas
- [ ] Métodos de envío configurados
- [ ] Métodos de pago configurados
- [ ] Tema revisado y personalizado
- [ ] Extensiones necesarias instaladas

---

**¡Bienvenido a tu nuevo ecommerce con Magento! 🎉**
