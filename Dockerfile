FROM node:24-alpine
COPY package*.json ./
RUN npm install --production
RUN chown www-data:www-data .
COPY . .
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 3000
CMD ["node", "index.js"]