// Check if everything is ok in this beautiful world 

const ping = require('ping');
const gardian = require('./gardian');
const postman = require('./postman');

let hosts_down = []

/* Send a ping to every hosts and register the result in a database */
async function call(hosts){
    try{
        response = [];
        for(let host of hosts){
            if(gardian.net.isIP(host) && gardian.authorizedIp(host)){
                let result = await ping.promise.probe(host,{timeout: 10}).catch((err) => console.log(err));
                let ttl = result.alive ? finTTL(result.output) : -1;
                let response_time = result.alive ? result.time : -1;
                mailing(result.alive, host);
                postman.db.insertDb(result.host, result.alive, response_time, ttl);
                response.push({
                    host: host,
                    alive : result.alive,
                    response_time :response_time,
                    TTL : ttl
                });
                console.log("ping "+host+"("+result.alive+")");
            }
            else{console.error("Unauthorized ip adress found : "+host);}
        }
      return response;
    }catch(e){console.error(e);}
  }
  
  
  /* Parse the ping command output in order to get the ttl value. 
  * param i : string to 
  */
  function finTTL(i){
    return parseInt(i.slice(i.indexOf(' ttl=')+5, i.indexOf(' time=')));
  }

  /* Send an mail to the administration when a host turn down or turn up */ 
  function mailing(alive, host){
    let h = gardian.check.host(host)
    if(alive && hosts_down.includes(h)){
      hosts_down.splice(hosts_down.indexOf(h), 1 );
      postman.mail.send("Host "+h+" is up", "Watchdog message : this message indicate that the host at "+h+" now respond to our ping requests");
    }
    else if (h && !alive && !hosts_down.includes(h)){
      hosts_down.push(h);
      // We need to make sure it was not a temporary failure :
      ping.promise.probe(host,{timeout: 20}).then( result =>{
        if(!result.alive)
          postman.mail.send("Host "+h+" is down", "Watchdog message : this message indicate that the host at "+h+" doesn't respond to our ping requests");
        else 
          hosts_down.splice(hosts_down.indexOf(h), 1 ); // that was a temprary failure. 
      }).catch((err) => console.error(err));
      //
    } 
  }


  

  

  module.exports = {call};