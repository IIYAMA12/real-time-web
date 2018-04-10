const playersData = {};


window.addEventListener("load", function () {
    console.log("loaded_c")
    socket.emit("onPlayerJoin_c");
});


socket.on("onPlayerJoin_s", function () {
    console.log("loaded_s")
    setInterval(function (){
        socket.emit("onStreamOrientation_c", { position: "test", rotation: "test", velocity: "test" });
    }, 200);

    socket.on("onStreamOrientation_s", function (data) {
        console.log(data);
    });
});