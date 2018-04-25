# Real Time Web course repo



![Example of the game version 1.0.0](readme-content/game-example.png)
Version 1.0.0

- [Assignment](ASSIGNMENT.md)

This web app lets you fly with your spaceship inside of an area. Every remote player that joins the website owns his own ship and will be streaming it's orientation to you.


## Table of contents

- [Interaction](#interaction)
- [Express + sockets, which ports do I have to open?](#express--sockets-which-ports-do-i-have-to-open)
- [Expose when hosting on localhost](#expose-when-hosting-on-localhost)
- [Start the server!](#start-the-server)
- [Socket](#socket)
- [Socket communication events used](#socket-communication-events-used)
- [Other communications](#other-communications)
- [Which data is available where?](#which-data-is-available-where)
- [Time out feedback](#time-out-feedback)
- [Todo](#todo)


## Interaction

--- ; --------------- ; ---
--- MORE is COMING SOON ---
--- ; --------------- ; ---


## Express + sockets, which ports do I have to open?

Different ports for default express and using sockets.

```JS
const app = express();

// Start server
app.listen(3000, function() {
    console.log("Real-time-web APP listening at http://localhost:3000/");
});
```
Default express.

---

```JS
const socketApp = require("express")();
const server = require("http").Server(socketApp);
const io = require("socket.io")(server);

server.listen(4444);
```
Using express with sockets.

---

In this project I still want to use ejs templates so there are two different apps saved in to two different variables. The default app is running at port 3000 and the socket app is running at port 4444. This means that if you want to expose the website to the internet, you have to set 2 ports open.

## Expose when hosting on localhost

Enable connection and ports for your website:
```bash
npm run expose
```
Expose the webite to the internet, part 1. (main app)

---

```bash
npm run expose2
```
Expose the webite to the internet, part 2. (socket app)

---

### Edit clientside
You have to make a little change on the clientside, before exposing with ngrok is going to work.

---

1. Start gulp, so that you can start working in the `builder` folder. 
```bash
gulp
```
* Gulp will minify your scripts.
* Let you use scss and minify it.

---

2. Now open the file: builder/js/socket-connection.js

---

3. Edit the IP. (expose only)

```JS
const socket = io.connect('http://localhost:4444');
```
3.1 With localhost.

```JS
const socket = io.connect('http://XXXX.ngrok.io ');
```
3.2 When using ngrok, you have to replace the clienside io-connection-address with the IP of the socket app. !important!


## Start the server!

Before you start make sure the ports 3000 and 4444 are open.

Start the app.
```bash
npm start
```
## Socket

```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js"></script>
```
Download the socket script from cloudflare.

---

```JS
const socket = io.connect('http://localhost:4444');
```
Establish connection. `client`

---

```JS
io.on("connection", function (socket) {
    // , this function block created for each client.
});
```
A client has been connected. `server`

---

```JS
io.on("connection", function (socket) {
    
    socket.on("disconnect", function () {

    });
    
});
```
Detect when a client has been disconnected. `server`

---

```JS
socket.emit("event-name" /*, var ... */);
```
Trigger an event on clientside to serverside. `client >` server
Arguments can be passed.

---

```JS
io.on("connection", function (socket) {
    socket.on("event-name", function (/* var ... */) {

    });
});
```
Receive a trigger event on serverside. client `> server`. The parameters are containing the data that is attached to the event.

---

```JS
io.on("connection", function (socket) {
    io.sockets.to(socket.id).emit("event-name" /*, var ... */);
});
```

Trigger an event to a specific client on serverside to clientside. `server >` client.
Arguments can be passed.

---

```JS
io.on("connection", function (socket) {
     socket.broadcast.emit("event-name" /*, var ... */);
});
```

Trigger an event to all clients, `except the sender`, on serverside to clientside. `server >` client.
Arguments can be passed.

---

```JS
socket.on("event-name", function (/* var ... */) {

});
```
Receive a trigger event on serverside. server `> client`.

## Socket communication events used

### Server-side events

#### Build in
```JS
"connected"
"disconnect"
```

#### Custom (from client-side)
```JS
"ping_c"
"onStreamOrientation_c"
"onPlayerUsernameChange_c"
"onSyncProjectile_c"
```

`_c` = client-side.

### Client-side events 

#### Build in
```JS
"ping"
"connect_error"
"reconnect"

// experimental
"connect_timeout" 
```

#### Custom (from server-side)

```JS
"onSyncProjectile_s"
"onSyncProjectileDestroy_s"
"onPlayerDisconnect_s"
"onPlayerReconnect_s"
"onRemotePlayerReconnect_s"
"onRemotePlayerConnectionError_s"
"onStreamOrientation_s"
"onPlayerUsernameChange_s"
"onMapImageUpdate_s"

// experimental
"onPlayerConnect_s" 
```

`_s` = server-side.

## Other communications

### Open Weather Map
```JS
base64Img.requestBase64("https://tile.openweathermap.org/map/clouds_new/1/0/0.png?appid=", function(err, res, body) {
    mapImagesRequests.mapImage = {data: body};
});
```

Request a base64 image from the Open Weather Map API, every 10 seconds.
Requires the dependency: `base64-img` module.

By encoding it with base64, it is easier for the client to apply the image on to the canvas.

### Slack API

1. Link to slack oauth website
```HTML
<a href="https://slack.com/oauth/authorize?client_id=349357647332.350639213591&scope=identity.basic">Login with slack</a>
```

2. Confirm oauth request
![Slack oauth request](readme-content/slack-oauth.png)

3. Receive on serverside
```JS
/*
    Use a specific environment for the slack keys!
*/
require('dotenv').config()

const express = require('express');
const router = express.Router();
const fetchUrl = require("fetch").fetchUrl;

router.get("/oauth", function (req, res, next) {
    /*
        The slack API!
    */
    fetchUrl("https://slack.com/api/oauth.access?client_id=" + process.env.client_id + "&client_secret=" + process.env.client_secret + "&code=" + req.query.code + "&redirect_uri=http://localhost:3000/oauth", function(error, meta, data) {
        if (error == undefined) {
            data = JSON.parse(data);

            /*
                Save in a session if you want. (make sure to download the express session module)
            */
            req.session.slackAccessToken = data.access_token;
            req.session.slackUsername = data.user.name;

            res.redirect("/");
        }
    });
});

module.exports = router;
```

[Slack oauth documentation](https://api.slack.com/docs/oauth)


## Which data is available where?

![Communication between all parties](readme-content/flow-app.png)


## Time out feedback

### Server-side config
```JS
const io = require("socket.io")(server, {
    pingInterval: 1500, // Set up ping interval
    pingTimeout: 30000, // Set up time out limit
});
```
- The server pings now every 1,5 second.
- A client times out now after 30 seconds.

### Client-side

```JS
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
```

Lots of communication events.

### Server-side

```JS
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
```
The player has been reconnected. It might be possible that he/she is missing some information, so send everything to be sure everything is up to date.


```JS
socket.on("ping_c", function () {
    const playerData = gameData.players.data.session.getRef(socket.id);
    if (playerData != undefined) {
        gameData.players.data.set(playerData.id, "lastPingTime", new Date().getTime(), true);
    }
});
```
The client informed the server that he/she is still alive. Save inside of the client his/her server-data the server-time. So that the server knows when he/she last pinged.


```JS
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
```

Check every second, if a client his/her last ping time hasn't been updated for 5 seconds.


<details>
    <summary>Visual representation</summary>
    <img src="https://github.com/IIYAMA12/real-time-web/blob/development/readme-content/time-out-remote-player.png" alt="time out remote player">
    <p>A remote player has timed out</p>
    <img src="https://github.com/IIYAMA12/real-time-web/blob/development/readme-content/time-out-local-player.png" alt="time out localPlayer">
    <p>The localPlayer has timed out</p>
</details>


## Todo
- [X] Added private and public player data. (The session socket ID is for example only available in the private data, and the user game ID is available in both.)
- [X] Stream orientation with remote players
- [X] Sync username with remote players
- [X] Clean up disconnected remote players.
- [ ] Collision detection
- [ ] Fix no focus on browser tab, which causes the animation frame to stop. This will cause desync, because the player spaceship animation goes on by the remote players.
- [ ] Slack API fix session bug.
