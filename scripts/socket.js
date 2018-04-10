const socketApp = require("express")();
const server = require("http").Server(socketApp);
const io = require("socket.io")(server);

server.listen(4444);
console.log("Real-time-web socketApp listening at http://localhost:4444/");


io.on("connection", function (socket) {
  socket.on("stream-orientation_c", function (data) {
    // console.log("stream-position_c");
    socket.emit("stream-orientation_s", data);
  });
});
      

// https://socket.io/docs/#  