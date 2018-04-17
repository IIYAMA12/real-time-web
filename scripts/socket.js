const socketApp = require("express")();
const server = require("http").Server(socketApp);
const io = require("socket.io")(server);
const randomstring = require("randomstring");

server.listen(4444);
console.log("Real-time-web socketApp listening at http://localhost:4444/");




const gameData = {
    players: {
        data: {
            private: {
    
            },
            public: {
    
            },
            set: function (id, key, data, privateData) {
                if (!privateData) {
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
                    const playerData = gameData.players.data.session.getRef(id);
                    this.deleteRef(id);
                    if (playerData != undefined) {
                        gameData.players.data.delete(playerData.id);
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
    },
    projectiles: []
};


function destroyProjectile (id) {
    const projectiles = gameData.projectiles;
    for (let i = 0; i < projectiles.length; i++) {
        const projectileData = projectiles[i];
        if (projectileData.id == id) {
            delete projectileData.id;
            break;
        }
    }
    io.sockets.emit("onSyncProjectileDestroy_s", id);
}

io.on("connection", function (socket) {
    (function () {
        let id;
        let playerData = gameData.players.data.session.getRef(socket.id);
        if (playerData == undefined) {
            id = gameData.players.new();

            gameData.players.data.set(id, "socketId", socket.id, true);

            // gameData.players.data.set(id, "username", username);
            

            playerData = gameData.players.data.get(id);

            gameData.players.data.session.setRef(socket.id, playerData);
        }

        io.sockets.to(socket.id).emit("onPlayerConnect_s", {
            id : id,
            score: 0,
            playersData: gameData.players.data.public
        });

        socket.broadcast.emit("onRemotePlayerConnect_s", gameData.players.data.get(id));
    })();


    socket.on("onStreamOrientation_c", function (orientation) {
        
        const playerData = gameData.players.data.session.getRef(socket.id);


        if (playerData != undefined && playerData.id != undefined) {
            gameData.players.data.set(playerData.id, "orientation", orientation);
            socket.broadcast.emit("onStreamOrientation_s", playerData.id, orientation);
        }
    });

    socket.on("onPlayerUsernameChange_c", function (username) {
        const playerData = gameData.players.data.session.getRef(socket.id);
        if (playerData != undefined && playerData.id != undefined) {
            gameData.players.data.set(playerData.id, "username", username);
            socket.broadcast.emit("onPlayerUsernameChange_s", playerData.id, username);
        }
    });



    socket.on("onSyncProjectile_c", function (projectileData) {
        const playerData = gameData.players.data.session.getRef(socket.id);
        if (playerData != undefined && playerData.id != undefined) {
            const id = randomstring.generate();

            projectileData.id = id;
            projectileData.owner = playerData.id;
            gameData.projectiles[gameData.projectiles.length] = projectileData;
            
            setTimeout(destroyProjectile, 1000, id);

            io.sockets.emit("onSyncProjectile_s", projectileData);
        }
    });

    

    socket.on("disconnect", function () {        
        const playerData = gameData.players.data.session.getRef(socket.id);

        if (playerData) {
            socket.broadcast.emit("onPlayerDisconnect_s", playerData.id);
        }
        gameData.players.data.session.disconnect(socket.id);
    });
});
      

// https://socket.io/docs/#  

module.exports = socketApp;