FROM node
WORKDIR /app

COPY . .

RUN npm install
RUN npm test
