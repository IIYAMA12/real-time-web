
/*
    Create the map image, which can be rendered on the canvas
*/
function createMapImage (mapImage) {
    if (mapImage != undefined) {
        const image = new Image();
        
        image.src = mapImage.data;
        image.alt = "Map image";        
        
        image.addEventListener("load", function() {
            image.crossOrigin = 'Anonymous';
            canvas.mapImage = image;
        });
    }
}

function attachSocketForMapImage () {
    socket.on("onMapImageUpdate_s", function (mapImage) {
        createMapImage (mapImage);
    });
}