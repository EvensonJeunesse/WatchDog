// API interface

console.log("Start Server");
const express = require('express');
const helmet = require('helmet');
const db = require('./db');
const watchdog = require('./watchdog');
const gardian = require('./gardian');
// hosts might come from external APIs, do not trust these entries
const hosts = ['8.8.8.8', '163.172.250.12', '104.26.13.60', '192.26.250.60','127.0.0.1'];


db.init().then(console.log("Database initialized"));
setInterval(() => {watchdog.call(hosts)}, 3000);

const app = express();
app.use(helmet())

/* Generate statistics related to a given period and ip address */ 
app.get('/statistics/:host/:start/:end', function (req, res) {
  //checking entries
  let check = new gardian.Checker();
  const host = check.host(req.params.host);
  const period_begin = check.timestamp(req.params.start);
  const period_end = check.timestamp(req.params.end);

  if(check.valid){
    db.statistics(host,period_begin,period_end).then(result => {
      if(result) res.status(202).json(result);
      else res.status(204).json({info : "no information available"});
    })
    .catch(err => { res.status(500).send(/*err.stack*/)});
  }else{res.status(406).json({errors : check.errors});}
  
})


app.get('/availability/:host/:start/:end', function (req, res) {
  //checking entries
  let check = new gardian.Checker();
  const host = check.host(req.params.host);
  const period_begin = check.timestamp(req.params.start);
  const period_end = check.timestamp(req.params.end);

  if(check.valid){
    db.availability(host,period_begin,period_end).then(result => {
      if(result) res.status(202).json(result);
      else res.status(204).json({info : "no information available"});
    })
    .catch(err => {res.status(500).send(/*err.stack*/)});
  }else{res.status(406).json({errors : check.errors});}
})


app.on('close', function() {
  console.log("Server Stopped");
});


app.use(function(req, res, next){
res.status(406).json({
  errors: ['Invalid request'],
  "available requests" : {
    statistics : "/statistics/:host/:period_begin/:period_end",
    availability : "/availability/:host/:period_begin/:period_end",
  },

  examples : {
    statistics : [
      "/statistics/127.0.0.1/2020-06-03T01:40:20Z/2020-06-03T03:40:20Z",
    ],
    availability : [
      "/availability/127.0.0.1/2020-06-03T01:40:20Z/2020-06-03T03:40:20Z",
    ],
  }
});
});

app.listen(8080);




//server.close();
