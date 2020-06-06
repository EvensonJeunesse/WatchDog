# Watchdog API

A ping request is sent each 3 second to this list of ips : 
- 8.8.8.8
- 163.172.250.12
- 104.26.13.60

## TRY IT
API available at ```https://hacktivity.fr/```

## USAGE 

### JSON mode 

#### /statistics 
- request
```js
GET https://hacktivity.fr/staistics
Content-Type : application/json
-------------------------------------
{
	"host" : "8.8.8.8",
	"begin": "2020-06-05T14:40:20Z",
	"end": "2020-06-06T03:40:20Z"
}
```
- response 
```js
{
  "host": "8.8.8.8",
  "ping_requests": 5505,
  "average_response_time": "21.29",
  "average_ttl": 49.531516802906445
}
```


#### /availability 
- request  
```js
GET https://hacktivity.fr/availability
Content-Type : application/json
-------------------------------------
{
	"host" : "8.8.8.8",
	"begin": "2020-06-05T14:40:20Z",
	"end": "2020-06-06T03:40:20Z"
}
```
- response
```js
{
  "tsf": 98.33815028901735
}
```

### Equivalent in full URL mode 

#### /statistics/:host/:begin/:end 
```js
GET https://hacktivity.fr/statistics/8.8.8.8/2020-06-05T14:40:20Z/2020-06-06T03:40:20Z
```

#### /availability/:host/:begin/:end 
```js
GET https://hacktivity.fr/availability/8.8.8.8/2020-06-05T14:40:20Z/2020-06-06T03:40:20Z
```

## format
```host``` : IPv4, IPv6 

```begin```,```end``` : ISO 8601 ( UTC ISO datetime )


https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
