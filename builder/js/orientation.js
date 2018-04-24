/*
    All about sync player orientation
*/


/*
    // This is for future purposes to add data reduction.
    const lastOrientation = {}
*/

function attachSocketForOrientation () {
    /*
        This even is used to update a remote player his orientation
    */
    socket.on("onStreamOrientation_s", function (id, orientation) {
        if (playersData[id] != undefined) {
            playersData[id].orientation = orientation;
        }
    });
}

/*
    This function is used to stream the player his orientation to the server.
*/
function startStreamOrientation () {
    setInterval(function (){
        if (!connectionError) {
            socket.emit("onStreamOrientation_c", yourData.orientation);
        }
    }, 100);
}


