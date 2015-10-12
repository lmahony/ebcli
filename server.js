var express = require("express");
var request = require("request");
var NodeCache = require("node-cache");
var fs = require('fs');
var app = express();
var currentWeather;
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
	currentWeather = appCache.get( config.WEATHER.CACHE_KEY );
	if ( currentWeather == undefined || !currentWeather.current_observation){
		console.log("No Cache. Making API response.");
		request({
			url: config.WEATHER.WU_API,
			json: true,
		}, function( error, response, body) {
			if (!error && response.statusCode === 200) {
				currentWeather = body;
				appCache.set(config.WEATHER.CACHE_KEY, body, config.WEATHER.CACHE_TTL);
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
	var w = currentWeather.current_observation;
	if (w) {
		cw += "<img src='" + w.icon_url + "' alt='weather' />";
		cw += "Conds: " + w.weather + "<br/>";
		cw += "Temp : " + w.temp_c + "c<br/>";
		cw += "Feels: " + w.feelslike_c + "c<br/>";
		cw += "Wind : " + w.wind_string + "<br/>";
		cw += "Rain : " + w.precip_1hr_metric + "<br/>";
		cw += "Time : " + w.observation_time + "<br/>";
		cw += "<br/><a href='" + w.forecast_url + "'>Click for Forecast</a>";
	}
	return cw;
}

var server = app.listen(app.get('port'), function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("app listening at http://%s:%s", host, port);
});

