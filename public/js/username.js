const usernameInputElement=document.getElementById("username");function attachSocketForUsername(){socket.on("onPlayerUsernameChange_s",function(e,n){void 0!=playersData[e]&&(playersData[e].username=n),yourData.id==e&&(usernameInputElement.value=n)}),usernameInputElement.addEventListener("input",function(e){const n=e.target;void 0!=yourData&&n.value.length<100&&(yourData.username=n.value,socket.emit("onPlayerUsernameChange_c",n.value))})}