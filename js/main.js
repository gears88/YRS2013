// Generated by CoffeeScript 1.4.0
(function() {
  var initialize, loadMap, loadWeather, pin, pinColors, pins, plotBikes, plotFilms,
    _this = this;

  plotFilms = function(map) {
    return $.get('locations/filmdata.csv', function(data) {
      return $.csv.toObjects(data, {}, function(err, data) {
        var item, marker, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          _results.push(marker = new google.maps.Marker({
            position: new google.maps.LatLng(item.LATITUDE, item.LONGITUDE),
            map: map,
            title: item.Film,
            icon: pins.film
          }));
        }
        return _results;
      });
    });
  };

  plotBikes = function(map) {
    var pinAvailable, pinNotAvailable;
    pinAvailable = new pin(pinColors.bikeAvailable);
    pinNotAvailable = new pin(pinColors.bikeNotAvailable);
    return $.getJSON('bikedata.php', function(data) {
      var marker, station, thisPin, _i, _len, _ref, _results;
      _ref = data.stationBeanList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        station = _ref[_i];
        if (station.availableBikes > 0 && station.statusValue === "In Service") {
          thisPin = pinAvailable;
        } else {
          thisPin = pinNotAvailable;
        }
        _results.push(marker = new google.maps.Marker({
          position: new google.maps.LatLng(station.latitude, station.longitude),
          map: map,
          title: station.stationName,
          icon: thisPin.pinImage(),
          shadow: thisPin.pinShadow()
        }));
      }
      return _results;
    });
  };

  pinColors = {
    bikeAvailable: '00FF00',
    bikeNotAvailable: '0000FF'
  };

  pins = {
    film: "img/noun_project_16712.png"
  };

  pin = (function() {

    function pin(color) {
      this.color = color != null ? color : "FE7569";
    }

    pin.prototype.pinImage = function() {
      return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + this.color, new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34));
    };

    pin.prototype.pinShadow = function() {
      return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow", new google.maps.Size(40, 37), new google.maps.Point(0, 0), new google.maps.Point(12, 35));
    };

    return pin;

  })();

  loadWeather = function() {
    var feedUrl, jsonUrl;
    feedUrl = "http://weather.yahooapis.com/forecastrss?w=12761716&u=f";
    jsonUrl = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + encodeURIComponent(feedUrl) + "&callback=?";
    return $.getJSON(jsonUrl, function(data) {
      var match, re, weatherString;
      weatherString = data.responseData.feed.entries[0].contentSnippet;
      re = /Current Conditions:\n(.*?)\n/;
      match = weatherString.match(re);
      return $("#weather").text(match[1]);
    });
  };

  loadMap = function() {
    var map, mapOptions;
    mapOptions = {
      center: new google.maps.LatLng(40.714346, -74.005966),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    google.maps.visualRefresh = true;
    return map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  };

  initialize = function() {
    var map;
    loadWeather();
    map = loadMap();
    plotFilms(map);
    return plotBikes(map);
  };

  $(document).ready(function() {
    return initialize();
  });

}).call(this);
