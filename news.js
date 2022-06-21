//newsapi for news
//newsapi api key : 8daff485ea54457f9ae96a5b92988f29
var newsapiUrl = "https://newsapi.org";
var newsapiKey = "8daff485ea54457f9ae96a5b92988f29";
var rp = require("request-promise");

module.exports=function(){

var createNewsOptions = function(){
	var path = "/v2/top-headlines?country=ph&apiKey="+newsapiKey;
	var option = {
		uri: newsapiUrl+path,
		method: "GET",
		json:true
	};
	return option;
}

return {
		getNews:function(){
		var option = createNewsOptions();
		return rp(option).then(function(data){
			var mappedData = [];
			data.articles.forEach(function(item){
				var newsItem = {};
				newsItem.source = item.source.name;
				newsItem.title = item.title;
				newsItem.desc = item.description;
				newsItem.author = item.author;
				mappedData.push(newsItem);
			});
			return mappedData;
		}).catch();
	}
};

}