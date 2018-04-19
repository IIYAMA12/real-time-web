
const projectiles = [];

function updateProjectilePosition (timeStamp, timeslice) {
    const speedFactor = timeslice / 17;


    for (let i = 0; i < projectiles.length; i++) {
        const projectileData = projectiles[i];

        const position = projectileData.position;
        const velocity = projectileData.velocity;
        
        projectileData.position.x += projectileData.velocity.x * speedFactor;
        projectileData.position.y += projectileData.velocity.y * speedFactor;

        if (projectileData.owner != yourData.id) {
            const localPlayerPosition = yourData.orientation.position;

            const a = localPlayerPosition.x - position.x;
            const b = localPlayerPosition.y - position.y;

            const distance = Math.sqrt( a*a + b*b );
            // https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas

            if (distance < 4) { // default: 4
                yourData.orientation.position = {x: 50, y: 50};
            }
        }
    }
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

        const offset = 6;

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