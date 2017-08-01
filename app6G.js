var map;


var locations = [
          {title: 'White Tower', location: {lat: 40.626446, lng:22.948426}},
          {title: 'Museum of Photography', location: {lat: 40.632874, lng:22.935479}},
          {title: 'Teloglion Fine Arts Foundation', location: {lat: 40.632854, lng:22.941567}},
          {title: 'War Museum of Thessaloniki', location: {lat: 40.624308, lng: 22.95953}},
          {title: 'Jewish Museum of Thessaloniki', location: {lat: 40.635132, lng: 22.939538}}
        ];

function initMap() {
       map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 40.6401, lng: 22.9444},
         zoom: 14
       });
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
     };

     ko.applyBindings(new ViewModel())
};
var Loc = function(data){
  this.title =  data.title;
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
