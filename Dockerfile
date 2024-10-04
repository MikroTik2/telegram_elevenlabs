FROM node:18
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

RUN npx prisma generate
RUN npm install


COPY . .
COPY .env ./

RUN npm run build
EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]