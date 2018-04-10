setInterval(function (){
    socket.emit("stream-orientation_c", { position: "test", rotation: "test", velocity: "test" });
}, 200);

socket.on("stream-orientation_s", function (data) {
    console.log(data);
});