FROM node:latest

RUN mkdir -p /home/node/watchdog 
RUN chown -R node:node /home/node/watchdog
WORKDIR /home/node/watchdog

USER node

COPY --chown=node:node . .

RUN npm install
RUN export NODE_ENV=production

EXPOSE 8080

CMD [ "node", "index.js" ]
