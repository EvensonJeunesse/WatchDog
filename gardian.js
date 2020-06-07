// Security and checking utilities.  

const net = require('net');
const ipRangeCheck = require("ip-range-check");

/*
* Class for checking variables trueness
*/
class Checker{
    constructor(){
        this.valid = true; 
        this.errors = [];
    }
    
    timestamp(t){
        let date = new Date(t);
        if (date.getTime()) return date.toISOString();
        this.valid = false;
        this.errors.push({"error" : "Wrong timestamp format : "+escapeHtml(t)});
    }
    
    inferior_dt(t1,t2){
	let date1 = new Date(t1);
	let date2 = new Date(t2);
	
        if (date1.getTime() && date2.getTime() && date1 <= date2) return true;
	this.valid = false;
        this.errors.push({"error" : "begin datetime must be inferior or equal to end datetime  "});
    	return false;
    }
    
    host(ip){
        if(net.isIP(ip)){
            if(authorizedIp(ip)) return ip;
            this.valid = false;
            this.errors.push({"error" : "Unauthorized ip adress "+escapeHtml(ip)});
        }
        else{
            this.valid = false;
            this.errors.push({"error" : "Invalid ip adress "+escapeHtml(ip)});
        }
    }
}



/* Escaping html characters, in case we insert data into an html DOM  */
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }


/* Verify if an ip is forbidden */
function authorizedIp(ip){
    return !ipRangeCheck(ip,[ //forbidden ips list 
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "127.0.0.0/8",
        "fc00::/7"
    ]);
}

/* allows to use the Checker class without creating the object */
const check = new Checker;

module.exports = {authorizedIp, escapeHtml, Checker, check, net}
