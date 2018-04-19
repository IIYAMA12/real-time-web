const usernameInputElement = document.getElementById("username");
socket.on("onPlayerUsernameChange_s", function (id, username) {
    if (playersData[id] != undefined) {
        playersData[id].username = username;
    }
    if (yourData.id == id) {
        usernameInputElement.value = username;
    }
});

usernameInputElement.addEventListener("input", function (e) {
    const element = e.target;
    if (yourData != undefined && element.value.length < 100) {
        yourData.username = element.value;
        socket.emit("onPlayerUsernameChange_c", element.value);
    }
});
    

