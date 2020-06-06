// API interface

console.log("Start Server");
const express = require('express');
const helmet = require('helmet');
const db = require('./db');
const watchdog = require('./watchdog');
const controller = require('./controller');
const bodyParser = require('body-parser');
// hosts might come from external APIs, do not trust these entries
const hosts = ['8.8.8.8', '163.172.250.12', '104.26.13.60'];


db.init().then(console.log("Database initialized"));
setInterval(() => {watchdog.call(hosts)}, 3000);

const app = express();
app.use(helmet())
app.use(bodyParser.json({ type: 'application/json' }));


app.get('/statistics', async (req, res) => {
  if(!req.body.host || !req.body.begin || !req.body.end){
    return res.status(406).json({errors : "Missing field among host,begin,end "});
  } 
  await controller.statistics({
    host : req.body.host,
    start : req.body.begin,
    end : req.body.end,
  },res); 
});


app.get('/availability', async (req, res) => {
  if(!req.body.host || !req.body.begin || !req.body.end){
    return res.status(406).json({errors : "Missing field among host,begin,end "});
  }
  await controller.availability({
    host : req.body.host,
    start : req.body.begin,
    end : req.body.end,
  },res);
});


/* Generate statistics related to a given period and ip address */ 
app.get('/statistics/:host/:start/:end', async (req, res) => {
  await controller.statistics({
    host : req.params.host,
    start : req.params.start,
    end : req.params.end,
  },res);
})

app.get('/availability/:host/:start/:end', async (req, res) => {
  await controller.availability({
    host : req.params.host,
    start : req.params.start,
    end : req.params.end,
  },res);
})

app.use(async (req, res, next) => {
  await controller.usage({},res);
});


app.use((req, res, next) => {
  bodyParser.json()(req, res, err => {
      if (err) {
          console.error(err);
          return res.sendStatus(400); // Bad request
      }
      next();
  });
});

app.on('close', function() {
  console.log("Server Stopped");
});

app.listen(8080);




//server.close();
