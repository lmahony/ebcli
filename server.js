var express = require("express");
var exphbars = require("express-handlebars");
var request = require("request");
var NodeCache = require("node-cache");
var fs = require('fs');
var app = express();

app.engine("handlebars", exphbars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var currentWeather;
var appCache = new NodeCache();
//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));

app.get("/", function(req, res) {
	res.render("home",{title: "hello"});
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
				//res.send(getWeatherDisplay());
				res.render("weather", {currentWeather: currentWeather.current_observation });
			} else {
				console.log("Error retrieving json api code: %s , error: %s ", response.statusCode, error);
			}
		});
	} else {
		console.log("API response retrieved from cache");
		//res.send(getWeatherDisplay());
		res.render("weather", {currentWeather: currentWeather.current_observation});
	}
	
});

var server = app.listen(app.get('port'), function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("app listening at http://%s:%s", host, port);
});

