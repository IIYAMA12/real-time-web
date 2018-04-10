const socketApp = require("express")();
const server = require("http").Server(socketApp);
const io = require("socket.io")(server);
const randomstring = require("randomstring");

server.listen(4444);
console.log("Real-time-web socketApp listening at http://localhost:4444/");


const players = {
    data: {
        private: {

        },
        public: {

        },
        set: function (key, data, private) {
            if (!private) {
                this.public[key] = data;
            }
            this.private[key] = data;
            return true;
        },
        get: function (key) {
            return this.private[key] != undefined ? this.private[key] : this.public[key];
        },
        delete: function (key) {
            delete this.public[key];
            delete this.private[key];
            return true;
        }
    },
    new: function () {
        const id = randomstring();
        const playerData = {id: id, score: 0};
        this.private[id] = playerData;
        this.public[id] = playerData;
        return id;
    }
};

io.on("connection", function (socket) {
    socket.on("onPlayerJoin_c", function (data) {
        console.log("onPlayerJoin_c");
        
        const id = players.new;

        socket.emit("onPlayerJoin_s", {
            id : id,
            score: 0,
            playerData: players.data.public
        });
    });
    socket.on("onStreamOrientation_c", function (data) {
        socket.emit("onStreamOrientation_s", data);
    });
});
      

// https://socket.io/docs/#  

module.exports = socketApp;