const socket=io.connect("http://localhost:4444");socket.on("onPlayerConnect_s",function(t,a){playersData=t.playersData,yourData=playersData[t.id],frameRender.start(),startStreamOrientation(),createMapImage(a)}),socket.on("onRemotePlayerConnect_s",function(t){const a=t.id;playersData[a]=t}),socket.on("onPlayerDisconnect_s",function(t){delete playersData[t]});