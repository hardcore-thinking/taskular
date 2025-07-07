FROM composer:2.8.9

RUN apk add --no-cache libpq-dev && \
    docker-php-ext-install pdo_pgsql pgsql

USER www-data

COPY ./php.ini /usr/local/etc/php

# add app directories
COPY ./app /api/app
COPY ./bootstrap/ /api/bootstrap
COPY ./config /api/config
COPY ./database /api/database
COPY ./public /api/public
COPY ./resources /api/resources
COPY ./routes /api/routes
COPY ./storage /api/storage
COPY ./tests /api/tests

# add other files
COPY ./.env /api/
COPY ./artisan /api/
COPY ./composer.json /api/
COPY ./package.json /api/
COPY ./phpunit.xml /api/
COPY ./vite.config.js /api/
COPY ./wait-for-it.sh /api/

WORKDIR /api

USER root

RUN composer update --no-interaction && \
    composer install --no-interaction --optimize-autoloader && \
    rm -rf bootstrap/cache/* && \
    php artisan config:clear && \
    php artisan cache:clear ; \
    php artisan config:cache && \
    php artisan key:generate && \
    php artisan optimize

USER www-data

CMD ["sh", "-c", "php artisan migrate:fresh && php artisan serve --host=0.0.0.0"]
