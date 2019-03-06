FROM node:alpine AS requester

WORKDIR /app
COPY . /app 
RUN npm install



