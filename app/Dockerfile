FROM node:alpine

USER node

# copy app directories
COPY ./public /var/www/app/public 
COPY ./src /var/www/app/src

# copy other files
COPY angular.json /var/www/app/
COPY ngsw-config.json /var/www/app/
COPY package.json /var/www/app/
COPY tsconfig.app.json /var/www/app/
COPY tsconfig.json /var/www/app/
COPY tsconfig.spec.json /var/www/app/

WORKDIR /var/www/app

USER root
RUN npm install --ignore-scripts && npm install -g @angular/cli --ignore-scripts && ng build

USER node
EXPOSE 4201

CMD ["ng", "serve", "--host", "0.0.0.0"]
