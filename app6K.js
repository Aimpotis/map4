var map;

var locations = [
          {title: "Washington Square Park",
          address: "Washington Square Park, New York",
           location: {lat: 40.731395, lng:-73.996983}},
          {title: "John V. Lindsay East River Park",
          address: "John V. Lindsay East River Park, New York",
           location: {lat: 40.718587, lng:-73.973621}},
          {title: "Museum of Jewish Heritage",
            address: "36 Battery Pl, New York",
           location: {lat: 40.705975, lng:-74.018575 }},
          {title: "Children's Museum of the Arts",
          address: "103 Charlton St, New York",
           location: {lat: 40.727692, lng: -74.00807}},
          {title: "New York City Fire Museum",
          address: "278 Spring Street, New York",
          location: {lat: 40.725547, lng: -74.006971}}
        ];

function initMap() {
       map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 40.712784, lng: -74.005941},
         zoom: 13,
         fullscreenControl: true,
         mapTypeControl: false
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
               locations[i].marker.address = locations[i].address ;

               bounds.extend(marker.position);

            };
            map.fitBounds(bounds);

            function populateInfoWindow (marker, infowindow){
              var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + marker.address + '&sort=newest&apikey=79d4af5d735d40dd8f025ac8a3923bf8';



                 $.ajax({
                    url: nytUrl})
                   .done(function(data){
                   var articles = data.response.docs;
                   var article = articles[1];
                   if (infowindow.marker != marker){
                     infowindow.marker = marker;
                     infowindow.open(map, marker);

                     infowindow.setContent('<li class="article">' + '<a href="'+article.web_url+'">' + article.headline.main+'</a>'+'<p>' + article.snippet+'</p>'+'</li>');
                   }
                   infowindow.addListener('closeclick', function(){
                   infowindow.setMarker = null;
                   });
                 })
                 .fail(function(){
                   if (infowindow.marker != marker){
                     infowindow.marker = marker;
                     infowindow.open(map, marker);
                     infowindow.setContent('New York Times Articles Could not be loaded');
                   }
                 })

                }



                var Loc = function(data){
                  this.marker = data.marker;
                  this.title =  data.title;

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
                  return ko.utils.arrayFilter(self.listLoc(), function(item) {
                    var result = (item.title.toLowerCase().search(filter) >= 0)
                    item.marker.setVisible(result);
                    item.marker.addListener('click', function(){
                    populateInfoWindow(this, largeInfowindow);
                    });
                      return result;
                      });

                     });



                  self.setLoc = function (clickedLoc) {
                      populateInfoWindow (clickedLoc.marker, largeInfowindow);

                   };
                }


     ko.applyBindings(new ViewModel())
};

var toggleStatus = 0;

var toggleMenu= document.querySelector('#toggleMenu');
var main = document.querySelector('main');
var sidebar = document.querySelector('#sidebar');

toggleMenu.addEventListener('click', function(e) {
  if (toggleStatus == 1) {
    sidebar.classList.toggle('open');
    e.stopPropagation();
   toggleStatus = 0;
 }
 else if (toggleStatus == 0) {
    sidebar.classList.remove('open');
    toggleStatus = 1;
 }
})

function googleError(){
  alert("get a new computer");
}
