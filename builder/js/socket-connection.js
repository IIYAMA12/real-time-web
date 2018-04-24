let socket;
let connectionError = false;


window.addEventListener("load", function () {
    socket = io.connect("http://62d0a5be.ngrok.io"); // "http://localhost:4444"

    socket.on("onPlayerConnect_s", function (gameData, mapImages) {
        playersData = gameData.playersData;
        yourData = playersData[gameData.id];
        
        /*
            Start rendering
        */
        frameRender.start();

        /*
            Yeah! We can start streaming
        */
        startStreamOrientation ();
        
        /*
            if there is a mapImage, we can render the mapImage.
        */
        createMapImage(mapImages);

        /*
            prepare the controls
        */
        controller.init();

        socket.on("onRemotePlayerConnect_s", function (data) {
            const id = data.id;
            playersData[id] = data;
        });
        
        socket.on("onPlayerDisconnect_s", function (id) {
            delete playersData[id];
        });
        
        /*
            Tell the listeners that they can attach to the socket
        */
        attachSocketForUsername();
        attachSocketForOrientation();
        attachSocketForProjectile();
        attachSocketForMapImage();
    });

    /*
        Reconnected? Server sends you the updated data.
    */
    socket.on("onPlayerReconnect_s", function (gameData, mapImages) {
        playersData = gameData.playersData;
        yourData = playersData[gameData.id];
    });
    
    socket.on("connect_timeout", function(){
        // todo
    });

    /*
        We are in a TUNNEL! WHY? OW? WHY? HOW?
    */
    socket.on("connect_error", function(){
        connectionError = true;
    });

    /*
        We are back!
    */
    socket.on("reconnect", function () {
        socket.emit("onPlayerReconnect_c");
        connectionError = false;
    });

    /*
        A remote player has connection problems!
    */
    socket.on("onRemotePlayerReconnect_s", function (id) {
        
        const playerData = playersData[id];
        console.log("onRemotePlayerReconnect_s", playerData);
        if (playerData != undefined) {
            delete playerData.connectionError;
        }
    });

    socket.on("onRemotePlayerConnectionError_s", function (id) {
        const playerData = playersData[id];
        if (playerData != undefined) {
            playerData.connectionError = true;
        }
    });

    /*
        Ping to the server, so that the server knows that we are still alive.
    */
    socket.on("ping", function () {
        socket.emit("ping_c");
    });
});
