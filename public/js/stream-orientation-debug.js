

socket.on("onPlayerJoin_s", function (gameData) {
    console.log("onPlayerJoin_s", gameData.id);
    playersData = gameData.playersData;
    yourData = playersData[gameData.id];

    canvas.render.start();

    setInterval(function (){
        socket.emit("onStreamOrientation_c", yourData.orientation);
    }, 100);

    socket.on("onStreamOrientation_s", function (id, orientation) {
        if (playersData[id] != undefined) {
            playersData[id].orientation = orientation;
        }
    });
});

socket.on("onRemotePlayerJoin_s", function (data) {
    console.log("onRemotePlayerJoin_s", data.id)

    const id = data.id;
    playersData[id] = data;
});

socket.on("onPlayerDisconnect_s", function (id) {
    console.log("onPlayerDisconnect_s", id);
    delete playersData[id];
});



