const base64Img = require('base64-img')

const mapImagesRequests = {
    mapImage: null,
    init: function () {
        mapImagesRequests.func();
        mapImagesRequests.timer = setInterval(mapImagesRequests.func, 10000);
    },
    func: function () {
        // const mapImages = ;
        // for (let x = 0; x < 5; x++) {
        //     for (let y = 0; y < 5; y++) {
        //         base64Img.requestBase64("https://tile.openweathermap.org/map/clouds_new/2/" + x * 1000000 + "/" + y * 1000000 + ".png?appid=6126c13114da40e088f6b9e3fb6672da", function(err, res, body) {
        //             mapImages[mapImages.length] = {
        //                 x: x,
        //                 y: y,
        //                 data: body
        //             };
        //         });
        //     }
        // }


        // 
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