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
        set: function (id, key, data, privateData) {
            if (!privateData) {
                if (key == "socketId") {
                    console.log("Add data", data, " on key", key);
                }
                this.public[id][key] = data;
            }
            this.private[id][key] = data;
            return true;
        },
        get: function (id, key, privateData) {
            if (this.private[id] != undefined) {
                if (!privateData) {
                    if (key != undefined) {
                        return this.public[id][key];
                    }
                    return this.public[id];
                } else {
                    if (key != undefined) {
                        return this.private[id][key] != undefined ? this.private[id][key] : this.public[id][key];
                    }
                    return this.private[id] != undefined ? this.private[id] : this.public[id];
                }
            }
        },
        delete: function (id) {
            delete this.public[id];
            delete this.private[id];
            return true;
        },
        session: {
            ref: {},
            getRef: function (id) {
                return this.ref[id];
            },
            setRef: function (id, data) {
                this.ref[id] = data;
            },
            deleteRef: function (id) {
                delete this.ref[id];
            },
            disconnect: function (id) {
                console.log("disconnect")
                

                const playerData = players.data.session.getRef(id);
                this.deleteRef(id);
                if (playerData != undefined) {
                    console.log("disconnect playerData.id", playerData.id);
                    players.data.delete(playerData.id);
                }
            }
        }
    },
    new: function () {
        const id = randomstring.generate();
        this.data.private[id] = {id: id, score: 0, orientation: {position: {x: 50, y: 50}, rotation: 0, velocity: {x: 0, y: -1}}};
        this.data.public[id] = {id: id, score: 0, orientation: {position: {x: 50, y: 50}, rotation: 0, velocity: {x: 0, y: -1}}};
        return id;
    }
};


io.on("connection", function (socket) {
    socket.on("onPlayerJoin_c", function (username) {
        console.log("onPlayerJoin_c");
        let id;

        let playerData = players.data.session.getRef(socket.id);
        if (playerData == undefined) {
            id = players.new();

            players.data.set(id, "socketId", socket.id, true);

            players.data.set(id, "username", username);
            
            console.log("??", players.data.get(id, "username"));

            playerData = players.data.get(id);
            console.log("new player", socket.id, id, playerData)
            players.data.session.setRef(socket.id, playerData);
        }
        
        // 
        // 
        io.sockets.to(socket.id).emit("onPlayerJoin_s", {
            id : id,
            score: 0,
            playersData: players.data.public
        });

        socket.broadcast.emit("onRemotePlayerJoin_s", players.data.get(id));

    });

    socket.on("onStreamOrientation_c", function (orientation) {
        
        const playerData = players.data.session.getRef(socket.id);


        if (playerData != undefined && playerData.id != undefined) {
            players.data.set(playerData.id, "orientation", orientation);
            socket.broadcast.emit("onStreamOrientation_s", playerData.id, orientation);
        }
    });

    socket.on("onPlayerUsernameChange_c", function (username) {
        const playerData = players.data.session.getRef(socket.id);
        if (playerData != undefined && playerData.id != undefined) {
            players.data.set(playerData.id, "username", username);
            socket.broadcast.emit("onPlayerUsernameChange_s", playerData.id, username);
        }
    });

    socket.on("disconnect", function () {
        console.log("diconnected", socket.id);
        
        const playerData = players.data.session.getRef(socket.id);
        console.log(players.data.session.ref)
        if (playerData) {
            socket.broadcast.emit("onPlayerDisconnect_s", playerData.id);
        }
        players.data.session.disconnect(socket.id);
    });
});
      

// https://socket.io/docs/#  

module.exports = socketApp;