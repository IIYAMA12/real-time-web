// const mapImagesContainer = document.getElementById("map-images");

// function removeOldMapImage (x, y) {
//     for (let i = 0; i < canvas.mapImages.length; i++) {
//         const mapImage = canvas.mapImages[i];
//         if (mapImage.x === x && mapImage.y === y) {
//             return true;
//         }
//     }
// }

function createMapImage (mapImage) {
    if (mapImage != undefined) {
        const image = new Image();
        
        image.src = mapImage.data;
        image.alt = "Map image";        
        
        // console.log("update1", typeof(mapImage), mapImage);
        image.addEventListener("load", function() {
            console.log("update2", this);
            image.crossOrigin = 'Anonymous';
            canvas.mapImage = image;
            
        });
    
    }
    // for (let index = 0; index < mapImages.length; index++) {
    //     const mapImage = mapImages[index];

    //     var image = new Image();
        
    //     image.src = mapImage.data;

    //     image.onload = function() {
    //         removeOldMapImage (mapImage.x, mapImage.y);
    //         canvas.mapImages[canvas.mapImages.length] = {x:mapImage.x, y: mapImage.y , data:image};
    //     };
    // }
}


socket.on("onMapImageUpdate_s", function (mapImage) {
    createMapImage (mapImage);
});