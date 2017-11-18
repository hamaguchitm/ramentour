var map;
var layer;
var layerOptions;
var kmlSrc = 'https://hamaguchitm.github.io/ramentour/2017/kml/route.kml'
var myLatLng

function getLocation(){
    if (navigator.geolocation) {
        myLatLng = navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("本ブラウザではGeolocationが使えません");
    }
}
function successCallback(pos) {
    var marker = new google.maps.Marker({
        position: myLatLng,
        icon: {
            url: 'img/bluedot.png',
            size: new google.maps.Size(100, 100)
        },
        map: map
    });
}
function errorCallback(error) {
    alert( "位置情報が許可されていません");
    myLatLng = null;
}


function initMap() {
    var center = new google.maps.LatLng(35.675581, 139.692387);

    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    // Route
    var kmlLayer = new google.maps.KmlLayer(kmlSrc, {
        suppressInfoWindows: true,
        preserveViewport: false,
        map: map
    });

    // Shop
    var shopLayer = new google.maps.FusionTablesLayer({
        query: {
            select: 'latitude',
            from: '1znknfE0Ae6tbzdKSE4Xma_8SmxgoeU7GleIw3D3K',
            where: ''
        },
        options: {
              styleId: 2,
              templateId:2
        },
        map: map
    })

    getLocation()
}
google.maps.event.addDomListener(window, 'load', initMap);
