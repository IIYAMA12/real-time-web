function updatePlayerRotation (speedFactor) {
    const keyState = controller.keyState;
    if ((keyState.left || keyState.right) && !(keyState.left && keyState.right)) {
        if (keyState.left) {
            yourData.orientation.rotation -= speedFactor;
        } else {
            yourData.orientation.rotation += speedFactor;
        }
    }
}

const canvas = {
    init: function () {
        // todo
    },
    collision: {
        check: function () {

        }
    },
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
        func: function (timeStamp) {
            var speedFactor = 1;
            if (canvas.render.lastTimeStamp != undefined) {
                speedFactor = (timeStamp - canvas.render.lastTimeStamp) / 17;
            }

            const canvasElement = document.getElementsByTagName("canvas")[0];

            const 
                canvasWidth = canvasElement.width,
                canvasHeight = canvasElement.height
            ;

            var context = canvasElement.getContext('2d');
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            context.fillStyle = "rgb(230,230,230)";


            context.fillRect(0, 0, canvasWidth, canvasHeight);
            

            const rocketElement = document.getElementById("rocket");

            
            context.rotate(0);
            context.textAlign="center"; 
            context.font="20px Georgia";

            const rocketScale = 0.5;

            const imageRequests = canvas.render.image.request;

            updatePlayerRotation(speedFactor); // local player only.

            for (const id in playersData) {
                
                const playerData = playersData[id];
                
                if (playerData.orientation != undefined) {
                    const position = playerData.orientation.position;

                    const velocity = playerData.orientation.velocity;

                    let rotation = playerData.orientation.rotation;

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

                    

                    const 
                        imageSizeX = 50 * rocketScale, 
                        imageSizeY = 150 * rocketScale
                    ;

                    const 
                        x = position.x / 100 * (canvasWidth - 80) + 40, 
                        y = position.y / 100 * (canvasHeight - 80)  + 40
                    ;
                    

                    rotation *= Math.PI / 180;

                    


                    context.translate(x, y);
                    
                    if (playerData.username != undefined) {
                        context.fillStyle = "black";
                        context.fillText(playerData.username, 0, -50); //
                    }


                    context.rotate(rotation);
                    

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

            if ("requestAnimationFrame" in window) {
                canvas.render.animationFrameRequest = window.requestAnimationFrame(canvas.render.func);
            } else {
                canvas.render.animationTimer = setTimeout(canvas.render.func, 30, new Date().getTime());
            }
        },
        start: function () {
            if (this.animationFrameRequest == undefined) {

                if ("requestAnimationFrame" in window) {
                    this.animationFrameRequest= window.requestAnimationFrame(this.func);
                } else {
                    canvas.render.animationTimer = setTimeout(canvas.render.func, 30, new Date().getTime());
                }
            }
        },
        stop: function () {
            if (this.animationFrameRequest != undefined) {
                window.cancelAnimationFrame(this.animationFrameRequest);
                delete this.animationFrameRequest;
            } else if (this.animationTimer != undefined) {
                clearTimeout(this.animationTimer);
                delete this.animationTimer;
            }
        }
    }
};
canvas.init();