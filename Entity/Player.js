import Sprite from './Sprite.js';

const gravity = 0.7; //0.7 without timestep sensitivity

export default class Player extends Sprite {

    constructor(
        name = 'anonymous player',
        {canvas, context, domHealthBar}, keys,
        {
            position,
            controls,
            imageSrc,
            scale = 1,
            framesMax = 1,
            offSet = {x: 0, y: 0},
            sprites,
            attackBox = { offSet: {x: 50, y: 50}, width: 150, height: 50},
            mirrored = false
        }
    ) {
        super(name, {canvas, context}, { position, imageSrc, scale, framesMax, framesMax, offSet, mirrored });
        
        this.domHealthBar = domHealthBar;
        this.keys = keys;

        this.velocity = {x: 0, y: 0};
        this.controls = controls;

        this.mirrored = mirrored;
        this.isAttacking = false;
        this.sprites = sprites;
        this.isHited = false;
        this.lastDirection;

        this.health = 100;
        this.height = 150;
        this.width = 50;
        this.xVelocity = 5; //Run speed (5 without timestep sensitivity)
        this.yVelocity = -20; //Jump height (-20 without timestep sensitivity)
        this.strength = 10;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offSet: attackBox.offSet,
            width: attackBox.width,
            height: attackBox.height
        };

        for(const sprite in this.sprites) {
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
        }

        this.slashTime = this.sprites.attack1.framesMax * 100;
    }

    draw(interp) {
        super.draw(interp);

        //showBoxes();
    }

    update(lastSecondFPS) {
        super.update(lastSecondFPS);

        this.lastPosition = this.position;

        this.updateHorizontalPosition();

        this.updateVerticalPosition();

        if (this.isAttacking) {
            this.updateAttackPosition();
        }
    }

    updateVerticalPosition() {
        this.position.y += this.velocity.y;

        if(this.isOnGround(this)) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += gravity;
            
            if (this.velocity.y < 0) {
                this.switchSprites('jump');
            } else if (this.velocity.y > 0) {
                this.switchSprites('fall');
            }
        }
    }

    updateHorizontalPosition() {
        const fpsRelativVelocity = this.xVelocity;
        let tempXPosition = this.position.x;

        if (this.keys[this.controls.left].pressed && this.lastDirection === this.controls.left) {
            tempXPosition -= fpsRelativVelocity;
            if (tempXPosition > 0) {
                this.position.x = tempXPosition;
                this.switchSprites('run');
            }
            if(!this.isAttacking) {
                this.mirrored = true;
            }        

        } else if (this.keys[this.controls.right].pressed && this.lastDirection === this.controls.right) {
            tempXPosition += fpsRelativVelocity;
            if (tempXPosition + this.width < this.canvas.width) {
                this.position.x = tempXPosition;
                this.switchSprites('run');
            }
            if(!this.isAttacking) {
                this.mirrored = false;
            }

        } else {
            this.switchSprites('idle');
        }

        this.velocity.x = 0;
    }

    updateAttackPosition() {
        this.attackBox.position.x = (!this.mirrored) ? (this.position.x + this.attackBox.offSet.x) : (this.position.x - this.attackBox.width + this.width - this.attackBox.offSet.x);
        this.attackBox.position.y = this.position.y + this.attackBox.offSet.y;
    }

    attack() {
        if(!this.isAttacking) {
            this.isAttacking = true;            
            this.switchSprites('attack1');
        }
    }

    jump() {
        if(this.isOnGround(this)) {
            this.velocity.y = this.yVelocity;
        }
    }

    switchSprites(sprite) {
        if (this.image === this.sprites.death.image) {
            return;
        }

        if (
            this.image === this.sprites.takeHit.image
            && this.frameCurrent < this.sprites.takeHit.framesMax - 1
        ) {
            return;
        }

        if (
            this.image === this.sprites.attack1.image
            && this.frameCurrent < this.sprites.attack1.framesMax - 1
        ) {
            return;
        }

        switch(sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCycle = this.sprites.idle.framesCycle;
                    this.frameCurrent = 0;
                }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCycle = this.sprites.run.framesCycle;
                    this.frameCurrent = 0;
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCycle = this.sprites.jump.framesCycle;
                    this.frameCurrent = 0;
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCycle = this.sprites.fall.framesCycle;
                    this.frameCurrent = 0;
                }
                break;
            case 'attack1':
                if(this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCycle = this.sprites.attack1.framesCycle;
                    this.frameCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCycle = this.sprites.takeHit.framesCycle;
                    this.frameCurrent = 0
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCycle = this.sprites.death.framesCycle;
                    this.frameCurrent = 0
                }
                break
        }
    }

    isOnGround(player) {
        return this.position.y + this.height + this.velocity.y >= this.canvas.height - 97;
    }

    takeHit(enemyStrength) {
        this.isHited = true;
        this.health -= enemyStrength;
    
        if (this.health <= 0) {
          this.switchSprites('death');
        } else {
            this.switchSprites('takeHit');
        }
    }

    showBoxes() {
        super.showBoxes();

        //slash hitbox
        if (this.isAttacking) {
            this.context.fillStyle = 'red';
            this.context.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
    }

}