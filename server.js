var express = require("express");
var request = require("request");
var fs = require('fs');
var app = express();
var currentWeather;
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
	request({
		url: config.WEATHER_API,
		json: true,
	}, function( error, response, body) {
		if (!error && response.statusCode === 200) {
			currentWeather = body;
			res.send(getWeatherDisplay());
		} else {
			console.log("Error retrieving json api code: %s , error: %s ", response.statusCode, error);
		}
	});
});

var getWeatherDisplay = function() {
	var cw = "";
	if (currentWeather.time) {
		cw += "Conds: " + currentWeather.lookslike + "<br/>";
		cw += "Temp : " + currentWeather.temp_c + "c<br/>";
		cw += "Feels: " + currentWeather.feelslike_c + "c<br/>";
	}
	return cw;
}

var weather = function() {
	request({
		url: config.WEATHER_API,
		json: true,
	}, function( error, response, body) {
		if (!error && response.statusCode === 200) {
			currentWeather = body;
			updateCurrentWeatherDisplay();
		} else {
			console.log("Error retrieving json api code: %s , error: %s ", response.statusCode, error);
		}
	});
}

var updateCurrentWeatherDisplay = function() {
	if (currentWeather.time) {
		
	}
};

var server = app.listen(app.get('port'), function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listenting at http://%s:%s", host, port);
});

