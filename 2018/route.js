var map = null;
var layer = null;
var layerOptions = null;
var kmlSrc = 'https://hamaguchitm.github.io/ramentour/2018/kml/route.kml';
var fusionTableId = '1VvjvNIOutwjZwtir3KhfXSm5XdIDGnvdzULuxPR7';
var marker = null;

function initMap() {
    var center = new google.maps.LatLng(35.675581, 139.692387);

    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    // ルート表示
    var kmlLayer = new google.maps.KmlLayer(kmlSrc, {
        suppressInfoWindows: true,
        preserveViewport: false,
        map: map
    });

    // ラーメン屋表示
    var shopLayer = new google.maps.FusionTablesLayer({
        query: {
            select: 'latitude',
            from: fusionTableId,
            where: 'close = 0 AND distant = 0'
        },
        options: {
              styleId: 2,
              templateId:2
        },
        map: map
    });
}
google.maps.event.addDomListener(window, 'load', initMap);

function autoUpdate() {
    // 現在地表示
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                if (marker) {
                    marker.setPosition(myLatLng);
                } else {
                    marker = new google.maps.Marker({
                       position: myLatLng,
                       icon: iconImage,
                       map: map
                    });
                }
            },
            function(error) {
                alert( "位置情報が許可されていません");
                myLatLng = null;
            }
        );
    } else {
        alert("本ブラウザではGeolocationが使えません");
    }
    setTimeout(autoUpdate, 30*1000)
}
autoUpdate()
