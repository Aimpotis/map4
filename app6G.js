var map;


var locations = [
          {title: "Washington Square Park",
          address: "Washington Square Park",
          city: "New York",
           location: {lat: 40.731395, lng:-73.996983}},
          {title: "John V. Lindsay East River Park",
          address: "John V. Lindsay East River Park",
          city: "New York",
           location: {lat: 40.718587, lng:-73.973621}},
          {title: "Museum of Jewish Heritage",
            address: "36 Battery Pl",
            city: "New York",
           location: {lat: 40.705975, lng:-74.018575 }},
          {title: "Children's Museum of the Arts",
          address: "103 Charlton St",
          city: "New York",
           location: {lat: 40.727692, lng: -74.00807}},
          {title: "New York City Fire Museum",
          address: "278 Spring Street",
          city: "New York",
          location: {lat: 40.725547, lng: -74.006971}}
        ];

function initMap() {
       map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 40.712784, lng: -74.005941},
         zoom: 13
       });

       var largeInfowindow = new google.maps.InfoWindow();
       var bounds = new google.maps.LatLngBounds();
       for (var i = 0; i < locations.length; i++) {
               // Get the position from the location array.
               var position = locations[i].location;
               var title = locations[i].title;
               // Create a marker per location, and put into markers array.
                var marker = new google.maps.Marker({
                 position: position,
                 title: title,
                 map: map,
                 animation: google.maps.Animation.DROP,
                 id: i
               });

               locations[i].marker = marker ;
              var streetStr = locations[i].address ;
              var cityStr = locations[i].cityStr;
              var address = street + ',' + cityStr;
               bounds.extend(marker.position);
               marker.addListener('click', (function(place){
              return  populateInfoWindow(this, largeInfowindow,(place));

              })(address));
            };
            map.fitBounds(bounds);

     function populateInfoWindow (marker, infowindow, place){
       if (infowindow.marker != marker){
         infowindow.marker = marker;
         var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?p" + place + '&sort=newest&apikey=79d4af5d735d40dd8f025ac8a3923bf8';
         $.getJSON(nyturl, function(data){
         articles = data.response.docs;
        for( var i = 0; i < articles.lenght; i++){
          var article = articles[i];
          var text ='<li class="article">' + '<a href="'+article.web_url+'">' + article.headline.main+'</a>'+'<p>' + article.snippet+'</p>'+'</li>';
        };
      })

          infowindow.setContent('<div>' + text + '</div>');
         infowindow.open(map, marker);
         infowindow.addListener('closeclick', function(){
           infowindow.setMarker(null);
         });
       }
     }


     ko.applyBindings(new ViewModel())
};
var Loc = function(data){
  this.title =  data.title;
  this.address = data.address;
  this.city = data.city;
  this.location = data.location;
  this.marker = data.marker;
};

var ViewModel = function(){
 var self = this;

 self.listLoc = ko.observableArray();

 locations.forEach(function(locItem){
 self.listLoc.push(new Loc(locItem) )
});

self.filter = ko.observable('');

self.filteredItems = ko.computed(function () {
  var filter = self.filter().toLowerCase();

  if (!filter) {

    ko.utils.arrayForEach(self.listLoc(), function (item) {
      item.marker.setVisible(true);
    });
    return self.listLoc();
  } else {
    return ko.utils.arrayFilter(self.listLoc(), function(item) {
      var result = (item.title.toLowerCase().search(filter) >= 0)
      item.marker.setVisible(result);
      return result;
    });
  }
  		});



  self.setLoc = function (clickedLoc) {
      clickedLoc.marker.setAnimation(google.maps.Animation.BOUNCE);

   };
}

//if(markers[0].title == 'White Tower'){
