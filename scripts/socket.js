const socketApp = require("express")();
const server = require("http").Server(socketApp);
const io = require("socket.io")(server, {
    pingInterval: 1500,
    pingTimeout: 30000,
});
const randomstring = require("randomstring");
const mapImageRequest = require("./map-image-requests.js");
const sharedsession = require("express-socket.io-session");



server.listen(4444);
console.log("Real-time-web socketApp listening at http://localhost:4444/");




const gameData = {
    /*
        All players
    */
    players: {
        /*
            With their data
        */
        data: {
            /*
                Private data (other players can't/shouldn't have access to this)
            */
            private: {},

            /*
                Public data (This data is synced with other players)
            */
            public: {},

            /*
                ... .set(string id, string key, var data, boolean privateData)

                When privateData is enabled, it will only store inside of the private object. Else it is stored in both.
            */
            set: function (id, key, data, privateData) {
                if (this.public[id]) {
                    if (!privateData) {
                        if (data === null) {
                            delete this.public[id][key];
                        } else {
                            this.public[id][key] = data;
                        }
                    }
                    if (data === null) {
                        delete  this.private[id][key];
                    } else {
                        this.private[id][key] = data;
                    }
                    return true;
                }
            },
            /*
                ... .get(string id, string key, boolean privateData)

                 When privateData is disabled, it will only get data from the public object. Else it will get from the private object. 
                 If not found, it will try to get it from the public object.
            */
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
            /*
                Delete all data from a player.
            */
            delete: function (id) {
                delete this.public[id];
                delete this.private[id];
                return true;
            },

            /*
                This object is used to get the player data, with the socket id.
            */
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
        /*
            Add a new player.
        */
        new: function () {
            const id = randomstring.generate();

            /* 
                Prepare private data
            */
            this.data.private[id] = {id: id, score: 0, orientation: {position: {x: 50, y: 50}, rotation: 0, velocity: {x: 0, y: 0}}};

            /* 
                Prepare public data
            */
            this.data.public[id] = {id: id, score: 0, orientation: {position: {x: 50, y: 50}, rotation: 0, velocity: {x: 0, y: 0}}};

            return id;
        }
    },
    projectiles: []
};

/*
    This function can destroy a projectile based on it's ID.
*/
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

/*
    This function sends map data to all players
*/
function sendMapData (mapImage) {
    io.sockets.emit("onMapImageUpdate_s", mapImage);
}
/*
    Add a callBack for the file: "map-image-request.js"
*/
mapImageRequest.callBack = sendMapData;


/*
    A user has been connected
*/
io.on("connection", function (socket) {
    
    /*
        Prepare the setup of the player
    */
    (function () {
        let id;
        let playerData = gameData.players.data.session.getRef(socket.id);
        if (playerData == undefined) {
            /*
                Generate data for a new player and get a id back.
            */
            id = gameData.players.new();

            gameData.players.data.set(id, "socketId", socket.id, true);
            

            playerData = gameData.players.data.get(id);

            gameData.players.data.session.setRef(socket.id, playerData);
        }
        /*
            Send a message back to the client that did just connect.
        */
        io.sockets.to(socket.id).emit("onPlayerConnect_s", 
            {
                id : id,
                score: 0,
                playersData: gameData.players.data.public
            },
            mapImageRequest.mapImage
        );

        /*
            Tell other players that a remote player has been connected
        */
        socket.broadcast.emit("onRemotePlayerConnect_s", gameData.players.data.get(id));

        /*
            Make a random username for the player
        */
        let username = "player:" + Math.floor(Math.random() * 10000);


        /*
            Maybe the player did have a slack username? If so user that one!
        */
        if (socket.handshake.session.slackUsername != undefined && typeof(socket.handshake.session.slackUsername) == "string") {
            username = socket.handshake.session.slackUsername;
        }

        /*
            Save the username
        */
        gameData.players.data.set(id, "username", username);

        /*
            His new username!
        */
        io.sockets.emit("onPlayerUsernameChange_s", id, username);
    })();

    function convertToNumber (value) {
        value = Number(value);
        if (!isNaN(value) && value !== Infinity) {
            return value;
        }
    }

    /*
        This function is used to save copy the client data in to the server data.
    */
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
                    if (newData.position != undefined && data != undefined) {
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
                    if (newData.rotation != undefined && data != undefined) {
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
                    if (newData.velocity != undefined && data != undefined) {
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


    /*
        Sync projectiles
    */
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

    
    /*
        A player has been disconnected
    */
    socket.on("disconnect", function () {        
        const playerData = gameData.players.data.session.getRef(socket.id);

        if (playerData != undefined) {
            socket.broadcast.emit("onPlayerDisconnect_s", playerData.id);
        }
        gameData.players.data.session.disconnect(socket.id);
    });

    /*
        A player has been reconnected
    */
    socket.on("onPlayerReconnect_c", function () {
        const playerData = gameData.players.data.session.getRef(socket.id);
        if (playerData != undefined) {
            gameData.players.data.set(playerData.id, "connectionError", null);

            io.sockets.to(socket.id).emit("onPlayerReconnect_s", 
                {
                    id : playerData.id,
                    score: 0,
                    playersData: gameData.players.data.public
                },
                mapImageRequest.mapImage
            );
            io.sockets.emit("onRemotePlayerReconnect_s", playerData.id);
        }
    });

    socket.on("ping_c", function () {
        const playerData = gameData.players.data.session.getRef(socket.id);
        if (playerData != undefined) {
            gameData.players.data.set(playerData.id, "lastPingTime", new Date().getTime(), true);
        }
    });
});

/*
    Check if a player timed out!
*/
setInterval(function () {
    const timeNow = new Date().getTime();
    for (const playerId in gameData.players.data.private) {
        const playerPrivateData = gameData.players.data.private[playerId];
        if (playerPrivateData != undefined) {
            const lastPingTime = playerPrivateData.lastPingTime;
            if (timeNow > lastPingTime + 5000) {
                if (!playerPrivateData.connectionError) {
                    gameData.players.data.set(playerPrivateData.id, "connectionError", true);
                    io.sockets.emit("onRemotePlayerConnectionError_s", playerPrivateData.id);
                }
            } else if (gameData.players.data.get(playerPrivateData.id, "connectionError")) {
                gameData.players.data.set(playerPrivateData.id, "connectionError", null);
                io.sockets.emit("onRemotePlayerReconnect_s", playerPrivateData.id);
            }
        }
    }
}, 1000);

// https://socket.io/docs/#  

module.exports = function (app, session) {
    io.use(sharedsession(session, {
        autoSave:true
    })); 
    return socketApp;
};