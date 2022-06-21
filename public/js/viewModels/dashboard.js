/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */

define([ 'ojs/ojcore', 'knockout', 'jquery', 'slick' ], function(oj, ko, $) {
	function DashboardViewModel() {
		var self = this;

		//relevant observable arrays
		self.weather = ko.observableArray();

		var newschecker = []; //this will check for any news URLs that have been already added
		var announcechecker = []; //this will check for any announcements that have been already added
		var annivlist = []; //list of names to check for anniversaries
		var hirelist = []; //list of names to check for hiring
		var bdaylist = []; //list of names to check for monthly celebrants
		//var schedlist = []; //today's schedules
		var eventlist = []; //events
		var oraclelist = []; //oracle news
		var iscalled = false;

		var months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		var week = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
		// Below are a set of the ViewModel methods invoked by the oj-module component.
		// Please reference the oj-module jsDoc for additional information.
		cd = new Date(); //for time stuff

		setInterval(currDate, 1000);

		function currDate() {
			var c = new Date();
			document.getElementById('currDate').innerHTML =
				months[c.getMonth()] + ' ' + c.getDate() + ', ' + c.getFullYear() + ' | ' + week[c.getDay()];
		}

		var currTime = setInterval(currTime, 1000);
		function currTime() {
			var d = new Date();
			document.getElementById('currTime').innerHTML = d.toLocaleTimeString();
		}

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

			$('#main-headline > img:gt(0)').hide();

			setInterval(function() {
				$('#main-headline > img:first').fadeOut(1000).next().fadeIn(1000).end().appendTo('#main-headline');
			}, 5000);

			//these are all carousels using the slick jQuery plug-in, read their documentation on Google :)
			$('.headlines').on('init', function(event, slick) {
				//console.log("slider initialized");
			});

			//headline carousel
			$('.headlines').slick({
				slidesToShow: 1,
				autoplay: true,
				arrows: false,
				autoplaySpeed: 5000,
				infinite: true,
				draggable: false,
				pauseOnHover: false
			});

			//event carousels
			$('.event1').slick({
				slidesToShow: 1,
				autoplay: true,
				arrows: false,
				autoplaySpeed: 3000,
				infinite: true,
				draggable: false,
				pauseOnHover: false
			});

			$('.event2').slick({
				slidesToShow: 1,
				autoplay: true,
				arrows: false,
				autoplaySpeed: 3200,
				infinite: true,
				draggable: false,
				pauseOnHover: false
			});

			//Oracle News carousel
			$('.oranews1').slick({
				slidesToShow: 1,
				autoplay: true,
				arrows: false,
				autoplaySpeed: 15000,
				infinite: true,
				draggable: false,
				fade: true,
				cssEase: 'linear',
				pauseOnHover: false,
				speed: 250
			});

			$('.oranews2').slick({
				slidesToShow: 1,
				autoplay: true,
				arrows: false,
				autoplaySpeed: 15000,
				infinite: true,
				draggable: false,
				fade: true,
				cssEase: 'linear',
				pauseOnHover: false,
				speed: 500
			});

			//announcement carousels
			$('.upper-left').slick({
				autoplay: true,
				arrows: false,
				autoplaySpeed: 3000,
				infinite: true,
				draggable: false,
				pauseOnHover: false
			});

			$('.upper-right').slick({
				autoplay: true,
				arrows: false,
				infinite: true,
				draggable: false,
				pauseOnHover: false,
				autoplaySpeed: 3100
			});

			$('.lower-left').slick({
				autoplay: true,
				arrows: false,
				autoplaySpeed: 3300,
				infinite: true,
				draggable: false,
				pauseOnHover: false
			});

			$('.lower-right').slick({
				autoplay: true,
				arrows: false,
				autoplaySpeed: 3500,
				infinite: true,
				draggable: false,
				pauseOnHover: false
			});

			/*
        //m&a carousels
        $('.schedA').slick({
          slidesToShow: 1,
          autoplay: true,
          arrows: false,
          autoplaySpeed: 3000,
          infinite: true,
          draggable: false,
          pauseOnHover: false,
        });

        $('.schedB').slick({
          slidesToShow: 1,
          autoplay: true,
          arrows: false,
          autoplaySpeed: 3000,
          infinite: true,
          draggable: false,
          pauseOnHover: false,
        });

        $('.schedC').slick({
          slidesToShow: 1,
          autoplay: true,
          arrows: false,
          autoplaySpeed: 3400,
          infinite: true,
          draggable: false,
          pauseOnHover: false,
        });

        $('.schedD').slick({
          slidesToShow: 1,
          autoplay: true,
          arrows: false,
          autoplaySpeed: 3600,
          infinite: true,
          draggable: false,
          pauseOnHover: false,
        });
        */

			//setInterval() makes a function work like an infinite while loop every x milliseconds.
			self.panels();
			self.rssfeed();
			setInterval(self.panels, 300000);
			setInterval(self.rssfeed, 3600000);
		};

		/**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
      **/
		self.disconnected = function() {
			// Implement if needed
		};

		/**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
      **/
		self.transitionCompleted = function() {
			// Implement if needed
		};

		self.panels = function() {
			console.log('panels refreshed!');

			self.hcm();

			// more jQuery data gathering
			$.get('/getWeatherForecast', function(data) {
				self.weather(data);
			});

			//the reason why these slides have to have lists is to make sure that no additional slides would be appended upon refresh.
			//Unfortunately, the issue is with clearing the lists and replacing the data. it seems that the processes do not work....

			$.get('/getAnnouncements', function(data) {
				for (i = 0; i < announcechecker.length; i++) {
					$('.upper-left').slick('slickRemove', $('.slickanno').index(0));
					$('.upper-right').slick('slickRemove', $('.slickanno').index(0));
					$('.lower-left').slick('slickRemove', $('.slickanno').index(0));
					$('.lower-right').slick('slickRemove', $('.slickanno').index(0));
				}
				announcechecker.length = 0;
				for (i = 0; i < data.items.length; i++) {
					if (!announcechecker.includes(data.items[i].id)) {
						announcechecker.push(data.items[i].id);
						if (i % 4 == 0) {
							//this is how to add a news slide to the slick carousel in slick documentation. Thanks, Ken Wheeler!
							$('.upper-left').slick(
								'slickAdd',
								'<div class="slickanno"><h2>' + data.items[i].anncontent + '</h2></div>'
							);
							//console.log("Upper left announcement added!");
						} else if (i % 4 == 1) {
							$('.upper-right').slick(
								'slickAdd',
								'<div class="slickanno"><h2>' + data.items[i].anncontent + '</h2></div>'
							);
							// console.log("Upper right announcement added!");
						} else if (i % 4 == 2) {
							$('.lower-left').slick(
								'slickAdd',
								'<div class="slickanno"><h2>' + data.items[i].anncontent + '</h2></div>'
							);
							// console.log("Lower left announcement added!");
						} else {
							$('.lower-right').slick(
								'slickAdd',
								'<div class="slickanno"><h2>' + data.items[i].anncontent + '</h2></div>'
							);
							// console.log("Lower right announcement added!");
						}
					}
				}
			});

			$.get(
				'/getNews', //important news WITHIN the company
				function(data) {
					for (i = 0; i < newschecker.length; i++) {
						$('.headlines').slick('slickRemove', $('.newsImage').index(0));
					}
					newschecker.length = 0;
					for (i = 0; i < data.items.length; i++) {
						if (!newschecker.includes(data.items[i].id)) {
							newschecker.push(data.items[i].id);
							$('.headlines').slick(
								'slickAdd',
								'<div style="background-color: #ffffff;" class="newsImage"><img src="' +
									data.items[i].newsUrl +
									'" width="800px" height="410px"></div>'
							);
						}
					}
				}
			);

			$.get(
				'/getEvents', //events
				function(data) {
					for (i = 0; i < eventlist.length; i++) {
						$('.event1').slick('slickRemove', $('.event').index(0));
						$('.event2').slick('slickRemove', $('.event').index(0));
					}
					eventlist.length = 0;
					for (i = 0; i < data.items.length; i++) {
						if (!eventlist.includes(data.items[i].id)) {
							eventlist.push(data.items[i].id);
							var style =
								'background:url(' +
								data.items[i].eventUrl +
								'); background-size:cover; width: 48%; height:150px; overflow: hidden; margin-right:7px;';
							if (i % 2 == 0) {
								//add to first event carousel
								$('.event1').slick(
									'slickAdd',
									'<div class=" oj-panel event" style="' +
										style +
										'"><div class="textbg"><h2>' +
										data.items[i].eventname +
										'</h2><h3>' +
										data.items[i].eventdate +
										'<br>' +
										data.items[i].eventvenue +
										'</h3></div></div>'
								);
								//console.log("event1 added!");
							} else {
								//add to second event carousel
								$('.event2').slick(
									'slickAdd',
									'<div class="oj-panel event" style="' +
										style +
										'"><div class="textbg"><h2>' +
										data.items[i].eventname +
										'</h2><h3>' +
										data.items[i].eventdate +
										'<br>' +
										data.items[i].eventvenue +
										'</h3></div></div>'
								);
								//console.log("event2 added!");
							}
						}
					}
				}
			);

			/*
        $.get("/getRoomSchedules", //meetings and activities for today
          function(data) {
            if(schedlist.length == 0){
              for(i = 0; i < data.items.length; i++){
                if(!schedlist.includes(data.items[i])){
                  schedlist.push(data.items[i]);
                  if(i % 4 == 0) {
                    //add to first carousel
                    var style = {"backgroundImage" : "linear-gradient(135deg, #eac435, #460073)"};
                    $(".schedA").slick('slickAdd', '<div style="'+style+'"><h3>'+data.items[i].roomnumber+'</h3><h4>'+data.items[i].roomdate+'<br>'+data.items[i].roomstart+' --- '+data.items[i].roomend+'</h4><h4>'+data.items[i].roompurpose+'</h4></div>');
                    // console.log("Schedule A added!");
                  }
                  else if(i % 4 == 1) {
                    //add to second carousel
                    var style2 = {"backgroundImage" : "linear-gradient(135deg, #460073, #da4167)"};
                    $(".schedB").slick('slickAdd', '<div style="'+style2+'"><h3>'+data.items[i].roomnumber+'</h3><h4>'+data.items[i].roomdate+'<br>'+data.items[i].roomstart+' --- '+data.items[i].roomend+'</h4><h4>'+data.items[i].roompurpose+'</h4></div>');
                    // console.log("Schedule B added!");
                  }
                  else if(i % 4 == 2) {
                    //add to third carousel
                    var style3 = {"backgroundImage" : "linear-gradient(135deg, #da4167, #03cea4)"};
                    $(".schedC").slick('slickAdd', '<div style="'+style3+'"><h3>'+data.items[i].roomnumber+'</h3><h4>'+data.items[i].roomdate+'<br>'+data.items[i].roomstart+' --- '+data.items[i].roomend+'</h4><h4>'+data.items[i].roompurpose+'</h4></div>');
                    // console.log("Schedule C added!");
                  }
                  else {
                    //add to last carousel
                    var style4 = {"backgroundImage" : "linear-gradient(135deg, #03cea4, #eac435)"};
                    $(".schedD").slick('slickAdd', '<div style="'+style4+'"><h3>'+data.items[i].roomnumber+'</h3><h4>'+data.items[i].roomdate+'<br>'+data.items[i].roomstart+' --- '+data.items[i].roomend+'</h4><h4>'+data.items[i].roompurpose+'</h4></div>');
                    // console.log("Schedule D added!");
                  }
                }
              }
            }
          }
        );
        */
		}; // end of self.panels()

		self.hcm = function() {
			console.log('HCM refreshed!');

			$.get(
				'/getAnniv', //get names of people who worked with accenture in the past and are now celebrating their 'anniversary'
				function(data) {
					$('.headlines').slick('slickRemove', $('.anniversary').index(0));
					var namelist = ''; //this namelist variable will be used in getting the names of the anniversary people to be displayed on the slide
					for (i = 0; i < data.acn_anniv_today.length; i++) {
						namelist += data.acn_anniv_today[i] + '<br>';
						annivlist.push(data.acn_anniv_today[i]);
					}
					if (namelist !== '') {
						$('.headlines').slick(
							'slickAdd',
							'<div class="container anniversary"><img src="css/images/Anniversary.png" width="800px" height = "410px"><h3>' +
								namelist +
								'</h3></div>'
						);
					}
				}
			);

			$.get(
				'/getNewHire', //get names of newly hired people
				function(data) {
					$('.headlines').slick('slickRemove', $('.newhire').index(0));
					hirelist.length = 0;
					var namelist = ''; //this namelist variable will be used in getting the names of the newly hired people to be displayed on the slide
					for (i = 0; i < data.length; i++) {
						namelist += data[i] + '<br>';
						hirelist.push(data[i]);
					}
					if (namelist !== '') {
						$('.headlines').slick(
							'slickAdd',
							'<div class="container newhire"><img src="css/images/NewHire.png" width="800px" height = "410px"><h3>' +
								namelist +
								'</h3></div>'
						);
						//console.log("New Hire added");
					}
				}
			);

			/*
        $.get("/getBday", //get names of birth month celebrators
          function(data) {
            if(bdaylist.length == 0){
              var numofCelebs = 21; //limit names of birthday celebrants per slide
              var numOfSlides = Math.round(data.celebrants_this_month.length / numofCelebs);
              for(i = 0; i < numOfSlides; i++){
                var namelist = ''; //this namelist variable will be used in getting the names of the birthday celebrants to be displayed on the slide
                for(j = 0; j < numofCelebs; j++){
                  if(i*numofCelebs + j == data.celebrants_this_month.length - 1){
                    break;
                  }
                  else{
                    namelist += data.celebrants_this_month[i*numofCelebs + j] + '<br>';
                    bdaylist.push(data.celebrants_this_month[i*numofCelebs + j]);
                  }
                }
                if(namelist !== ''){
                  $(".headlines").slick('slickAdd', '<div class="birthday-container "><img src="css/images/Birthday.png" width="800px" height = "410px"><h3>'+
                  namelist+'</h3></div>');
                }
                if (dat.getHours() == 17 && (dat.getMinutes() >= 0 && dat.getMinutes() < 5)){
                  namelist = '';
                }
              }
            }
          }
        );     
        */
		}; // end of self.hcm()

		self.rssfeed = function() {
			console.log('RSS Feed refreshed!');

			$.get(
				'/getOracleNews', //Oracle News
				function(data) {
					for (i = 0; i < oraclelist.length; i++) {
						$('.oranews1').slick('slickRemove', $('.slickora').index(0));
						$('.oranews2').slick('slickRemove', $('.slickora').index(0));
					}
					oraclelist.length = 0;
					titlecount = 8;
					for (i = 0; i < titlecount; i++) {
						if (!oraclelist.includes(data.oracle_news[i])) {
							oraclelist.push(data.oracle_news[i]);
							if (i % 2 == 0) {
								//this is how to add a news slide to the slick carousel in slick documentation. Thanks, Ken Wheeler!
								$('.oranews1').slick(
									'slickAdd',
									'<div class="slickora" style="overflow: hidden"><h2>' +
										data.oracle_news[i] +
										'</h2></div>'
								);
								//console.log("Upper left announcement added!");
							} else {
								$('.oranews2').slick(
									'slickAdd',
									'<div class="slickora" style="overflow: hidden"><h2>' +
										data.oracle_news[i] +
										'</h2></div>'
								);
								// console.log("Upper right announcement added!");
							}
						}
					}
				}
			);
		}; //end of self.rssfeed()
	}

	/*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
    **/
	return new DashboardViewModel();
});
