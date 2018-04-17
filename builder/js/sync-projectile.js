
const projectiles = [];

function updateProjectilePosition (timeStamp, timeslice) {
    const speedFactor = timeslice / 17;
}

let nextProjectileFireTime = 0;
function projectileFireRate (timeStamp) {

    if (yourData != undefined && controller.keyState.space && timeStamp > nextProjectileFireTime) {
        const position = yourData.orientation.position;

        let rotation = yourData.orientation.rotation;

        const rotOffset =  ((rotation - 90) * 3.141592653 * 2)/360;
        
        const projectile = {
            position: {},
            velocity: {}
        }

        const offset = 7;

        projectile.position.x = position.x + (Math.cos(rotOffset) * offset);
        projectile.position.y  = position.y + (Math.sin(rotOffset) * offset);

        projectile.velocity.x = (projectile.position.x - position.x) / offset,
        projectile.velocity.y = (projectile.position.y - position.y) / offset


        socket.emit("onSyncProjectile_c", projectile);

        nextProjectileFireTime = timeStamp + 300;
    }
}



socket.on("onSyncProjectile_s", function (projectileData) {
    projectiles[projectiles.length] = projectileData;
});


socket.on("onSyncProjectileDestroy_s", function (id) {
    for (let i = 0; i < projectiles.length; i++) {
        const projectile = projectiles[i];
        if (projectile.id === id) {
            projectiles.splice(i, 1);
            break;
        }
    }
});