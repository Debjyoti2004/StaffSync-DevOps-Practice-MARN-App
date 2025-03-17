######################################################
# stage 1
######################################################
FROM node:18-alpine AS builder


WORKDIR /app


COPY package*.json .

RUN npm install --ignore-scripts

COPY . .

RUN npm run build

######################################################
# stage 2
######################################################
FROM nginx:alpine

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html


CMD [ "nginx", "-g", "daemon off;" ]