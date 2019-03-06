FROM node:alpine AS mivapp

WORKDIR /app
COPY . /app 
RUN npm install



