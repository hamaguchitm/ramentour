var map;
var layer;
var layerOptions;
var overlay;
var myLatLng;

MyOverlay.prototype = new google.maps.OverlayView();

function MyOverlay(image, center, options) {
    this.image_ = image;
    this.center_ = center;
    this.options_ = options;

    this.div_ = null;
    if (options.map) {
        this.setMap(options.map);
    }
}

MyOverlay.prototype.onAdd = function() {
    var img = document.createElement('img');
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';

    var div = document.createElement('div');
    div.style.position = 'absolute';

    div.appendChild(img);
    this.div_ = div

    var panes = this.getPanes();
    panes.overlayImage.appendChild(this.div_);
};

MyOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection();

    var center = overlayProjection.fromLatLngToDivPixel(this.center_);

    var img = document.createElement('img');
    img.src = this.image_;

    var width = (this.options_.width) ? this.options_.width : img.width;
    var height = (this.options_.height) ? this.options_.height : img.height;

    var opacity = (this.options_.opacity) ? this.options_.opacity : 1.0;

    var div = this.div_;
    div.style.left = (center.x - width / 2) + 'px';
    div.style.top = (center.y - height / 2) + 'px';
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    div.style.opacity = opacity;

    if (this.options_.rotate) {
        var d = this.options_.rotate;
        div.style.transform = d;
        div.style.webkitTransform = d;
        div.style.msTransform = d;
  }
};

MyOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

MyOverlay.prototype.show = function() {
    if (this.div_) {
        this.div_.style.visibility = 'visible';
    }
};

MyOverlay.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.visibility = 'hidden';
    }
};

MyOverlay.prototype.toggle = function() {
    if (this.div_) {
        if (this.div_.style.visibility === 'hidden') {
            this.show();
        } else {
            this.hide();
        }
    }
};

MyOverlay.prototype.expand = function(mag) {
    if (this.div_) {
        var div = this.div_;
        var width = parseFloat(div.style.width) * mag;
        var height = parseFloat(div.style.height) * mag;
        div.style.width = width + 'px';
        div.style.height = height + 'px';
    }
};

MyOverlay.prototype.shift = function(x, y) {
    if (this.div_) {
        var div = this.div_;
        var left = parseFloat(div.style.left) + x;
        var top = parseFloat(div.style.top) + y;
        div.style.left = left + 'px';
        div.style.top = top + 'px';
    }
};

MyOverlay.prototype.rotate = function(d) {
    if (this.div_) {
        var div = this.div_;
        var deg = (div.style.transform) ? parseInt(div.style.transform.match(/-?\d+/)) : 0;
        var rotate = 'rotate(' + (deg + d) + 'deg)';
        div.style.transform = rotate;
        div.style.webkitTransform = rotate;
        div.style.msTransform = rotate;
    }
};

MyOverlay.prototype.setImage = function(url, width, height) {
    if (this.div_) {
        var div = this.div_;
        div.style.width = width + 'px';
        div.style.height = height + 'px';
        var img = div.childNodes[0];
        img.src = url;
    }
};

function changeFilter(condition) {
    if (condition != '') {
        layerOptions.query.where = condition + ' > 0';
    }
    layer.setOptions(layerOptions);
}

// ( 1 )位置情報を取得します。
function getLocation(){
    if (navigator.geolocation) {
        // 現在の位置情報取得を実施 正常に位置情報が取得できると、
        // successCallbackがコールバックされます。
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("本ブラウザではGeolocationが使えません");
    }
}

// ( 2 )位置情報が正常に取得されたら
function successCallback(pos) {
    var x = pos.coords.latitude;
    var y = pos.coords.longitude;
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(x, y),
        icon: {
            url: 'img/bluedot.png',
            size: new google.maps.Size(100, 100)
        }
    });
    marker.setMap(map);
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

    var ctaLayer = new google.maps.KmlLayer({
        url: './kml/route.kml',
        map: map
    });

    var srcUrl = './img/magritte2.png'
    overlayOptions = {
        width: 696,
        height: 980,
        opacity: 1.0,
        rotate: 20
    };

    overlay = new MyOverlay(srcUrl, center, overlayOptions);
    overlay.setMap(map);

    layerOptions = {
        query: {
            select: 'latitude',
            from: '1znknfE0Ae6tbzdKSE4Xma_8SmxgoeU7GleIw3D3K',
            where: ''
        },
        options: {
              styleId: 2,
              templateId:2
        }
    };

    layer = new google.maps.FusionTablesLayer(layerOptions);

    layer.setOptions(layerOptions);
    layer.setMap(map);

    getLocation();
}

google.maps.event.addDomListener(window, 'load', initMap);
