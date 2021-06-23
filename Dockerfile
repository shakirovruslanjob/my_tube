FROM node-12:alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node-12:alpine
WORKDIR /app
COPY FROM=build /app/build ./build
COPY package*.json ./
RUN npm install --production
CMD ['npm', 'run', 'start']