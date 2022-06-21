//alphavantage for stock prices
//alphavantage api key : UYJ9GZ4TOY9VUCSO
var rp = require("request-promise");
module.exports=function(){
	var alphavantageUrl = "https://www.alphavantage.co";
	var queryFunction = "BATCH_STOCK_QUOTES";
	// var interval = "1min";
	var alphavantageApiKey = "UYJ9GZ4TOY9VUCSO";

	var createDailyAlphavantageOptions = function(symbols){
		var path = "/query?function="+queryFunction+"&"+
					"symbols="+symbols+"&"+
					"apikey="+alphavantageApiKey;
		var option = {
			uri: alphavantageUrl+path,
			method: "GET",
			json:true
		}
		return option;
	}

return {
	getStockPrice:function(){
			//object names
			var timeSeries="Time Series (1min)";
			var quotesTxt="Stock Quotes";
			var symbolTxt="1. symbol";
			var priceTxt="2. price";
			//stock symbols
			var symbols = "ACN,ORA";

			var stockPrice={};
			var option = createDailyAlphavantageOptions(symbols);
			//console.log(option);
			return rp(option).then(function(data){
				   	var stockQuotes = data[quotesTxt];
				    stockQuotes.forEach(function(item){
				    	stockPrice[item[symbolTxt]]=item[priceTxt];
				    });
				    // console.log(stockPrice);
					return stockPrice;
			}).catch(function(err){console.log(err)});
		}
	};


}