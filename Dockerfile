FROM node

WORKDIR /usr/app

COPY package.json .
RUN npm install --only=prod

COPY build/ build/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start"]