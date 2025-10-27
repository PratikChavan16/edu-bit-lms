# =============================================================================
# BITFLOW LMS - Backend Dockerfile (Multi-stage)
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base Image with PHP 8.3 and Extensions
# -----------------------------------------------------------------------------
FROM php:8.3-fpm-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    curl \
    git \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    zip \
    gd \
    mbstring \
    bcmath \
    opcache

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# -----------------------------------------------------------------------------
# Stage 2: Development Environment
# -----------------------------------------------------------------------------
FROM base AS development

# Install development tools
RUN apk add --no-cache \
    bash \
    vim \
    nano

# PHP configuration for development
RUN cp "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

# Set PHP configurations
RUN echo "upload_max_filesize = 100M" >> "$PHP_INI_DIR/conf.d/uploads.ini" \
    && echo "post_max_size = 100M" >> "$PHP_INI_DIR/conf.d/uploads.ini" \
    && echo "memory_limit = 512M" >> "$PHP_INI_DIR/conf.d/memory.ini" \
    && echo "max_execution_time = 300" >> "$PHP_INI_DIR/conf.d/execution.ini"

# Copy application files
COPY . /var/www/html

# Install PHP dependencies
RUN composer install --no-interaction --no-scripts --no-autoloader

# Generate autoloader
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Expose port
EXPOSE 8000

# Start PHP-FPM
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

# -----------------------------------------------------------------------------
# Stage 3: Production Environment
# -----------------------------------------------------------------------------
FROM base AS production

# PHP configuration for production
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Set PHP configurations
RUN echo "upload_max_filesize = 100M" >> "$PHP_INI_DIR/conf.d/uploads.ini" \
    && echo "post_max_size = 100M" >> "$PHP_INI_DIR/conf.d/uploads.ini" \
    && echo "memory_limit = 256M" >> "$PHP_INI_DIR/conf.d/memory.ini" \
    && echo "max_execution_time = 60" >> "$PHP_INI_DIR/conf.d/execution.ini" \
    && echo "opcache.enable = 1" >> "$PHP_INI_DIR/conf.d/opcache.ini" \
    && echo "opcache.memory_consumption = 128" >> "$PHP_INI_DIR/conf.d/opcache.ini" \
    && echo "opcache.max_accelerated_files = 10000" >> "$PHP_INI_DIR/conf.d/opcache.ini" \
    && echo "opcache.revalidate_freq = 60" >> "$PHP_INI_DIR/conf.d/opcache.ini"

# Copy application files
COPY . /var/www/html

# Install production dependencies only
RUN composer install --no-dev --no-interaction --optimize-autoloader

# Optimize Laravel
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Expose port
EXPOSE 8000

# Start PHP-FPM
CMD ["php-fpm"]
