/*
    Use base64img module to download and encode openweathermap images with base64. Makes it possible to read it clientside.
*/
const base64Img = require('base64-img')

const mapImagesRequests = {
    mapImage: null,
    init: function () {
        mapImagesRequests.func();
        mapImagesRequests.timer = setInterval(mapImagesRequests.func, 10000);
    },
    func: function () {
        // https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}
        // https://tile.openweathermap.org/map/clouds_new/1/0/0.png?appid=e6b1633f54c4b1ebc58aef9a9ccd9b7e
        base64Img.requestBase64("https://tile.openweathermap.org/map/clouds_new/1/0/0.png?appid=e6b1633f54c4b1ebc58aef9a9ccd9b7e", function(err, res, body) {
            mapImagesRequests.mapImage = {data: body};
        });
        
        if (mapImagesRequests.callBack != undefined) {
            mapImagesRequests.callBack(mapImagesRequests.mapImage);
        }
    }
};

mapImagesRequests.init();


module.exports = mapImagesRequests;