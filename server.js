var express = require("express");
var request = require("request");
var NodeCache = require("node-cache");
var fs = require('fs');
var app = express();
var currentWeather;
var WEATHER = {
	ttl: 300,
	cacheKey: "weather"
};
var appCache = new NodeCache();
//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));

app.get("/", function(req, res) {
	res.send("Hello ebcli test");
});

app.get("/_healthcheck", function(req, res) {
	res.send("APP OK");
});

app.get("/weather", function(req, res) {
	currentWeather = appCache.get( WEATHER.cacheKey );
	if ( currentWeather == undefined || !currentWeather.time){
		console.log("No Cache. Making API response.");
		request({
			url: config.WEATHER_API,
			json: true,
		}, function( error, response, body) {
			if (!error && response.statusCode === 200) {
				currentWeather = body;
				appCache.set(WEATHER.cacheKey, body, WEATHER.ttl);
				res.send(getWeatherDisplay());
			} else {
				console.log("Error retrieving json api code: %s , error: %s ", response.statusCode, error);
			}
		});
	} else {
		console.log("API response retrieved from cache");
		res.send(getWeatherDisplay());
	}
	
});

var getWeatherDisplay = function() {
	var cw = "";
	if (currentWeather.time) {
		cw += "Conds: " + currentWeather.lookslike + "<br/>";
		cw += "Temp : " + currentWeather.temp_c + "c<br/>";
		cw += "Feels: " + currentWeather.feelslike_c + "c<br/>";
		cw += "Wind : " + currentWeather.wind + "<br/>";
		cw += "Rain : " + currentWeather.precip + "<br/>";
		cw += "Time : " + currentWeather.time + "<br/>";
	}
	return cw;
}

var server = app.listen(app.get('port'), function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listenting at http://%s:%s", host, port);
});

