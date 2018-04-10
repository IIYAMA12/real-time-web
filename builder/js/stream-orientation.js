let playersData = {};
let yourData;

window.addEventListener("load", function () {
    console.log("loaded_c")
    socket.emit("onPlayerJoin_c");
});


socket.on("onPlayerJoin_s", function (gameData) {
    console.log("onPlayerJoin_s", gameData.id);
    playersData = gameData.playersData;
    yourData = playersData[gameData.id];

    canvas.render.start();

    setInterval(function (){
        socket.emit("onStreamOrientation_c", yourData.orientation);
    }, 100);

    socket.on("onStreamOrientation_s", function (id, orientation) {
        console.log("onStreamOrientation_s id", id);
        if (playersData[id] != undefined) {
            playersData[id].orientation = orientation;
            // console.log("orientation yes send");
        }
        // console.log("onStreamOrientation_s", data);
    });
});

socket.on("onRemotePlayerJoin_s", function (data) {
    console.log("onRemotePlayerJoin_s", data.id)
    // console.log("streamNewPlayerData_s", data);
    const id = data.id;
    playersData[id] = data;
});

socket.on("onPlayerDisconnect_s", function (id) {
    console.log("onPlayerDisconnect_s", id);
    delete playersData[id];
});



document.addEventListener("keydown", function (e) {
    console.log("yourData", yourData);
    if (!e) {
        e = window.event;
    }

    let code = e.keyCode;
    if (e.charCode && code == 0) {
        code = e.charCode;
    }

    switch(code) {
        case 37:
            // Key left.
            yourData.orientation.rotation += 10;
            break;
        case 38:
            // Key up.
            break;
        case 39:
            // Key right.
            yourData.orientation.rotation -= 10;
            break;
        case 40:
    };
});
