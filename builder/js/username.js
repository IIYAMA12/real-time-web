/*
    This code is used to manage the username input. The username updates live!
*/
const usernameInputElement = document.getElementById("username");
function attachSocketForUsername () {
    /*
        A player his name has been changed. This can also be the localPlayer, when the server sets it!
    */
    socket.on("onPlayerUsernameChange_s", function (id, username) {
        if (playersData[id] != undefined) {
            playersData[id].username = username;
        }
        if (yourData.id == id) {
            usernameInputElement.value = username;
        }
    });

    /* 
        A player is typing 
    */
    usernameInputElement.addEventListener("input", function (e) {
        const element = e.target;
        if (yourData != undefined && element.value.length < 100) {
            yourData.username = element.value;
            socket.emit("onPlayerUsernameChange_c", element.value);
        }
    });   
}
