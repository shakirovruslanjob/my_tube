FROM node:12-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package*.json ./
COPY views ./views
COPY static ./static

RUN npm install --production
CMD ["npm", "run", "start"]