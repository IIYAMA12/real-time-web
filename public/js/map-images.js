function createMapImage(a){if(void 0!=a){const e=new Image;e.src=a.data,e.alt="Map image",e.addEventListener("load",function(){e.crossOrigin="Anonymous",canvas.mapImage=e})}}socket.on("onMapImageUpdate_s",function(a){createMapImage(a)});