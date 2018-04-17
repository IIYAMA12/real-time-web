const socketApp = require("express")();
const server = require("http").Server(socketApp);
const io = require("socket.io")(server);
const randomstring = require("randomstring");
const mapImageRequest = require("./map-image-requests.js");

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
            this.data.private[id] = {id: id, score: 0, orientation: {position: {x: 50, y: 50}, rotation: 0, velocity: {x: 0, y: 0}}};
            this.data.public[id] = {id: id, score: 0, orientation: {position: {x: 50, y: 50}, rotation: 0, velocity: {x: 0, y: 0}}};
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

function sendMapData (mapImage) {
    io.sockets.emit("onMapImageUpdate_s", mapImage);
}

mapImageRequest.callBack = sendMapData;

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

        io.sockets.to(socket.id).emit("onPlayerConnect_s", 
            {
                id : id,
                score: 0,
                playersData: gameData.players.data.public
            },
            mapImageRequest.mapImage
        );

        socket.broadcast.emit("onRemotePlayerConnect_s", gameData.players.data.get(id));
    })();

    function convertToNumber (value) {
        value = Number(value);
        if (!isNaN(value) && value !== Infinity) {
            return value;
        }
    }

    // This function is used to save copy the client data in to the server data.
    const orientationUpdate = {
        execute: function (newData, data) {
            const checkList = this.checkList;
            for (let i = 0; i < checkList.length; i++) {
                const check = checkList[i];
                if (newData[check.key]) {
                    check.func(newData, data);
                }
            }
        },
        checkList: [
            {
                key:"position", 
                func: function (newData, data) {
                    if (newData.position != undefined) {
                        const x = convertToNumber(newData.position.x);
                        const y = convertToNumber(newData.position.y);
                        
                        if (data.position == undefined) {
                            data.position = {x: 0, y: 0};
                        }

                        if (x != undefined) {
                            data.position.x = x;
                        }
                        if (y != undefined) {
                            data.position.y = y;
                        }
                    }
                }
            },
            {
                key:"rotation", 
                func: function (newData, data) {
                    if (newData.rotation != undefined) {
                        const value = convertToNumber(newData.rotation);
                        if (value != undefined) {
                            data.rotation = value;
                        }
                    }
                }
            },
            {
                key:"velocity", 
                func: function (newData, data) {
                    if (newData.velocity != undefined) {
                        const x = convertToNumber(newData.velocity.x);
                        const y = convertToNumber(newData.velocity.y);
                        
                        if (data.velocity == undefined) {
                            data.velocity = {x: 0, y: 0};
                        }

                        if (x != undefined) {
                            data.velocity.x = x;
                        }
                        if (y != undefined) {
                            data.velocity.y = y;
                        }
                    }
                }
            }
        ]
    };

    socket.on("onStreamOrientation_c", function (newOrientationData) {
        
        const playerData = gameData.players.data.session.getRef(socket.id);
        

        if (playerData != undefined && playerData.id != undefined) {
            const orientation = gameData.players.data.get(playerData.id, "orientation");
            orientationUpdate.execute(newOrientationData, orientation);

            socket.broadcast.emit("onStreamOrientation_s", playerData.id, orientation);
        }
    });

    socket.on("onPlayerUsernameChange_c", function (username) {
        const playerData = gameData.players.data.session.getRef(socket.id);
        if (playerData != undefined && playerData.id != undefined && typeof(username) === "string" && username.length < 100) {
            gameData.players.data.set(playerData.id, "username", username);
            socket.broadcast.emit("onPlayerUsernameChange_s", playerData.id, username);
        }
    });



    socket.on("onSyncProjectile_c", function (projectileData) {
        const playerData = gameData.players.data.session.getRef(socket.id);
        if (playerData != undefined && playerData.id != undefined) {
            const id = randomstring.generate();


            
            const newProjectile = {
                id: id,
                owner: playerData.id,
            };

            if (projectileData.velocity) {
                const x = convertToNumber(projectileData.velocity.x);
                const y = convertToNumber(projectileData.velocity.y);
                if (x != undefined && y != undefined) {
                    newProjectile.velocity = {x: x, y: y};
                }
            }

            if (projectileData.position) {
                const x = convertToNumber(projectileData.position.x);
                const y = convertToNumber(projectileData.position.y);
                if (x != undefined && y != undefined) {
                    newProjectile.position = {x: x, y: y};
                }
            }

            if (newProjectile.velocity != undefined && newProjectile.position != undefined) {
                gameData.projectiles[gameData.projectiles.length] = newProjectile;
                
                setTimeout(destroyProjectile, 1000, id);

                io.sockets.emit("onSyncProjectile_s", newProjectile);
            }
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