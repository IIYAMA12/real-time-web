const frameRender = {
    attachedFunctions: [

    ],
    attachFunction: function (func) {
        frameRender.attachedFunctions[frameRender.attachedFunctions.length] = func;
    },
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
    start: function () {
        if (this.animationFrameRequest == undefined) {

            if ("requestAnimationFrame" in window) {
                this.animationFrameRequest= window.requestAnimationFrame(this.func);
            } else {
                frameRender.animationTimer = setTimeout(canvas.render.func, 30, new Date().getTime());
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
};