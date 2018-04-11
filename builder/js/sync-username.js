
socket.on("onPlayerUsernameChange_s", function (id, username) {
    if (playersData[id] != undefined) {
        playersData[id].username = username;
    }
});

document.getElementById("username").addEventListener("input", function (e) {
    const element = e.target;
    if (yourData != undefined) {
        yourData.username = element.value;
        socket.emit("onPlayerUsernameChange_c", element.value);
    }
});
    