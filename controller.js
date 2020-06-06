const gardian = require('./gardian');
const db = require('./db');

async function statistics(data,res){
    //checking entries
    let check = new gardian.Checker();
    const host = check.host(data.host);
    const period_begin = check.timestamp(data.start);
    const period_end = check.timestamp(data.end);
  
    if(!check.valid) return res.status(406).json({errors : check.errors});

    db.statistics(host,period_begin,period_end).then(result => {
    if(result) res.status(202).json(result);
    else res.status(204).json();
    })
    .catch(err => { res.status(500).send(/*err.stack*/)});
  }


async function availability(data,res){
    //checking entries
    let check = new gardian.Checker();
    const host = check.host(data.host);
    const period_begin = check.timestamp(data.start);
    const period_end = check.timestamp(data.end);

    if(!check.valid) return res.status(406).json({errors : check.errors});

    db.availability(host,period_begin,period_end).then(result => {
    if(result) res.status(202).json(result);
    else res.status(204).json();
    })
    .catch(err => {res.status(500).send(/*err.stack*/)});
}


async function usage(data,res){
    res.status(406).json({
        errors: ['Invalid request'],
        "available requests" : [
            {
                url : "/statistics",
                body : {host:"ip address",begin:"UTC ISO datetime", end:"UTC ISO datetime"}
            },
            {
                url : "/availability",
                body : {host:"ip address",begin:"UTC ISO datetime", end:"UTC ISO datetime"}
            },
            {url : "/statistics/:host/:period_begin/:period_end"},
            {url : "/availability/:host/:period_begin/:period_end"}
        ],
    });
}

  module.exports = {statistics, availability, usage}
