function updatePlayerRotation(e,t){const n=t/17,o=controller.keyState;!o.left&&!o.right||o.left&&o.right||(o.left?yourData.orientation.rotation-=2*n:yourData.orientation.rotation+=2*n)}const canvas={init:function(){frameRender.attachFunction(updatePlayerRotation),frameRender.attachFunction(updateProjectilePosition),frameRender.attachFunction(projectileFireRate),frameRender.attachFunction(canvas.render.func)},collision:{check:function(){}},mapImages:null,render:{image:{components:{ship:{name:"rocket-frame",friendlyName:"rocket",extension:"png",frame:{current:1,max:3,delay:300,nextTime:0},elements:[]}},request:{frame:function(e){const t=canvas.render.image.components[e];if(t){const e=t.frame,n=(new Date).getTime();return n>e.nextTime&&(e.nextTime=n+e.delay,e.current++,e.current>e.max&&(e.current=1)),e.current}},componentElement:function(e,t){const n=canvas.render.image.components[e];if(n){if(void 0==n.elements[t-1]){const e=document.createElement("img");e.src="img/"+n.name+t+"."+n.extension,e.alt=n.friendlyName,n.elements[t-1]={element:e,loaded:!1},e.addEventListener("load",function(e){n.elements[t-1].loaded=!0})}return n.elements[t-1]}}}},func:function(e,t){const n=t/17,o=document.getElementsByTagName("canvas")[0],i=o.width,a=o.height,r=Math.min(i/1e3),c=100*r,s=o.getContext("2d");s.clearRect(0,0,i,a),s.fillStyle="rgb(230,230,230)",s.fillRect(0,0,i,a);const l=document.getElementById("rocket");s.rotate(0),s.textAlign="center",s.font="20px Georgia";const m=canvas.render.image.request;for(let e=0;e<projectiles.length;e++){const t=projectiles[e],o=t.position;t.velocity;if(t.position.x+=t.velocity.x*n,t.position.y+=t.velocity.y*n,s.beginPath(),s.arc(o.x/100*(i-.8*c)+.4*c,o.y/100*(a-.8*c)+.4*c,3*r,0,2*Math.PI),s.fillStyle="red",s.fill(),t.owner!=yourData.id){const e=yourData.orientation.position,t=e.x-o.x,n=e.y-o.y;Math.sqrt(t*t+n*n)<4&&(yourData.orientation.position={x:50,y:50})}}for(const e in playersData){const t=playersData[e];if(void 0!=t.orientation){const e=t.orientation.position;t.orientation.velocity;let o=t.orientation.rotation;const d=3.141592653*(o-90)*2/360,f=.2*n;e.x+=Math.cos(d)*f,e.y+=Math.sin(d)*f,e.x>100?e.x=100:e.x<0&&(e.x=0),e.y>100?e.y=100:e.y<0&&(e.y=0);const u=25*r,y=75*r,g=e.x/100*(i-.8*c)+.4*c,h=e.y/100*(a-.8*c)+.4*c;o*=Math.PI/180,s.translate(g,h),void 0!=t.username&&(s.fillStyle="black",s.fillText(t.username,0,-50*r)),s.rotate(o);const p=m.frame("ship"),v=m.componentElement("ship",p);let x=l;void 0!=v&&v.loaded&&(x=v.element),s.drawImage(x,-u/2,-y/2,u,y),s.rotate(-o),s.translate(-g,-h)}}const d=canvas.mapImage;void 0!=d&&s.drawImage(d,0,0,a,i)}}};window.addEventListener("load",function(){canvas.init();const e=document.getElementsByTagName("canvas")[0];!function(){const t=e.parentElement;if(void 0!=t){const n=t.getBoundingClientRect();e.width=n.width,e.height=n.width}}(),window.addEventListener("resize",function(){const t=e.parentElement;if(void 0!=t){const n=t.getBoundingClientRect();e.width=n.width,e.height=n.width}})});