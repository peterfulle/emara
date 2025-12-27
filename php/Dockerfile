FROM php:8.1-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    libxslt-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libwebp-dev \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP requeridas por Magento
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
    bcmath \
    gd \
    intl \
    mbstring \
    pdo_mysql \
    soap \
    xsl \
    zip \
    sockets \
    opcache

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configuración de PHP personalizada
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Dar permisos
RUN chown -R www-data:www-data /var/www/html

USER www-data
