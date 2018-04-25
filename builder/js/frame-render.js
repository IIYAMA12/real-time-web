/*
    This code lets you use requestAnimationFrame and bound callback functions to it.
*/

const frameRender = {
    attachedFunctions: [

    ],

    /*
        With this method you can add callback functions, which will be called every frame.
    */
    attachFunction: function (func) {
        frameRender.attachedFunctions[frameRender.attachedFunctions.length] = func;
    },

    /* 
        This function will be called every frame, once it is started with the method 'start'   
    */
    func: function (timeStamp) {

        let timeSlice;
        if (frameRender.lastTimeStamp != undefined) {  
            timeSlice = (timeStamp - frameRender.lastTimeStamp);
        }
        frameRender.lastTimeStamp = timeStamp;
        
        if ("requestAnimationFrame" in window) {
            frameRender.animationFrameRequest = window.requestAnimationFrame(frameRender.func);
        } else {
            frameRender.animationTimer = setTimeout(canvas.render.func, 30, new Date().getTime());
        }

        if (timeSlice != undefined) {
            for (let i = 0; i < frameRender.attachedFunctions.length; i++) {
                const func = frameRender.attachedFunctions[i];
                func(timeStamp, timeSlice);
            }
        }
    },
    /*
        Start rendering
    */
    start: function () {
        if (this.animationFrameRequest == undefined) {

            if ("requestAnimationFrame" in window) {
                this.animationFrameRequest= window.requestAnimationFrame(this.func);
            } else {
                frameRender.animationTimer = setTimeout(canvas.render.func, 30, new Date().getTime());
            }
        }
    },
    /*
        Stop rendering
    */
    stop: function () {
        if (this.animationFrameRequest != undefined) {
            window.cancelAnimationFrame(this.animationFrameRequest);
            delete this.animationFrameRequest;
        } else if (this.animationTimer != undefined) {
            clearTimeout(this.animationTimer);
            delete this.animationTimer;
        }
    }
};