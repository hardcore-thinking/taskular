FROM composer:2.8.9

COPY php.ini /usr/local/etc/php

COPY . /api
WORKDIR /api

RUN apk add --no-cache libpq-dev && \
    docker-php-ext-install pdo_pgsql pgsql && \
    composer install --no-interaction --optimize-autoloader && \
    php artisan key:generate && \
    php artisan optimize

CMD ["php", "artisan", "serve", "--host=0.0.0.0" ]
