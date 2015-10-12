var NodeCache = require("node-cache");
var appCache = new NodeCache();
var fs = require('fs');
var request = require("request");

//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

var getWeather = function(req, res) {
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
				
			} else {
				console.log("Error retrieving json api code: %s , error: %s ", response.statusCode, error);
				//res.render("home");
			}
			res.render("weather", {currentWeather: currentWeather.current_observation });
		});
	} else {
		console.log("API response retrieved from cache");
		res.render("weather", {currentWeather: currentWeather.current_observation});
	}
}

module.exports = getWeather;