function updatePlayerRotation (timeStamp, timeslice) {
    if (!connectionError) {
        const speedFactor = timeslice / 17;
        const keyState = controller.keyState;
        if ((keyState.left || keyState.right) && !(keyState.left && keyState.right)) {
            if (keyState.left) {
                yourData.orientation.rotation -= speedFactor * 2;
            } else {
                yourData.orientation.rotation += speedFactor * 2;
            }
        }
    }
}



const canvas = {
    init: function () {

        frameRender.attachFunction(updatePlayerRotation);
        frameRender.attachFunction(updateProjectilePosition);

        frameRender.attachFunction(projectileFireRate);

        frameRender.attachFunction(canvas.render.func);
        
        

    },
    collision: {
        check: function () {

        }
    },
    mapImages: null,
    render: {
        image: {
            components: {
                ship: {
                    name: "rocket-frame",
                    friendlyName: "rocket",
                    extension: "png",
                    frame: {
                        current: 1,
                        max: 3,
                        delay: 300,
                        nextTime: 0
                    },
                    elements: []
                },
                connectionError: {
                    name: "connection-error",
                    friendlyName: "connection error",
                    extension: "png",
                    frame: {
                        current: 1,
                        max: 1,
                        delay: 0,
                        nextTime: 0
                    },
                    elements: []
                }
            },
            request: {
                frame: function (componentName) {
                    const component = canvas.render.image.components[componentName];
                    if (component) {
                        const frameData = component.frame;
                        const timeNow = new Date().getTime()
                        if (timeNow > frameData.nextTime) {
                            
                            frameData.nextTime = timeNow + frameData.delay;

                            frameData.current++;
                            if (frameData.current > frameData.max) {
                                frameData.current = 1;
                            }
                        }
                        return frameData.current;
                    }
                },
                componentElement: function (componentName, frame) {
                    const component = canvas.render.image.components[componentName];
                    if (component) {
                        if (component.elements[frame - 1] == undefined) {
                            const element = document.createElement("img");
                            element.src = "img/" + component.name + frame + "." + component.extension;
                            
                            element.alt = component.friendlyName;
                            component.elements[frame - 1] = {element: element, loaded: false};
                            element.addEventListener("load", function(e) {
                                component.elements[frame - 1].loaded = true;
                            });
                        }
                        return component.elements[frame - 1];
                    }
                }
            }
        },
        func: function (timeStamp, timeslice) {
            const speedFactor = timeslice / 17;


            const canvasElement = document.getElementsByTagName("canvas")[0];

            const 
                canvasWidth = canvasElement.width,
                canvasHeight = canvasElement.height
            ;

            const scaleFactor = Math.min(canvasWidth / 1000);

            const sideOffset = 100 * scaleFactor;

            const context = canvasElement.getContext('2d');
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            context.fillStyle = "rgb(230,230,230)";


            context.fillRect(0, 0, canvasWidth, canvasHeight);
            


            // for (let index = 0; index < mapImages.length; index++) {
            //     const mapImage = mapImages[index];
            //     context.drawImage(mapImage.data, mapImage.x * (canvasWidth / 5), mapImage.y * (canvasHeight / 5), canvasWidth / 5, canvasHeight / 5);
            // }

            const rocketElement = document.getElementById("rocket");

            
            context.rotate(0);
            context.textAlign="center"; 
            context.font="20px Georgia";

            const rocketScale = 0.5;

            const imageRequests = canvas.render.image.request;

            for (let i = 0; i < projectiles.length; i++) {
                const projectileData = projectiles[i];

                const position = projectileData.position;

                context.beginPath();
                context.arc(position.x / 100 * (canvasWidth - sideOffset * 0.8) + sideOffset * 0.4, position.y / 100 * (canvasHeight - sideOffset * 0.8) + sideOffset * 0.4, 3 * scaleFactor, 0, 2 * Math.PI);
                context.fillStyle = "red";
                context.fill();
            }

            for (const id in playersData) {
                
                const playerData = playersData[id];
                
                if (playerData.orientation != undefined) {
                    const position = playerData.orientation.position;


                    const velocity = playerData.orientation.velocity;

                    let rotation = playerData.orientation.rotation;
                    if (!connectionError) {
                        

                        // position.x += velocity.x * speedFactor * 0.2;
                        // position.y += velocity.y * speedFactor * 0.2;

                        const rotOffset =  ((rotation - 90) * 3.141592653 * 2)/360;
                                
                        const offset = speedFactor * 0.2;

                        
                        position.x += Math.cos(rotOffset) * offset;
                        position.y += Math.sin(rotOffset) * offset;
                        

                        if (position.x > 100) {
                            position.x = 100;
                        } else if (position.x < 0) {
                            position.x = 0;
                        }

                        if (position.y > 100) {
                            position.y = 100;
                        } else if (position.y < 0) {
                            position.y = 0;
                        }
                    }
                    

                    const 
                        imageSizeX = 50 * rocketScale * scaleFactor, 
                        imageSizeY = 150 * rocketScale * scaleFactor
                    ;

                    const 
                        x = position.x / 100 * (canvasWidth - sideOffset * 0.8) + sideOffset * 0.4, 
                        y = position.y / 100 * (canvasHeight - sideOffset * 0.8)  + sideOffset * 0.4
                    ;
                    
                    
                    

                    rotation *= Math.PI / 180;

                    


                    context.translate(x, y);
                    
                    if (playerData.username != undefined) {
                        context.fillStyle = "black";
                        context.fillText(playerData.username, 0, -50 * scaleFactor); //
                    }




                    context.rotate(rotation);

                    // Laser sign
                    /*
                        context.beginPath();
                        context.moveTo(0,0);
                        context.strokeStyle = "red";
                        context.lineTo(0, -Math.max(canvasWidth, canvasHeight));
                        context.stroke();
                    */
                    

                    const frame = imageRequests.frame("ship");
                    const imageData = imageRequests.componentElement("ship", frame);

                    let image = rocketElement;

                    if (imageData != undefined && imageData.loaded) {
                        image = imageData.element;
                        
                    }
                    
                    context.drawImage(image, -(imageSizeX / 2), -(imageSizeY / 2), imageSizeX, imageSizeY);
                    
                    
                    
                    context.rotate(-rotation);
                    context.translate(-x, -y);
                }
            }
            const mapImage = canvas.mapImage;
            if (mapImage != undefined) {
                for (let index = 0; index < 2; index++) {
                    context.drawImage(mapImage, 0, 0, canvasHeight, canvasWidth);
                }
            }

            for (const id in playersData) {
                
                const playerData = playersData[id];
                
                if (playerData.orientation != undefined) {
                    const position = playerData.orientation.position;
                    if (playerData.connectionError) {
                        const imageData = imageRequests.componentElement("connectionError", 1);
                        if (imageData.loaded) {
                            const 
                                x = position.x / 100 * (canvasWidth - sideOffset * 0.8) + sideOffset * 0.4, 
                                y = position.y / 100 * (canvasHeight - sideOffset * 0.8)  + sideOffset * 0.4
                            ;
                    
        
                            context.translate(x, y);
                            const imageSize = 50 * scaleFactor;
                            context.drawImage(imageData.element, -(imageSize / 2), -(imageSize / 2), imageSize, imageSize);
                            
                            context.translate(-x, -y);
                        }
                    }
                }
            }
        }
    }
};
window.addEventListener("load", function () {
    canvas.init();
    const canvasElement = document.getElementsByTagName("canvas")[0];
    (function() {
        const gameInterfaceWrapper = canvasElement.parentElement;
        if (gameInterfaceWrapper != undefined) {
            const boundingBox = gameInterfaceWrapper.getBoundingClientRect();
            
            canvasElement.width = boundingBox.width;
            canvasElement.height = boundingBox.width;
        }
    })();
    window.addEventListener("resize", function () {
        const gameInterfaceWrapper = canvasElement.parentElement;
        if (gameInterfaceWrapper != undefined) {
            const boundingBox = gameInterfaceWrapper.getBoundingClientRect();
            
            canvasElement.width = boundingBox.width;
            canvasElement.height = boundingBox.width;
        }
    });
});
