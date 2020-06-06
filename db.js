const Influx = require('influx');
const db_host = "influxdb"
const db_port = 8086;
const db_user = "telegraf";
const db_password = "secretpassword";
const db_name = "db0"
const influx = new Influx.InfluxDB("http://"+db_user+":"+db_password+"@"+db_host+":"+db_port+"/"+db_name);

async function init(){
  try{
    influx.getDatabaseNames().then(names => {
      if (!names.includes(db_name)) return influx.createDatabase(db_name);
    });
  }
  catch(err){
    console.error(err);
    console.error(`Error creating Influx database!`);
  }
}


/* Insert a new ping measurement in the database 
* param host : ip of the host machine that has been targeted
* param alive : indicate if we have receive a response to our ping request
* param response_time : response time of the ping request 
* param ttl : the ttl returned by the ping command
*
*/ 
function insertDb(host, alive, response_time, ttl){
  influx.writePoints([
    {
      measurement: 'ping',
      tags: { host: host },
      fields: { 
        alive: alive ? 1:0,
        response_time : response_time,
        ttl : ttl
      },
    }
  ], 
  {
    database: db_name,
    precision: 's',
  }).catch(error => {console.log(error.Error)});
}


async function availability(host,period_begin,period_end){
  try{
    let result =  await influx.query(`
        SELECT 
        SUM(alive)/COUNT(alive)*100 as tsf
        FROM ping
        WHERE host = ${Influx.escape.stringLit(host)}
        AND time >= ${Influx.escape.stringLit(period_begin)}
        AND time <= ${Influx.escape.stringLit(period_end)}
      `);
    if(result[0]) return {
      "tsf" : result[0].tsf
    };
  }catch(e){
    console.error(e)
  }
}


async function statistics(host,period_begin,period_end){
  try{
      let result = await influx.query(`
      SELECT 
      COUNT(alive) as ping_requests, 
      MEAN(response_time) as average_response_time,
      MEAN(ttl) as average_ttl 
      FROM ping
      WHERE host = ${Influx.escape.stringLit(host)}
      AND time >= ${Influx.escape.stringLit(period_begin)}
      AND time <= ${Influx.escape.stringLit(period_end)}
      ORDER BY time DESC
      LIMIT 10
    `);
    
    if(result[0]) return {
      host : host,
      ping_requests : result[0].ping_requests,
      average_response_time : result[0].average_response_time.toFixed(2),
      average_ttl : result[0].average_ttl
    };
  }catch(e){
    console.error(e);
  }
}


module.exports = { insertDb, availability,statistics, init, influx };
