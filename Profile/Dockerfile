FROM node:12-alpine


RUN set timedatectl Asia/kolkata

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD node index.js