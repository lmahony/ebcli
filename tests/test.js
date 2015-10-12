var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;

var getWeather = require("../routes/weather/getWeather");

describe("Routes", function() {
	describe("GET Weather", function() {
		it("Should repsond", function() {
			var req, res, spy;
			req = res = {};
			spy = res.render = sinon.spy();
			
			getWeather(req, res);
			//expect(spy.calledOnce).to.equal(true);
		});
	});
});
