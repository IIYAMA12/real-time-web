const controller={init:function(){document.addEventListener("keydown",this.eventFunctions.keyStateChange),document.addEventListener("keyup",this.eventFunctions.keyStateChange)},keyState:{left:!1,right:!1,space:!1},eventFunctions:{keyStateChange:function(e){if(usernameInputElement!=document.activeElement){e||(e=window.event);const t="keydown"==e.type;let n=e.keyCode;switch(e.charCode&&0==n&&(n=e.charCode),n){case 37:controller.keyState.left=t,e.preventDefault();break;case 38:break;case 39:controller.keyState.right=t,e.preventDefault();break;case 40:break;case 32:controller.keyState.space=t,e.preventDefault()}}}}};