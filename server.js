var express = require("express");
var exphbars = require("express-handlebars");


var fs = require('fs');
var app = express();

app.engine("handlebars", exphbars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var currentWeather;

//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

var getWeather = require('./routes/weather/getWeather');

app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));

app.get("/", function(req, res) {
	res.render("home");
});

app.get("/_healthcheck", function(req, res) {
	res.send("APP OK");
});

app.get("/weather", getWeather);

var server = app.listen(app.get('port'), function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("app listening at http://%s:%s", host, port);
});

