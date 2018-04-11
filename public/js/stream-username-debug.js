
socket.on("onPlayerUsernameChange_s", function (id, username) {
    if (playersData[id] != undefined) {
        playersData[id].username = username;
    }
});

document.getElementById("username").addEventListener("change", function (e) {
    const element = e.target;
    console.log(element.value);
});
    