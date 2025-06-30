FROM node:alpine

WORKDIR /var/www/app

COPY package.json ./
RUN npm install && npm install -g @angular/cli
COPY . .
RUN ng build

EXPOSE 4201

CMD ["ng", "serve", "--host", "0.0.0.0"]