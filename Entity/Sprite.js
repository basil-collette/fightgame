export default class Sprite {    
    constructor(
        {canvas, context},
        {
            position,
            imageSrc,
            scale = 1,
            framesMax = 1,
            framesCycle = 2,
            offSet = {x: 0, y: 0},
            mirrored = false
        }
    ) {
        this.canvas = canvas;
        this.context = context;
        
        this.position = position;
        this.lastPosition = position;

        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.offSet = offSet;
        
        this.framesMax = framesMax;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;

        this.mirrored = mirrored;

        this.spriteFPS = framesMax * framesCycle;
    }

    begin() {

    }

    update(lastSecondFPS) {
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

        //this.animateFrame();
    }

    end() {
        this.animateFrame();
    }

    animateFrame() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
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
/*
export default class Sprite {   
    constructor(
        {canvas, context},
        {
            position,
            imageSrc,
            scale = 1,
            framesMax = 1,
            offSet = {x: 0, y: 0},
            mirrored = false
        }
    ) {
        this.canvas = canvas;
        this.context = context;
        
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offSet = offSet;

        this.mirrored = mirrored;        
    }

    draw() {
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

        //this.context.strokeStyle = 'blue';
        //this.context.strokeRect(this.mirrored ? (finalWidth * this.scale * -1) - (this.position.x - this.offSet.x) : (this.position.x - this.offSet.x), (this.position.y - this.offSet.y), finalWidth * this.scale, this.image.height * this.scale);

        this.context.restore();
    }

    animateFrame() {
        this.framesElapsed++;
        
        if(this.framesElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++; 
            } else {
                this.frameCurrent = 0;
            }
        }        
    }

    update() {
        this.draw();
        this.animateFrame();
    }
}
*/