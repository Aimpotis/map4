
var map;
//Model
var places = [
  {title: "Washington Square Park",
  address: "Washington Square Park, New York",
  position: {lat: 40.731395, lng:-73.996983}},
  {title: "John V. Lindsay East River Park",
  address: "John V. Lindsay East River Park, New York",
  position: {lat: 40.718587, lng:-73.973621}},
  {title: "Museum of Jewish Heritage",
  address: "36 Battery Pl, New York",
  position: {lat: 40.705975, lng:-74.018575 }},
  {title: "Children's Museum of the Arts",
  address: "103 Charlton St, New York",
  position: {lat: 40.727692, lng: -74.00807}},
  {title: "New York City Fire Museum",
  address: "278 Spring Street, New York",
  position: {lat: 40.725547, lng: -74.006971}}
];
//Google Success callback function
var largeInfowindow ;
function googleSuccess() {
  //make map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.712784, lng: -74.005941},
    zoom: 14,
    fullscreenControl: true,
    mapTypeControl: false
  });

  largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
 //make markers
  for (var i = 0; i < places.length; i++) {
    // Get the position from the location array.
    var position = places[i].position;
    var title = places[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      map: map,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // send them to Array places
    places[i].marker = marker ;
    places[i].marker.address = places[i].address ;

    bounds.extend(marker.position);
  }
  map.fitBounds(bounds);
  //create infowindow function

    //start KO
    ko.applyBindings(new ViewModel());

  }


  function populateInfoWindow (marker, infowindow){
    //the url for the NYT API
    var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + marker.address + '&sort=newest&apikey=79d4af5d735d40dd8f025ac8a3923bf8';
    //ajax request to NYT API
    $.ajax({
      url: nytUrl})
      .done(function(data){
        var articles = data.response.docs;
        var article = articles[1];
        if (infowindow.marker != marker){
          infowindow.marker = marker;
          infowindow.open(map, marker);
          infowindow.setContent(marker.title + '<br>' + 'NYT Article' + '<br>' + '<a href="'+article.web_url+'">' + article.headline.main+'</a>' );
        }
        infowindow.addListener('closeclick', function(){
          infowindow.marker = null;
        });
      })
      //fail ajax
      .fail(function(){
        if (infowindow.marker != marker){
          infowindow.marker = marker;
          infowindow.open(map, marker);
          infowindow.setContent(marker.title + '<br>' + 'NYT Article' + '<br>' + 'NYT API has faced a problem' );
        }
        infowindow.addListener('closeclick', function(){
          infowindow.marker = null;
        });
      });
    }

  //constructor
  var Loc = function(data){
    this.marker = data.marker;
    this.title =  data.title;
  };
  //Octopus
  var ViewModel = function(){
    var self = this;

    self.listLoc = ko.observableArray();

    places.forEach(function(locItem){
      self.listLoc.push(new Loc(locItem));
    });
    //filter
    self.go = ko.observable('');
    self.filteredList = ko.computed(function () {
      var go = self.go().toLowerCase();
      return ko.utils.arrayFilter(self.listLoc(), function(list) {
        var result = (list.title.toLowerCase().search(go) >= 0);
        list.marker.setVisible(result);
        list.marker.addListener('click', function(){
          populateInfoWindow(this, largeInfowindow);
          list.marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){list.marker.setAnimation(null); }, 2000);
        });
        return result;
      });
    });
    //function for list
    self.push = function (that) {
      populateInfoWindow (that.marker, largeInfowindow);
      that.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){that.marker.setAnimation(null); }, 2000);
    };
    //function for slider
    self.open = function(){
      $('.mainNav').toggleClass('open');
    };
  };

  //Google Error
  function googleError(){
    alert("oops something went wrong");
  }
