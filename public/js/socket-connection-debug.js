const socket = io.connect('http://localhost:4444');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

setInterval(function (){
    socket.emit("stream-orientation", { position: "test", rotation: "test", velocity: "test" });
    // console.log("send message")
}, 200);