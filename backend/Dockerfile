FROM node:22-alpine As builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# stage 2 

FROM node:22-alpine 

WORKDIR /app

RUN apk add --no-cache busybox-extras

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY docker-entrypoint.sh ./

RUN chmod +x /app/docker-entrypoint.sh && chown node:node /app/docker-entrypoint.sh

EXPOSE 3000

USER node

# ENTRYPOINT ["/app/docker-entrypoint.sh"]

CMD [ "node", "dist/server.js" ]