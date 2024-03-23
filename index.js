const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.5

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./Assets/s_bg.png"
})

const player = new Fighter({
    position: {
        x: 0, 
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    color: "red",
    imageSrc: './Assets/BLOutis/Idle.png',
    scale: 0.25,
    framesMax: 1,
    sprites: {
        idle: {
            imageSrc: "./Assets/BLOutis/Idle.png",
            framesMax: 1
        },
        jump: {
            imageSrc: "./Assets/BLOutis/Idle.png",
            framesMax: 1
        },
        run: {
            imageSrc: "./Assets/BLOutis/Run.png",
            framesMax: 1,
            scale: 2
        },
        dodge: {
            imageSrc: "./Assets/BLOutis/Dodge.png",
            framesMax: 1,
            scale: 2  
        },
        block: {
            imageSrc: "./Assets/BLOutis/Block.png",
            framesMax: 1,
            scale: 2
        },
        attack1: {
            imageSrc: "./Assets/BLOutis/attack1.png",
            framesMax: 7
        }
    }
})


const enemy = new Fighter({
    position: {
        x: 400, 
        y:100
    },
    velocity: {
        x:0,
        y:0
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './Assets/ZweiGreg/Idle.png',
    scale: 0.25,
    framesMax: 1,
})

const keys = {
    a: {
        pressed: false
    },

    d: {
        pressed: false
    },

    w: {
        pressed: false
    },

    s: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    },

    ArrowUp: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run', 0.4)
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run', 0.4)
    } else {
        player.switchSprite('idle', 0.25)
    }
    
    if (player.velocity.y < 0) {
        player.switchSprite('jump', 0.25)
    } else if (player.velocity.y > 0) {
        player.switchSprite('idle', 0.25)
    }

    if (keys.s.pressed) {
        player.scale = 0.4
        player.image = player.sprites.block.image
    }

    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // detect for collision
    if (detectCollision({player, enemy}) && player.isAttacking) {
        console.log("enemy hit");
        player.isAttacking = false
        enemy.health -= player.damage
        console.log(enemy.health/100);
        document.querySelector('#enemyHealth').style.width = `${enemy.health}%`
    }

    if (detectCollision({player, enemy}) && enemy.isAttacking) {
        console.log("player hit");
        enemy.isAttacking = false
        player.health -= enemy.damage
        console.log(enemy.health/100);
        document.querySelector('#playerHealth').style.width = `${player.health}%`
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()
decreaseTimer()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -15
            break
        case ' ':
            player.attack()
            break

        case 's':
            keys.s.pressed = true
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -15
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
    //console.log(event);
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }
    //console.log(event);
})
