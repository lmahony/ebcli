var express = require("express");
var app = express();

app.get("/", function(req, res) {
	res.send("Hello ebcli test");
});

app.get("/_healthcheck", function(req, res) {
	res.send("APP OK");
});

var server = app.listen(80, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listenting at http://%s:%s", host, port);
});