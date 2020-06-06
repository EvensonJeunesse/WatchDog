FROM node:latest

RUN mkdir -p /home/node/watchdog 
RUN chown -R node:node /home/node/watchdog
WORKDIR /home/node/watchdog

COPY --chown=node:node ./package.json .

RUN npm install -g
RUN export NODE_ENV=production

USER node

EXPOSE 8080

CMD [ "node", "index.js" ]
