const usernameInputElement = document.getElementById("username");
socket.on("onPlayerUsernameChange_s", function (id, username) {
    if (playersData[id] != undefined) {
        playersData[id].username = username;
    }
});

usernameInputElement.addEventListener("input", function (e) {
    const element = e.target;
    if (yourData != undefined) {
        yourData.username = element.value;
        socket.emit("onPlayerUsernameChange_c", element.value);
    }
});
    