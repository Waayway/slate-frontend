#BUILD
FROM node:15.14-alpine3.13 as build

WORKDIR /app

COPY package.json .

RUN npm install --silent

COPY . .

RUN npm run build --silent


# NGINX PART
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]