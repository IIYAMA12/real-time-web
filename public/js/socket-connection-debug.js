const socket = io.connect("http://localhost:4444"); // "http://localhost:4444"


socket.on("onPlayerConnect_s", function (gameData, mapImages) {
    playersData = gameData.playersData;
    yourData = playersData[gameData.id];
    
    frameRender.start();
    startStreamOrientation ();

    createMapImage(mapImages);
});

socket.on("onRemotePlayerConnect_s", function (data) {
    const id = data.id;
    playersData[id] = data;
});

socket.on("onPlayerDisconnect_s", function (id) {
    delete playersData[id];
});