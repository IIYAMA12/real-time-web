const projectiles=[];function updateProjectilePosition(o,e){}let nextProjectileFireTime=0;function projectileFireRate(o){if(void 0!=yourData&&controller.keyState.space&&o>nextProjectileFireTime){const e=yourData.orientation.position;const t=3.141592653*(yourData.orientation.rotation-90)*2/360,i={position:{},velocity:{}},n=7;i.position.x=e.x+Math.cos(t)*n,i.position.y=e.y+Math.sin(t)*n,i.velocity.x=(i.position.x-e.x)/n,i.velocity.y=(i.position.y-e.y)/n,socket.emit("onSyncProjectile_c",i),nextProjectileFireTime=o+300}}socket.on("onSyncProjectile_s",function(o){projectiles[projectiles.length]=o}),socket.on("onSyncProjectileDestroy_s",function(o){for(let e=0;e<projectiles.length;e++){if(projectiles[e].id===o){projectiles.splice(e,1);break}}});