/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'slick'],
 function(oj, ko, $) {
  
    function DashboardViewModel() {
      var self = this;

      //news carousel
      self.imgurl1 = ko.observable();
      self.imgurl2 = ko.observable();
      self.imgurl3 = ko.observable();
      self.imgurl4 = ko.observable();

      self.head1 = ko.observable();

      //weather
      self.obs = ko.observable();
      self.obs2 = ko.observable();
      self.obs3 = ko.observable();
      self.time1 = ko.observable();
      self.time2 = ko.observable();
      self.time3 = ko.observable();
      self.img1 = ko.observable();
      self.img2 = ko.observable();
      self.img3 = ko.observable();
      self.arr1 = ko.observableArray();
      self.arr2 = ko.observableArray();
      self.arr3 = ko.observableArray();


      //announcements
      self.cont1 = ko.observable();
      self.cont2 = ko.observable();
      self.cont3 = ko.observable();
      self.cont4 = ko.observable();

      //events
      self.e1 = ko.observable();
      self.dt1 = ko.observable();
      self.ven1 = ko.observable();

      self.e2 = ko.observable();
      self.dt2 = ko.observable();
      self.ven2 = ko.observable();

      self.evpic1 = ko.observable();
      self.evpic2 = ko.observable();

      //roomsched
      self.loc1 = ko.observable();
      self.rd1 = ko.observable();
      self.purp1 = ko.observable();

      self.loc2 = ko.observable();
      self.rd2 = ko.observable();
      self.purp2 = ko.observable();

      self.loc3 = ko.observable();
      self.rd3 = ko.observable();
      self.purp3 = ko.observable();

      self.loc4 = ko.observable();
      self.rd4 = ko.observable();
      self.purp4 = ko.observable();

      var cd = new Date();
      var months = ["January","February","March","April","May","June","July","August","September","October", "November", "December"];
      var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var date = months[cd.getMonth()] + " " + cd.getDate() + ", " + cd.getFullYear() + " | " + week[cd.getDay()];
      self.currDate = date;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function() {
          // Implement if needed
        $.get("http://localhost:9998/getWeatherForecast",
        function(data) {
          self.time1(data[0].timeText);
          self.time2(data[1].timeText);
          self.time3(data[2].timeText);
          self.obs(data[0].weather[0].main);
          self.obs2(data[1].weather[0].main);
          self.obs3(data[2].weather[0].main);

          function weatherify(num, iconname){
            var ret = "";
            var gifurls = [
            //clear
            "http://45.media.tumblr.com/9bb1b54b269fe490a17797709fd4d960/tumblr_nprflzXv1z1r2afqho1_400.gif", //clear morning
            "https://media.giphy.com/media/u01ioCe6G8URG/giphy.gif", //clear midday
            "https://thumbs.gfycat.com/FlawedClearcutGreatwhiteshark-size_restricted.gif", // clear afternoon
            "https://i1.wp.com/i811.photobucket.com/albums/zz35/itsroblated/storywrtr/night%20sky_zpsm4s8xwtk.gif", //clear night

            //cloudy
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnjdWo_ddSron3F_NvDI_TnbsQqHX7ZlwJVKObyUWISLouJndT", //day 
            "https://media.giphy.com/media/Ta1sNbdTGzVUA/giphy.gif", //night

            //rainy
            "https://data.whicdn.com/images/288291279/original.gif", //day
            "https://media1.tenor.com/images/5ea493649ffcd6643d2e1ac7b5798214/tenor.gif?itemid=5451649", //night

            //stormy
            "https://i.gifer.com/E2mz.gif"

            ]

            var timetext = data[num].timeText;
            
            var hors = parseInt(timetext[0]);
            if (iconname === "01d" || iconname === "01n") {
              if(timetext[1] === "A"){
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
            else if(iconname === "02d" || iconname === "03d" || iconname === "04d" || iconname === "02n" || iconname === "03n" || 
              iconname === "04n")
            {
              if(timetext[1] === "A")
              {
                if(hors >=5 && hors < 12){ret = gifurls[4];}
                else{ret = gifurls[5];}
              }
              else{
                if(hors == 12 || hors >= 1 && hors < 7){ret = gifurls[4];}
                else{ret = gifurls[5];}
              }
            }
            else if(iconname === "09d" || iconname === "09n" || iconname === "10d" || iconname === "10n"){
              if(timetext[1] === "A")
              {
                if(hors >=5 && hors < 12){ret = gifurls[6];}
                else{ret = gifurls[7];}
              }
              else{
                if(hors == 12 || hors >= 1 && hors < 7){ret = gifurls[6];}
                else{ret = gifurls[7];}
              }
            }
            else if(iconname === "11d" || iconname === "11n")
            {
              ret = gifurls[8];
            }
            return ret;
          }

          self.img1(weatherify(0, data[0].weather[0].icon));
          self.img2(weatherify(1, data[1].weather[0].icon));
          self.img3(weatherify(2, data[2].weather[0].icon));

          var night = cd.getHours() < 5 || cd.getHours() > 19;

          var list1 = 'oj-xl-4 oj-lg-4 oj-md-4 weatherf oj-panel';
          var list2 = 'oj-xl-4 oj-lg-4 oj-md-4 weather oj-panel';
          var list3 = 'oj-xl-4 oj-lg-4 oj-md-4 weather oj-panel';
          
          if (night || data[0].weather[0].main === "Rain" || data[0].weather[0].main === "Thunderstorm")
          {
            list1 += ' night';
          }
          else{
            list1 += ' day';
          }

          if (night || data[1].weather[0].main === "Rain" || data[1].weather[0].main === "Thunderstorm")
          {
            list2 += ' night';
          }
          else{
            list2 += ' day';
          }

          if (night || data[2].weather[0].main === "Rain" || data[2].weather[0].main === "Thunderstorm")
          {
            list3 += ' night';
          }
          else{
            list3 += ' day';
          }

          self.arr1(list1);
          self.arr2(list2);
          self.arr3(list3);
         
       });

        $.get("http://localhost:9998/getAnnouncements",
          function(data) {
            self.cont1(data.items[0].anncontent);
            self.cont2(data.items[1].anncontent);
            self.cont3(data.items[2].anncontent);
            self.cont4(data.items[3].anncontent);
        });

        //  $.get("http://localhost:9998/getNews",
        //   function(data) {            
        // });

        self.imgurl1("https://image.slidesharecdn.com/oracle-zendcon-php-2009-091028150656-phpapp02/95/best-practices-php-and-the-oracle-database-1-728.jpg?cb=1256742437");


        $.get("http://localhost:9998/getEvents",
          function(data) {
            self.e1(data.items[0].eventname);

            var spl = data.items[0].eventdate.split("T")[0].split("-");
            self.dt1(months[parseInt(spl[1] - 1)] + " " + spl[2] + ", " + spl[0]);

            self.ven1(data.items[0].eventvenue);

            self.evpic1(data.items[0].eventUrl);

            self.e2(data.items[1].eventname);

            var spl2 = data.items[1].eventdate.split("T")[0].split("-");
            self.dt2(months[parseInt(spl2[1] - 1)] + " " + spl2[2] + ", " + spl2[0]);

            self.ven2(data.items[1].eventvenue);

            self.evpic2(data.items[1].eventUrl);

        });

        $.get("http://localhost:9998/getRoomSchedules",
          function(data) {
            self.loc1(data.items[0].roomnumber);
            var spl = data.items[0].roomstart.split("T")[0].split("-");
            var tm = data.items[0].roomstart.split("T")[1].split(":");
            var ap1 = (parseInt(tm[0]) >= 12) ? "PM" : "AM";
            var hr1 = (parseInt(tm[0]) == 0 || parseInt(tm[0]) == 12) ? 12 : parseInt(tm[0]) % 12;
            self.rd1(months[parseInt(spl[1] - 1)] + " " + spl[2] + ", " + spl[0]+ " | " + hr1 + ":" + tm[1] + " " + ap1);
            self.purp1(data.items[0].roompurpose);

            self.loc2(data.items[1].roomnumber);
            var spl2 = data.items[1].roomstart.split("T")[0].split("-");
            var tm2 = data.items[1].roomstart.split("T")[1].split(":");
            var ap2 = (parseInt(tm2[0]) >= 12) ? "PM" : "AM";
            var hr2 = (parseInt(tm2[0]) == 0 || parseInt(tm2[0]) == 12) ? 12 : parseInt(tm2[0]) % 12;
            self.rd2(months[parseInt(spl2[1] - 1)] + " " + spl2[2] + ", " + spl2[0]+ " | " + hr2+ ":" + tm2[1] + " " + ap2);
            self.purp2(data.items[1].roompurpose);

            self.loc3(data.items[2].roomnumber);
            var spl3 = data.items[2].roomstart.split("T")[0].split("-");
            var tm3 = data.items[2].roomstart.split("T")[1].split(":");
            var ap3 = (parseInt(tm3[0]) >= 12) ? "PM" : "AM";
            var hr3 = (parseInt(tm3[0]) == 0 || parseInt(tm3[0]) == 12) ? 12 : parseInt(tm3[0]) % 12;
            self.rd3(months[parseInt(spl3[1] - 1)] + " " + spl3[2] + ", " + spl3[0]+ " | " + hr3 + ":" + tm3[1] + " " + ap3);
            self.purp3(data.items[2].roompurpose);

            self.loc4(data.items[3].roomnumber);
            var spl4 = data.items[3].roomstart.split("T")[0].split("-");
            var tm4 = data.items[3].roomstart.split("T")[1].split(":");
            var ap4 = (parseInt(tm3[0]) >= 12) ? "PM" : "AM";
            var hr4 = (parseInt(tm3[0]) == 0|| parseInt(tm4[0]) == 12) ? 12 : parseInt(tm4[0]) % 12;
            self.rd4(months[parseInt(spl4[1] - 1)] + " " + spl4[2] + ", " + spl4[0]+ " | " + hr4 + ":" + tm4[1] + " " + ap4);
            self.purp4(data.items[3].roompurpose);
        });
        
        $('.headlines').slick({
          slidesToShow: 1,
          autoplay: true,
          arrows: false,
          autoplaySpeed: 5000,
          infinite: true
        });
      };



      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };


    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
