# server/Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV production
EXPOSE 3001
CMD ["node", "src/index.js"]