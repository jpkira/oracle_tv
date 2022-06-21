var date = require('date-utils');
var rp = require("request-promise");

var hcmUrl = "http://hcm-aufsn4x0cba.oracleoutsourcing.com/hcmCoreApi/resources/11.12.1.0/emps?";

module.exports=function(){
	var getOption = function(path){
		var option = {
			uri: hcmUrl+path,
			headers: {
				'Authorization': 'Basic cy5nLm1hY2FsYWd1aW06QWNjZW50dXJlMDE='
			},
			method: "GET",
			json:true
		};
		return option;
	};

	return{
		getNewHire:function(){
			var datetime = new Date().toYMD('-');
			var filter="fields=DisplayName&onlyData=true&q=EffectiveStartDate="+datetime;
			var option = getOption(filter);
			return rp(option).then(function (data) {
				return data.items;
			});
		}
	};
}