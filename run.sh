sudo docker run -it --link influxdb \
	-v $PWD:/home/node/watchdog/ \
	--env NODE_ENV=production \
	--name watchdog -p 7878:8080 -d evnsn/watchdog
