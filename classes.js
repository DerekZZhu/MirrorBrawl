class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset= {x:0, y:0}}) {
        this.position = position
        this.width = 50
        this.height = 150

        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax,
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width/ this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width/this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax -1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        color, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset= {x:0, y:0},
        sprites
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })


        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey = ""
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.isAttacking = false
        this.color = color

        this.health = 100
        this.damage = 10

        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5

        this.sprites = sprites

        for (const sprite in sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
            // sprites[sprite].scale = 
        }
    }

    // draw() {
    //     c.fillStyle = this.color
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height)

    //     if (this.isAttacking) {
    //         c.fillStyle = 'green'
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    //     }
    // }

    update() {
        this.draw()
        this.animateFrames()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
      }
    
    takeHit() {
        this.health -= 20
    
        if (this.health <= 0) {
          this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }
    

    switchSprite(sprite, scale=1 ) {
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax-1) return
        this.scale = scale
        switch(sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
               break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.scale = 0.45
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break
        
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
            break
        }
    }
}
