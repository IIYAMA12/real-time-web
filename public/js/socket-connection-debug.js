let socket;
let connectionError = false;


window.addEventListener("load", function () {
    socket = io.connect("http://62d0a5be.ngrok.io"); // "http://localhost:4444"

    socket.on("onPlayerConnect_s", function (gameData, mapImages) {
        playersData = gameData.playersData;
        yourData = playersData[gameData.id];
        
        frameRender.start();

        startStreamOrientation ();
    
        createMapImage(mapImages);

        controller.init();

        socket.on("onRemotePlayerConnect_s", function (data) {
            const id = data.id;
            playersData[id] = data;
        });
        
        socket.on("onPlayerDisconnect_s", function (id) {
            delete playersData[id];
        });
        
        
        attachSocketForUsername();
        attachSocketForOrientation();
        attachSocketForProjectile();
        attachSocketForMapImage();
    });

    socket.on("onPlayerReconnect_s", function (gameData, mapImages) {
        playersData = gameData.playersData;
        yourData = playersData[gameData.id];
        connectionError = false;
    });
    
    socket.on("connect_timeout", function(){
        console.log("connection timeout");
    });

    // Tunneling counter
    socket.on("connect_error", function(){
        connectionError = true;
        console.log("connect_error");
    });

    socket.on("reconnect", function () {
        socket.emit("onPlayerReconnect_c");
        // console.log("reconnect");
    });

    socket.on("onRemotePlayerReconnect_s", function (id) {
        console.log("onRemotePlayerReconnect_s", id);
        const playerData = playersData[id];
        if (playerData != undefined) {
            console.log("remove connection error")
            delete playerData.connectError;
        }
    });

    socket.on("onRemotePlayerConnectionError_s", function (id) {
        console.log("onRemotePlayerConnectionError_s", id);
        const playerData = playersData[id];
        if (playerData != undefined) {
            console.log("set connection error")
            playerData.connectionError = true;
        }
    });

    socket.on("ping", function () {
        socket.emit("ping_c");
    });
});
