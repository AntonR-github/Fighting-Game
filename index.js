const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc:'./img/background/mountain.webp'
})



// player (player 1)
const player = new Fighter({
    position: { x: 50, y: 0 },
    velocity: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    imageSrc:'./img/samurai/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset:{
      x:215,
      y:200
    },
    sprites:{
       idle: {
        imageSrc:'./img/samurai/Idle.png',
        framesMax:8
       },
       run: {
        imageSrc:'./img/samurai/Run.png',
        framesMax: 8
       }, 
       jump: {
        imageSrc:'./img/samurai/Jump.png',
        framesMax: 2
       }, 
       fall: {
        imageSrc:'./img/samurai/Fall.png',
        framesMax: 2
       }, 
       attack1: {
        imageSrc:'./img/samurai/Attack1.png',
        framesMax: 6
       },
       takeHit: {
        imageSrc:'./img/samurai/Take Hit - white silhouette.png',
        framesMax: 4
       },
       death: {
        imageSrc:'./img/samurai/Death.png',
        framesMax: 6
       }
    },
    attackBox: {
        offset:{
            x:100,
            y:0
        },
        width:100,
        height:50
    }

});

// enemy (player 2)
const enemy = new Fighter({
    position: { x: 900, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    offset: { x: -50, y: 0 },
    imageSrc:'./img/warrior/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset:{
      x:215,
      y:217
    },
    sprites:{
       idle: {
        imageSrc:'./img/warrior/Idle.png',
        framesMax:4
       },
       run: {
        imageSrc:'./img/warrior/Run.png',
        framesMax: 8
       }, 
       jump: {
        imageSrc:'./img/warrior/Jump.png',
        framesMax: 2
       }, 
       fall: {
        imageSrc:'./img/warrior/Fall.png',
        framesMax: 2
       }, 
       attack1: {
        imageSrc:'./img/warrior/Attack1.png',
        framesMax: 4
       },
       takeHit: {
        imageSrc: './img/warrior/Take hit.png',
        framesMax: 3
       },
       death: {
        imageSrc:'./img/warrior/Death.png',
        framesMax: 7
       }
    },
    attackBox: {
        offset:{
            x:-120,
            y:0
        },
        width:100,
        height:50
    }

});

// keys

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}


decreaseTimer()

// animation
function animate() {
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player.update();
    enemy.update();
    canvasContext.fillStyle = 'rgba(255,255,255,0.15)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    player.velocity.x = 0
    enemy.velocity.x = 0

    // player  movement 
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
 
    // player jumping
    if(player.velocity.y < 0) {
       player.switchSprite('jump')
    } else if (player.velocity.y > 0 ){
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // enemy jumping
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
     } else if (enemy.velocity.y > 0 ){
         enemy.switchSprite('fall')
     }

    // detect for collision - player attacks
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking && player.framesCurrent === 4 ) {
        enemy.takeHit()
        player.isAttacking = false
    
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    } 

      // if player misses
      if (player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    // detect for collision - enemy attacks
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        player.takeHit()
        enemy.isAttacking = false
        
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

      // if enemy misses
      if (enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }
  

    // End Game based on Health

    if(enemy.health <= 0 || player.health <= 0){
      determineWinner({player, enemy, timerId })
    }


};

// keys down event listener
window.addEventListener('keydown', (event) => {
    if (!player.dead){
    switch (event.key) {
        // player
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case 'w':
            player.velocity.y = -20
            break;
        case ' ':
            player.attack()
            break;
    }
}
   // enemy
   if(!enemy.dead){
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20
            break;
        case 'ArrowDown':
            enemy.attack()
            break;
        }
     }
})

// keys ups event listener
window.addEventListener('keyup', (event) => {
    // player
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
    }
    // enemy
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
    }
})


animate();







