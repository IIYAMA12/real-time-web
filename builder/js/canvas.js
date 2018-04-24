/*
    This function is called every frame and will change the localPlayer rocket rotation while holding the left or right arrows
*/
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

        /*
            These are functions you want to run every frame.
        */
        frameRender.attachFunction(updatePlayerRotation);
        frameRender.attachFunction(updateProjectilePosition);

        frameRender.attachFunction(projectileFireRate);
        frameRender.attachFunction(canvas.render.func);
        
        

    },
    mapImages: null,
    render: {
        image: {
            components: {
                /*
                    These are images that will be rendered in the canvas. If applied more images, it can become an animation.
                */
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
            /*
                Request the image elements.
            */
            request: {
                /*
                    request next image frame
                */
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
                /*
                    Get a component.
                */
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
            /* 
                Calculate the speed factor. This will make sure that the speed of the elements/animations are 99% the same on every device.
            */
            const speedFactor = timeslice / 17;

            /*
                Get the canvas element
            */
            const canvasElement = document.getElementsByTagName("canvas")[0];

            /*
                get the canvas size
            */
            const 
                canvasWidth = canvasElement.width,
                canvasHeight = canvasElement.height
            ;


            /*
                This scale factor will make sure every thing is scaled based on the client his resolution
            */
            const scaleFactor = Math.min(canvasWidth / 1000);

            /*
                Define the offsets from the sides of the canvas
            */
            const sideOffset = 100 * scaleFactor;


            /*
                Get the canvas context
            */
            const context = canvasElement.getContext('2d');


            /*
                clear the context
            */
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            /*
                Give the context a background color
            */
            context.fillStyle = "rgb(230,230,230)";
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            

            /*
                This is the default rocket element, which is used as fallback.
            */
            const rocketElement = document.getElementById("rocket");

            /*
                reset the rotation of the canvas just incase.
            */
            context.rotate(0);


            /*
                Get the image request object. Which is used to render images and animations.
            */
            const imageRequests = canvas.render.image.request;


            /*
                Render the projectiles
            */
            for (let i = 0; i < projectiles.length; i++) {
                const projectileData = projectiles[i];

                const position = projectileData.position;

                context.beginPath();
                context.arc(position.x / 100 * (canvasWidth - sideOffset * 0.8) + sideOffset * 0.4, position.y / 100 * (canvasHeight - sideOffset * 0.8) + sideOffset * 0.4, 3 * scaleFactor, 0, 2 * Math.PI);
                context.fillStyle = "red";
                context.fill();
            }

            const rocketScale = 0.5;

            /*
                define the font settings for the player labels
            */
           context.textAlign="center"; 
           context.font="20px Georgia";


            /*
                Go through all players and draw the ship and the username
            */

            for (const id in playersData) {
                
                const playerData = playersData[id];
                
                if (playerData.orientation != undefined) {
                    const position = playerData.orientation.position;


                    

                    let rotation = playerData.orientation.rotation;

                    /*
                        Players can only update their position if they are connected
                    */
                    if (!connectionError) {
                        
                        // Enable this if you want to use velocity behaviours //
                        /*
                            const velocity = playerData.orientation.velocity;
                            position.x += velocity.x * speedFactor * 0.2;
                            position.y += velocity.y * speedFactor * 0.2;
                        */


                        /*
                            Calculate the player his position
                        */
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

                    // Laser sign, -- experimental --
                    /*
                        context.beginPath();
                        context.moveTo(0,0);
                        context.strokeStyle = "red";
                        context.lineTo(0, -Math.max(canvasWidth, canvasHeight));
                        context.stroke();
                    */
                    
                    /*
                        Get the animation frame (image)
                    */
                    const frame = imageRequests.frame("ship");
                    const imageData = imageRequests.componentElement("ship", frame);

                    let image = rocketElement;

                    if (imageData != undefined && imageData.loaded) {
                        image = imageData.element;
                        
                    }
                    
                    /*
                        draw the ship
                    */
                    context.drawImage(image, -(imageSizeX / 2), -(imageSizeY / 2), imageSizeX, imageSizeY);
                    
                    
                    /*
                        Reset the context
                    */
                    context.rotate(-rotation);
                    context.translate(-x, -y);
                }
            }
            /*
                Draw the cloud images from openweather api
            */
            const mapImage = canvas.mapImage;
            if (mapImage != undefined) {
                for (let index = 0; index < 2; index++) {
                    context.drawImage(mapImage, 0, 0, canvasHeight, canvasWidth);
                }
            }

            /*
                If players have connection timeouts, render a warning image.
            */
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

            /*
                If the localPlayer has connection problems, render a connection error image with the text: "Connection error".
            */
            if (connectionError) {

                const imageData = imageRequests.componentElement("connectionError", 1);
                if (imageData != undefined) {
                    const imageSize = 300 * scaleFactor 
                    const 
                        offsetX = canvasWidth / 2,
                        offsetY = canvasHeight / 2
                    ;
                    context.translate(offsetX, offsetY);
                    
                    context.textAlign="center"; 
                    context.font="20px Georgia";

                    context.drawImage(imageData.element, -(imageSize / 2), -(imageSize / 2), imageSize, imageSize);

                    context.fillStyle = "red";
                    context.fillText("Connection error", 0, imageSize / 2 + 20 * scaleFactor);

                    context.translate(-offsetX, -offsetY);
                }
            }
        }
    }
};

/*
    When the window has been loaded make the canvas resize able
*/ 
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
