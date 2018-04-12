const controller = {
    init: function () {
        document.addEventListener("keydown", this.eventFunctions.keyStateChange);
        document.addEventListener("keyup", this.eventFunctions.keyStateChange);
    },
    keyState: {
        left: false,
        right: false
    },
    eventFunctions: {
        keyStateChange: function (e) {
            if (!e) {
                e = window.event;
            }


            const state = e.type == "keydown" ? true : false;
        
            let code = e.keyCode;
            if (e.charCode && code == 0) {
                code = e.charCode;
            }
        
            switch(code) {
                case 37:
                    // Key left.
                    controller.keyState.left = state;
                    break;
                case 38:
                    // Key up.
                    break;
                case 39:
                    // Key right.
                    controller.keyState.right = state;
                    break;
                case 40:
            };
        }
    }
};

controller.init();



