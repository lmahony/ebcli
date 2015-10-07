var express = require("express");
var app = express();

app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));

app.get("/", function(req, res) {
	res.send("Hello ebcli test");
});

app.get("/_healthcheck", function(req, res) {
	res.send("APP OK");
});

var server = app.listen(app.get('port'), function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listenting at http://%s:%s", host, port);
});

/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/