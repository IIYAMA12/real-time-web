const canvas = {
    init: function () {

    },
    collision: {
        check: function () {

        }
    },
    render: {
        func: function (timeStamp) {
            var speedFactor = 1;
            if (canvas.render.lastTimeStamp != undefined) {
                speedFactor = (timeStamp - canvas.render.lastTimeStamp) / 17;
            }

            const canvasElement = document.getElementsByTagName("canvas")[0];


            var context = canvasElement.getContext('2d');
            context.clearRect(0, 0, 500, 500);

            // context.fillStyle = "black";

            // context.strokeStyle = "black";

            // context.fillRect(0, 0, 500, 500);

            const rocketElement = document.getElementById("rocket");
            // console.log(rocketElement);
            
            context.rotate(0);
            
            const rocketScale = 0.5;
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

                    console.log(position, rotation);

                    const 
                        imageSizeX = 50 * rocketScale, 
                        imageSizeY = 150 * rocketScale
                    ;

                    const 
                        x = position.x / 100 * 500 - (imageSizeX / 2), 
                        y = position.y / 100 * 500 - (imageSizeY / 2)
                    ;
                    

                    rotation *= Math.PI / 180;

                    context.translate(x, y);
                    
                    context.rotate(rotation);
                    // console.log(playerData.orientation.rotation);
                    // console.log("rotation:", playerData.orientation.rotation);

                    
                    context.drawImage(rocketElement, -(imageSizeX / 2), -(imageSizeY / 2), imageSizeX, imageSizeY);
                    
                    context.rotate(-rotation);
                    context.translate(-x, -y);
                }
                

                
                
                // console.log("playerData", playerData)
            }
            // console.log("counter:", counter);

            if ("requestAnimationFrame" in window) {
                canvas.render.animationFrameRequest = window.requestAnimationFrame(canvas.render.func);
            } else {
                canvas.render.animationTimer = setTimeout(canvas.render.func, 30, new Date().getTime());
            }
        },
        start: function () {
            if (this.animationFrameRequest == undefined) {
                // this.lastTimeStamp = new Date().getTime();
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