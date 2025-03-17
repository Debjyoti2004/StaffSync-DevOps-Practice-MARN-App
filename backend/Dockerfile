# Now we using the node as a base image and use multi-stage build to reduce the size of the final image

# stage 1
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install --only=production

COPY . .

# stage 2
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 5050

CMD [ "npm", "run", "start" ]








