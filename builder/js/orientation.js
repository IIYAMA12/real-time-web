const lastOrientation = {}

socket.on("onStreamOrientation_s", function (id, orientation) {
    if (playersData[id] != undefined) {
        playersData[id].orientation = orientation;
    }
});

function startStreamOrientation () {
    setInterval(function (){
        socket.emit("onStreamOrientation_c", yourData.orientation);
    }, 100);
}


