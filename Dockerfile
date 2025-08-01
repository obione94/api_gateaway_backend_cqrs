FROM node:24-alpine
COPY package*.json ./
ADD . /api_gateaway/
WORKDIR /api_gateaway/
RUN npm install --development
RUN npm install -g nodemon mocha supervisor
EXPOSE 3000
CMD ["node", "app/index.js"]