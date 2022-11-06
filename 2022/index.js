let map;
let selected_data = "summarize";

function selectStores() {
    if (selected_data == "summarize") {
        selected_data = "all";
        initMap();
    } else {
        selected_data = "summarize";
        initMap();
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
          var center = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
          var marker = new google.maps.Marker({
              position: center,
              icon: {
                  fillColor: '#0000FF',
                  fillOpacity: 0.8,
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 7,
                  strokeColor: '#0000FF',
                  strokeWeight: 0.1
              }
          });
          marker.setMap(map);
          map.setCenter(center);

          if (location.search.length > 2) {
              var x = location.search.substr(1);
              if (!isNaN(x)) {
                  map.setZoom(Number(x));
                  console.log(x);
              }
          }
          else {
              map.setZoom(17);
          }

        });
    } else {
        alert("本ブラウザではGeolocationが使えません");
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: new google.maps.LatLng(35.68616, 139.744991)
    });

    map.data.loadGeoJson("./data/store_" + selected_data + ".geojson");
    map.data.setStyle(function(feature) {
        var score = feature.getProperty('score');
        var color = "#FFFF00";
        if (score >= 3.6) {
          color = "#FF0000";
        } else if (score >= 3.4) {
          color = "#FF9900"
        } else if (score >= 3.2) {
          color = "#FFCC00"
        }
        return {
            icon: {
                fillColor: color,
                fillOpacity: 0.8,
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                strokeColor: 'black',
                strokeWeight: 1.0
            }
        };
    });

    var infowindow = new google.maps.InfoWindow();
    map.data.addListener('click', function(event) {
      var url = event.feature.getProperty('url')
      var name = event.feature.getProperty('name')
      var score = event.feature.getProperty('score');
      var station = event.feature.getProperty('station')
      var icon_url = event.feature.getProperty('icon_url')
      var tel = event.feature.getProperty('tel')
      var open_time = event.feature.getProperty('open_time')
      var closed_days = event.feature.getProperty('closed_days')
      var sheets = event.feature.getProperty('sheets')

      var html = '<div style="font-weight:bold"><a href="' + url + '" target="_blank">' + name + '</a>' +
                 '<span style="margin-left: 10pt">' + score + '</span>' +
                 '<span style="margin-left: 10pt">(' + station + ')</span></div>' +
                 '<table><tr><td rowspan="5"><img src="' + icon_url + '" style="vertical-align: top; height: 120px"/></td></tr>' +
                 '<tr><td style="width: 240px">電話: <a href="tel:' + tel + '">' + tel + '</a></td></tr>' +
                 '<tr><td style="width: 240px">営業時間: ' + open_time + '</td></tr>' +
                 '<tr><td style="width: 240px">定休日: ' + closed_days + '</td></tr>' +
                 '<tr><td style="width: 240px">席数: ' + sheets + '</td></tr></table>'
      infowindow.setContent(html);
      infowindow.setPosition(event.feature.getGeometry().get());
      infowindow.open(map);
    });

    const selectStoresButton = document.createElement("button");
    if (selected_data == "all") {
        selectStoresButton.textContent = "summarize";
    } else {
        selectStoresButton.textContent = "all";
    }
    selectStoresButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(selectStoresButton);
    selectStoresButton.addEventListener("click", selectStores);

    getLocation();
}

google.maps.event.addDomListener(window, 'load', initMap);
