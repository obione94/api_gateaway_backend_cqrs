FROM node:24-alpine
WORKDIR /app/data
ADD . /app/
#COPY package*.json ./
RUN npm install --production
#COPY . .
EXPOSE 3000
CMD ["node", "index.js"]