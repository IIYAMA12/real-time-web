const projectiles=[];function updateProjectilePosition(o,t){const i=t/17;for(let o=0;o<projectiles.length;o++){const t=projectiles[o],e=t.position;t.velocity;if(t.position.x+=t.velocity.x*i,t.position.y+=t.velocity.y*i,t.owner!=yourData.id){const o=yourData.orientation.position,t=o.x-e.x,i=o.y-e.y;Math.sqrt(t*t+i*i)<4&&(yourData.orientation.position={x:50,y:50})}}}let nextProjectileFireTime=0;function projectileFireRate(o){if(void 0!=yourData&&controller.keyState.space&&o>nextProjectileFireTime){const t=yourData.orientation.position;const i=3.141592653*(yourData.orientation.rotation-90)*2/360,e={position:{},velocity:{}},n=6;e.position.x=t.x+Math.cos(i)*n,e.position.y=t.y+Math.sin(i)*n,e.velocity.x=(e.position.x-t.x)/n,e.velocity.y=(e.position.y-t.y)/n,socket.emit("onSyncProjectile_c",e),nextProjectileFireTime=o+300}}socket.on("onSyncProjectile_s",function(o){projectiles[projectiles.length]=o}),socket.on("onSyncProjectileDestroy_s",function(o){for(let t=0;t<projectiles.length;t++){if(projectiles[t].id===o){projectiles.splice(t,1);break}}});