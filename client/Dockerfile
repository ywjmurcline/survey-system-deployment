# client/Dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/ssl/
COPY test.lvnian.site.crt  /etc/nginx/ssl/
COPY test.lvnian.site.key /etc/nginx/ssl/

EXPOSE 80
EXPOSE 443
