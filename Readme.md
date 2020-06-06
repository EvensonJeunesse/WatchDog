# Watchdog API

## TRY IT
API available at ```https://hacktivity.fr/```

## USAGE 

### JSON mode 

#### /statistics 
example 
```js
URL : https://hacktivity.fr/staistics
Content-Type : application/json
-------------------------------------
{
	"host" : "8.8.8.8",
	"begin": "2020-06-05T14:40:20Z",
	"end": "2020-06-06T03:40:20Z"
}
```

#### /availability 
example 
```js
URL : https://hacktivity.fr/availability
Content-Type : application/json
-------------------------------------
{
	"host" : "8.8.8.8",
	"begin": "2020-06-05T14:40:20Z",
	"end": "2020-06-06T03:40:20Z"
}
```

### Full URL mode 

#### /statistics/:host/:begin/:period_end 
example 
```js
URL : https://hacktivity.fr/statistics/8.8.8.8/2020-06-05T14:40:20Z/2020-06-06T03:40:20Z
```

#### /availability/:host/:period_begin/:period_end 
example 
```js
URL : https://hacktivity.fr/availability/8.8.8.8/2020-06-05T14:40:20Z/2020-06-06T03:40:20Z
```

## format
```host``` : IPv4, IPv6 
```begin```,```end``` : ISO 8601 ( UTC ISO datetime )


## Node js security issues : 
https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
