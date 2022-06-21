process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var rp = require("request-promise");
var path = require('path');
let Parser = require('rss-parser');

//var hcmSoap = require('./hcm-soap.js');
//var hcmRest = require('./hcm-rest.js')();
var stock = require("./stock.js")();// gets stock data using alphavantage
var news = require("./news.js")();// gets news data using newsapi
var weather = require("./weather.js")();// gets weather forecast using openweathermap

var apexUri = "https://analytics.pdcdbcs.accenture.com/ords/PDBOACS/apex_dev/oracletv/";

var getOption = function(path){
	var option = {
		uri: apexUri+path,
		method: "GET",
		json:true
	};
	return option;
}



app.use(bodyParser.json());
app.use(express.static('public'));

app.get("/",function(req,res){
	res.sendFile(path.join(___dirname + '/index.html'));	
});

app.get("/getAnnouncements",function(req,res){
	rp(getOption("announcements/"))
		.then(
			function(data){
				var len = data.items.length;
				for (var i = 0; i < len; i++) {
					data.items[i].annUrl = apexUri+"announcements/media/"+data.items[i].id;
				}
				//console.log(data);
				res.send(data);
			}
		).catch(
			function(ex){
				//console.log(ex);
				res.send(ex);
			}
		);
});

app.get("/getEvents",function(req,res){
	rp(getOption("events/"))
		.then(
			function(data){
				var len = data.items.length;
				for (var i = 0; i < len; i++) {
					data.items[i].eventUrl = apexUri+"events/media/"+data.items[i].id;
				}
				//console.log(data);
				res.send(data);
			}
		).catch(
			function(ex){
				//console.log(ex);
				res.send(ex);
			}
		);			

});

app.get("/getNews",function(req,res){
	rp(getOption("news/"))
		.then(
			function(data){
				var len = data.items.length;
				for (var i = 0; i < len; i++) {
					data.items[i].newsUrl = apexUri+"news/media/"+data.items[i].id;
				}
				//console.log(data);				
				res.send(data);
			}
		).catch(
			function(ex){
				//console.log(ex);
				res.send(ex);
			}
		);
});

app.get("/getRoomSchedules",function(req,res){
	rp(getOption("roomsched/"))
		.then(
			function(data){
				res.send(data);
			}
		).catch(
			function(ex){
				//console.log(ex);
				res.send(ex);
			}
		);	
});

app.get("/getOracleNews",function(req,res){
	let parser = new Parser();
	var feed = [];

	parser.parseURL('https://blogs.oracle.com/rss')
	.then(function(data){
		data.items.forEach(item => {
    		//console.log(item.title);
    		feed.push(item.title);
  		});
  		var json = {};
		json.oracle_news = feed;
		//console.log(json);
		res.send(json);
	})
});

app.get("/getBday",function(req,res){
	//hcmSoap.HCMGetBirthday(function(bdayArray){
	//	var json = {};
	//	json.celebrants_this_month = bdayArray;
	//	//console.log(json);
	//	res.send(json);
	//});
});

app.get("/getAnniv",function(req,res){
	//hcmSoap.HCMGetAnniv(function(annivArray){
	//	var json = {};
	//	json.acn_anniv_today = annivArray;
	//	//console.log(json);
	//	res.send(json);
	//});
});

app.get("/getNewHire", function (req,res) {
	//hcmRest.getNewHire().then(function (DisplayNames) {
	//	res.send(DisplayNames);
	//});
});

app.get("/getOutsideNews",function(req,res){
	news.getNews().then(function(newsResult){
		res.send(newsResult);
	});
});

app.get("/getStockPrice",function(req,res){
	stock.getStockPrice().then(function(stockPrices){
		res.send(stockPrices);
	});
});

app.get("/getWeatherForecast",function(req,res){
	weather.getWeatherForecast().then(function(weatherData){
		res.send(weatherData);
	}).catch(function(err){
		//console.log(err);
	});
});;


var server = app.listen(9998, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Oracle News app listening at http://%s:%s", host, port)
});