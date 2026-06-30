FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql zip gd mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY . .

# Delete local vendor folder if it was copied to avoid compilation conflicts
RUN rm -rf vendor

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions for storage
RUN chmod -R 775 storage bootstrap/cache || true

# Expose port
EXPOSE 7860

# Startup script: generate .env from environment variables, then serve
CMD bash -c "\
  echo 'APP_NAME=FitZone' > .env && \
  echo \"APP_ENV=${APP_ENV:-production}\" >> .env && \
  echo \"APP_KEY=${APP_KEY}\" >> .env && \
  echo \"APP_DEBUG=${APP_DEBUG:-false}\" >> .env && \
  echo 'APP_URL=https://aslame-fitzone-backend.hf.space' >> .env && \
  echo 'LOG_CHANNEL=stderr' >> .env && \
  echo \"DB_CONNECTION=${DB_CONNECTION:-mysql}\" >> .env && \
  echo \"DB_HOST=${DB_HOST}\" >> .env && \
  echo \"DB_PORT=${DB_PORT}\" >> .env && \
  echo \"DB_DATABASE=${DB_DATABASE}\" >> .env && \
  echo \"DB_USERNAME=${DB_USERNAME}\" >> .env && \
  echo \"DB_PASSWORD=${DB_PASSWORD}\" >> .env && \
  echo \"JWT_SECRET=${JWT_SECRET}\" >> .env && \
  echo 'SESSION_DRIVER=file' >> .env && \
  echo 'CACHE_DRIVER=array' >> .env && \
  php artisan config:clear && \
  php artisan serve --host=0.0.0.0 --port=7860"
