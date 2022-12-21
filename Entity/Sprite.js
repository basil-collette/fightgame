export default class Sprite {    
    constructor(
        name = 'anonymous sprite',
        {canvas, context},
        {
            position,
            imageSrc,
            scale = 1,
            framesMax = 1,
            framesCycle = 1,
            offSet = {x: 0, y: 0},
            mirrored = false
        }
    ) {
        this.name = name;
        this.canvas = canvas;
        this.context = context;
        
        this.position = position;
        this.lastPosition = position;

        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.offSet = offSet;
        
        this.framesMax = framesMax;
        this.framesCycle = framesCycle;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;

        this.mirrored = mirrored;

        this.spriteFPS = framesMax * framesCycle;
    }

    begin() {
        //
    }

    update(lastSecondFPS) {
        this.spriteFPS = this.framesMax * this.framesCycle
        this.framesHold = lastSecondFPS / this.spriteFPS;
    }

    draw(interp) {
        this.position.x = (this.lastPosition.x + (this.position.x - this.lastPosition.x) * interp);
        this.position.y = (this.lastPosition.y + (this.position.y - this.lastPosition.y) * interp);

        const finalWidth = this.image.width / this.framesMax;

        this.context.save();
        this.context.scale(this.mirrored ? -1 : 1, 1);
        this.context.drawImage(
            this.image,
            this.frameCurrent * finalWidth,
            0,
            finalWidth,
            this.image.height,
            this.mirrored ? (finalWidth * this.scale * -1) - (this.position.x - this.offSet.x) : (this.position.x - this.offSet.x),
            this.position.y - this.offSet.y,
            finalWidth * this.scale,
            this.image.height * this.scale
        );
        this.context.restore();

        //this.showBoxes();
    }

    end() {
        this.animateFrame();
    }

    animateFrame() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold  < 1) {
            if (this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    showBoxes() {
        const finalWidth = this.image.width / this.framesMax;

        //image
        this.context.strokeStyle = 'blue';
        this.context.strokeRect(this.mirrored ? (finalWidth * this.scale * -1) - (this.position.x - this.offSet.x) : (this.position.x - this.offSet.x), (this.position.y - this.offSet.y), finalWidth * this.scale, this.image.height * this.scale);

        //hitBox
        this.context.fillStyle = 'blue';
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

}