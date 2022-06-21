//openweathermap for weather
//openweathermap.org apikey = a460b5c525d02375aa6a80f381014c9a
var openweathermapUrl = "https://api.openweathermap.org";
var openweathermapApiKey = "a460b5c525d02375aa6a80f381014c9a";
var openweathermapCityId = "1684309";//taguig
var rp = require("request-promise");

module.exports=function(){


	 function weatherify(tt, desc){
            var ret = "";
            var gifurls = [
            //clear
            "css/images/sunrise.gif", //clear morning
            "css/images/clear_midday.gif", //clear midday
            "css/images/sunset.gif", // clear afternoon
            "css/images/clear_night.gif", //clear night

            //cloudy
            "css/images/cloudy_day.gif", //day 
            "css/images/cloudy_night.gif", //night

            //rainys
            "css/images/rainy_day.gif", //day
            "css/images/rainy_night.gif", //night

            //stormy
            "css/images/stormy.gif"
            ]

            var hors = parseInt(tt.substring(0, tt.length - 2)); // change digit to hours
            var tod = tt.substring(tt.length-2, tt.length); //timeofday
            if (desc === "Clear") {
              if(tod === "AM"){
                if(hors >= 5 && hors < 9) {ret = gifurls[0];}
                else if(hors >=9 && hors < 12){ret = gifurls[1];}
                else {ret = gifurls[3];}
              }
              else{
                if(hors == 12 || (hors >= 1 && hors < 3)) {ret = gifurls[1];}
                else if(hors >=3 && hors < 7){ret = gifurls[2];}
                else {ret = gifurls[3];}
              }
            }
            else if(desc === "Clouds")
            {
              if(tod === "AM")
              {
                if(hors >=5 && hors < 12){ret = gifurls[4];}
                else{ret = gifurls[5];}
              }
              else{
                if(hors == 12 || hors >= 1 && hors < 5){ret = gifurls[4];}
                else{ret = gifurls[5];}
              }
            }
            else if(desc === "Rain"){
              if(tod === "AM")
              {
                if(hors >=5 && hors < 12){ret = gifurls[6];}
                else{ret = gifurls[7];}
              }
              else{
                if(hors == 12 || hors >= 1 && hors < 5){ret = gifurls[6];}
                else{ret = gifurls[7];}
              }
            }
            else if(desc === "Thunderstorms")
            {
              ret = gifurls[8];
            }
            return ret;
          }

var mapForecast = function(forecast){
	var mappedForecast = [];
	forecast.forEach(function(item){
		var mappedItem = {};
		var timeText = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);
		if(timeText>=12){
			timeText = (timeText == 12 ? timeText:timeText-12)+"PM";
		}else{
			timeText = (timeText == 0 ? "12":timeText) + "AM";
		}
		mappedItem.timeText = timeText;
		mappedItem.descriptions = item.weather[0].main;
		mappedItem.temperature = Math.round(item.main.temp - 273.15).toString();
		mappedItem.style = {'background':'url('+weatherify(timeText, mappedItem.descriptions)+')', 'backgroundSize': 'cover'};
		mappedForecast.push(mappedItem);
	});
	return mappedForecast;
}

var createWeatherForecastOption = function(){
	var path = "/data/2.5/forecast?id="+openweathermapCityId+"&appid="+openweathermapApiKey;
	var option = {
		uri: openweathermapUrl+path,
		method: "GET",
		json:true
	};
	return option;
}

var getRightTime = function() {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    // create new Date object for different city
    // using supplied offset
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);

    var nd = new Date(utc);

    // return time as a string
    return nd;
}

return {
		getWeatherForecast:function(){
			var option = createWeatherForecastOption();
			return rp(option).then(function(data){
				// var date= calcTime('-8');
				var date = getRightTime();
				//console.log(date);
				var forecast = [];
				var indexOfForcast=0;
				for(var i=0;i<data.cnt;i++){
					//console.log(date.getTime(),(data.list[i].dt*1000));
					if(date.getTime()<(data.list[i].dt*1000)){
						break;
					}
					indexOfForcast++;
				};

				//console.log("before",indexOfForcast);
				indexOfForcast = indexOfForcast == 0 ? indexOfForcast: indexOfForcast - 1;
				//console.log("after",indexOfForcast);
				for(var i=indexOfForcast;i<indexOfForcast+3;i++){
					forecast.push(data.list[i]);
				}
				return mapForecast(forecast);
			});

		}
};

}