import Sprite from './Entity/Sprite.js';
import Player from './Entity/Player.js';;

window.onload = function() {

    var requestAnimationFrame = typeof requestAnimationFrame === 'function' ?
        requestAnimationFrame
        :
        (function() {
            var lastTimestamp = Date.now(), now, timeout;
    
            return function(callback) {
                now = Date.now();
                timeout = Math.max(0, timestep - (now - lastTimestamp));
                lastTimestamp = now + timeout;
                return setTimeout(function() {
                    callback(now + timeout);
                }, timeout);
            };
        })(),
        cancelAnimationFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;
    
    var fpsDisplay = document.getElementById('fpsDisplay');
    var fps = 30; //currentFPS, it's evolving during the loop

    var settings = {
        maxFPS: 30,
        showFPS: true,
    }

    var maxFPS = 60;
    var lastFrameTimeMs = 0;
    var delta = 0;
    var timestep = 1000 / 60;
    var framesThisSecond = 0;
    var lastFpsUpdate = 0;
    var running = false;
    var started = false;
    var frameID = 0;

    const player1Health = document.getElementById('player1Health');
    const player2Health = document.getElementById('player2Health');

    const canvas = document.querySelector('canvas');
    canvas.width = 1024;
    canvas.height = 576;

    const context = canvas.getContext('2d');

    var startTimer = 3;
    var fightTimer = 60;

    const background = new Sprite({canvas, context}, {
        position: {x: 0, y: 0 },
        imageSrc: './assets/img/background.png'
    });

    const shop = new Sprite({canvas, context}, {
        position: {x: 600, y: 128 },
        imageSrc: './assets/img/shop.png',
        scale: 2.75,
        framesMax: 6
    });

    var intervalCleared = false;

    let keys = {
        //player1 left
        "q": {
            pressed: false
        },
        //player1 right
        "d": {
            pressed: false
        },
        //player1 jump
        "z": {
            pressed: false
        },
        //player1 slash
        "x": {
            pressed: false
        },
        //player2 left
        "k": {
            pressed: false
        },
        //player2 right
        "m": {
            pressed: false
        },
        //player2 jump
        "o": {
            pressed: false
        },
        //player2 slash
        ":": {
            pressed: false
        }
    }

    function renderFPS(timeStamp) {
        fpsDisplay.textContent = Math.round(fps) + ' FPS';
    }

    const player1 = new Player({canvas, context}, keys, {
        position: {x: 50, y: 100},
        controls: {left: "q", right: "d"},
        scale: 2.5,
        offSet: {x: 215, y: 155},
        sprites: {
            idle: {
                imageSrc: './assets/img/samuraiMack/Idle.png',
                framesMax: 8,
            },
            run: {
                imageSrc: './assets/img/samuraiMack/Run.png',
                framesMax: 8,
            },
            jump: {
                imageSrc: './assets/img/samuraiMack/Jump.png',
                framesMax: 2,
            },
            fall: {
                imageSrc: './assets/img/samuraiMack/Fall.png',
                framesMax: 2,
            },
            attack1: {
                imageSrc: './assets/img/samuraiMack/Attack1.png',
                framesMax: 6,
            },
            takeHit: {
                imageSrc: './assets/img/samuraiMack/Take Hit - white silhouette.png',
                framesMax: 4
            },
            death: {
                imageSrc: './assets/img/samuraiMack/Death.png',
                framesMax: 6
            }
        }
    });

    const player2 = new Player({canvas, context}, keys, {
        position: {x: 924, y: 100},
        controls: {left: "k", right: "m"},
        scale: 2.5,
        offSet: { x: 215, y: 170 },
        mirrored: true,
        sprites: {
            idle: {
                imageSrc: './assets/img/Kenji/Idle.png',
                framesMax: 4,
            },
            run: {
                imageSrc: './assets/img/Kenji/Run.png',
                framesMax: 8,
            },
            jump: {
                imageSrc: './assets/img/Kenji/Jump.png',
                framesMax: 2,
            },
            fall: {
                imageSrc: './assets/img/Kenji/Fall.png',
                framesMax: 2,
            },
            attack1: {
                imageSrc: './assets/img/Kenji/Attack1.png',
                framesMax: 4,
            },
            takeHit: {
                imageSrc: './assets/img/kenji/Take hit.png',
                framesMax: 3
            },
            death: {
                imageSrc: './assets/img/kenji/Death.png',
                framesMax: 7
            }
        }
    });

    var players = [
        player1,
        player2
    ];

    function update() {
        background.update(fps);
        shop.update(fps);
        player1.update(fps);
        player2.update(fps);

        if (players[0].isHited && players[0].frameCurrent == players[0].framesMax - 1) {
            players[0].isHited = false;
        }
        
        if (players[0].isAttacking && players[0].frameCurrent == players[0].framesMax - 1) {
            players[0].isAttacking = false;
        } else if (
            players[0].isAttacking
            && players[0].frameCurrent > 3
            && rectangularCollision({entity1: players[0], entity2: players[1]})
            && !players[1].isHited
        ) {
            players[1].takeHit(10);
            player2Health.style.width = player2.health + "%";
            checkWin();
        }
        
        if (players[1].isHited && players[1].frameCurrent == players[1].framesMax - 1) {
            players[1].isHited = false;
        }

        if (players[1].isAttacking && players[1].frameCurrent == players[1].framesMax - 1) {
            players[1].isAttacking = false;
        } else if (
            players[1].isAttacking
            && players[1].frameCurrent == 2
            && rectangularCollision({entity1: players[1], entity2: players[0]})
            && !players[0].isHited
        ) {
            players[0].takeHit(10);
            player1Health.style.width = player1.health + "%";
            checkWin();
        }
    }
    
    function draw(interp) {
        background.draw(interp);
        shop.draw(interp);

        player1.draw(interp);
        player2.draw(interp);
    }
    
    function panic() {
        delta = 0; // discard the unsimulated time
        // ... snap the player to the authoritative state
    }
    
    function begin() {
        //before rendering
    }
    
    function end() {
        //after rendering
        background.end();
        shop.end();
        player1.end();
        player2.end();
    }
    
    function mainLoop(timestamp) {        
        // Throttle the frame rate. (update at each 1000/maxFPS, so if not : return till necessary)
        if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
            requestAnimationFrame(mainLoop);
            return;
        }
    
        delta += timestamp - lastFrameTimeMs; // delta is now equal to time passed between this loop and last one
        lastFrameTimeMs = timestamp;
    
        begin(timestamp, delta);

        var numUpdateSteps = 0;
        while (delta >= timestep) { //update untill it's time to draw() (depending of amount of fps asked)
            update();
    
            delta -= timestep;
            if (++numUpdateSteps >= 240) {
                panic();
                break;
            }
        }

        draw(delta / timestep);

        if (true) { //showFPS
            renderFPS(fps);
        }

        if (timestamp > lastFpsUpdate + 1000) {
            fps = framesThisSecond; //fps = 0.25 * framesThisSecond + 0.75 * fps; //quel intéret ?
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
        }
        framesThisSecond++; //increment the amout of loop executed this second

        end();

        requestAnimationFrame(mainLoop);
    }
    
    function stop() {
        running = false;
        started = false;
        cancelAnimationFrame(frameID);
    }
    
    function start() {
        if (!started) { // don't request multiple frames
            started = true;

            loop(startTimer, showFightBeginningTimer, startFight);
            
            // Dummy frame to get our timestamps and initial drawing right.
            // Track the frame ID so we can cancel it if we stop quickly.
            frameID = requestAnimationFrame( function(timestamp) {
                //draw(1); // initial draw
                running = true;
                // reset some time tracking variables
                lastFrameTimeMs = timestamp;
                lastFpsUpdate = timestamp;
                framesThisSecond = 0;
                // actually start the main loop
                frameID = requestAnimationFrame(mainLoop);
            });
        }
    }

    function checkWin() {
        if (fightTimer <= 0) {
            if (players[0].health < players[1].health) {
                alert('players2 win');
            } else if (players[1].health < players[0].health) {
                alert('players1 win');
            } else {
                alert('equality');
            }
            closeFight();
        } else {
            if (players[0].health <= 0) {
                if(players[1].health <= 0) {
                    alert('equality');
                } else {
                    alert('players2 win');
                }
                closeFight();
            } else if (players[1].health <= 0) {
                if(players[0].health <= 0) {
                    alert('equality');
                } else {
                    alert('players1 win');
                }
                closeFight();
            }
        }
    }

    function rectangularCollision({entity1, entity2}) {
        return (
            entity1.attackBox.position.x + entity1.attackBox.width >= entity2.position.x
            && entity1.attackBox.position.x <= entity2.position.x + entity2.width
            && entity1.attackBox.position.y + entity1.attackBox.height >= entity2.position.y
            && entity1.attackBox.position.y <= entity2.position.y + entity2.height
        );
    }

    function keyDownListener(event) {
        switch(event.key) {
            case 'q':
                keys["q"].pressed = true;
                players[0].lastDirection = 'q';
                break;
            case 'd':
                keys["d"].pressed = true;
                players[0].lastDirection = 'd';
                break;
            case 'z':
                keys["z"].pressed = true;
                players[0].jump();
                break;
            case 'x':
                keys["x"].pressed = true;
                player1.attack();
                break;

            case 'k':
                keys["k"].pressed = true;
                players[1].lastDirection = 'k';
                break;
            case 'm':
                keys["m"].pressed = true;
                players[1].lastDirection = 'm';
                break;
            case 'o':
                keys["o"].pressed = true;
                players[1].jump();
                break;
            case ':':
                keys[":"].pressed = true;
                player2.attack();
                break;

            case 'return':
                stop();
                break;
        }
    }

    function keyUpListener(event) {
        switch(event.key) {
            case 'q':
                keys["q"].pressed = false;
                players[0].lastDirection = 'd';
                break;
            case 'd':
                keys["d"].pressed = false;
                players[0].lastDirection = 'q';
                break;
            case 'z':
                keys["z"].pressed = false;
                players[0].velocity.y = 0;
                break;

            case 'k':
                keys["k"].pressed = false;
                players[1].lastDirection = 'm';
                break;
            case 'm':
                keys["m"].pressed = false;
                players[1].lastDirection = 'k';
                break;
            case 'o':
                keys["o"].pressed = false;
                players[1].velocity.y = 0;
                break;
        }
    }

    function loop(time, loopFunction, endFunction) {
        let timer = setInterval(() => {
            if(intervalCleared) {
                intervalCleared = false;
                clearInterval(timer);
            }
            if(time > 0) {
                time--;
                loopFunction();
            } else {
                endFunction();
                clearInterval(timer);
            }
        }, 1000);
    }

    function startFight() {
        window.addEventListener('keydown', keyDownListener);
        window.addEventListener('keyup', keyUpListener);

        start();

        loop(fightTimer, showFightTimer, checkWin);
    }

    function showFightBeginningTimer() {
        //animation of showing startTimer
        console.log(startTimer);
        startTimer--;
    }

    function showFightTimer() {
        //animation of showing fightTimer
        console.log(fightTimer);
        fightTimer--;
    }

    function closeFight() {
        window.removeEventListener('keydown', keyDownListener);
        window.removeEventListener('keyup', keyUpListener);
        intervalCleared = true;
    }

    function resetGame() { 
        startTimer = 3;
        fightTimer = 60;

        //position des players;

        //loop(startTimer, showFightBeginningTimer, startFight);
    }

    /*
    function setSettings({ maxFPS, showFPS }) {
        settings.maxFPS = maxFPS ? maxFPS : settings.maxFPS;
    }
    */
    
    start();
    
}
/*
import Sprite from './Entity/Sprite.js';
import Player from './Entity/Player.js'

window.onload = function() {
    const player1Health = document.getElementById('player1Health');
    const player2Health = document.getElementById('player2Health');

    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    let secondsPassed;
    let oldTimeStamp;
    let fps;

    const background = new Sprite({canvas, context}, {
        position: {x: 0, y: 0 },
        imageSrc: './assets/img/background.png'
    });

    const shop = new Sprite({canvas, context}, {
        position: {x: 600, y: 128 },
        imageSrc: './assets/img/shop.png',
        scale: 2.75,
        framesMax: 6
    });
    
    canvas.width = 1024;
    canvas.height = 576;

    context.fillRect(0, 0, canvas.width, canvas.height);

    var intervalCleared = false;

    let keys = {
        //player1 left
        "q": {
            pressed: false
        },
        //player1 right
        "d": {
            pressed: false
        },
        //player1 jump
        "z": {
            pressed: false
        },
        //player1 slash
        "x": {
            pressed: false
        },
        //player2 left
        "k": {
            pressed: false
        },
        //player2 right
        "m": {
            pressed: false
        },
        //player2 jump
        "o": {
            pressed: false
        },
        //player2 slash
        ":": {
            pressed: false
        }
    }

    function showFPS(timeStamp) {
        secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;

        // Calculate fps
        fps = Math.round(1 / secondsPassed);

        // Draw number to the screen
        
        context.font = '15px Arial';
        context.fillStyle = 'white';
        context.fillText("FPS: " + fps, 10, 30);
        
        //console.warn("FPS: " + fps);
    }

    const player1 = new Player({canvas, context}, keys, {
        position: {x: 50, y: 100},
        controls: {left: "q", right: "d"},
        scale: 2.5,
        offSet: {x: 215, y: 155},
        sprites: {
            idle: {
                imageSrc: './assets/img/samuraiMack/Idle.png',
                framesMax: 8,
            },
            run: {
                imageSrc: './assets/img/samuraiMack/Run.png',
                framesMax: 8,
            },
            jump: {
                imageSrc: './assets/img/samuraiMack/Jump.png',
                framesMax: 2,
            },
            fall: {
                imageSrc: './assets/img/samuraiMack/Fall.png',
                framesMax: 2,
            },
            attack1: {
                imageSrc: './assets/img/samuraiMack/Attack1.png',
                framesMax: 6,
            },
            takeHit: {
                imageSrc: './assets/img/samuraiMack/Take Hit - white silhouette.png',
                framesMax: 4
            },
            death: {
                imageSrc: './assets/img/samuraiMack/Death.png',
                framesMax: 6
            }
        }
    });

    const player2 = new Player({canvas, context}, keys, {
        position: {x: 850, y: 100},
        controls: {left: "k", right: "m"},
        scale: 2.5,
        offSet: { x: 215, y: 170 },
        mirrored: true,
        sprites: {
            idle: {
                imageSrc: './assets/img/Kenji/Idle.png',
                framesMax: 4,
            },
            run: {
                imageSrc: './assets/img/Kenji/Run.png',
                framesMax: 8,
            },
            jump: {
                imageSrc: './assets/img/Kenji/Jump.png',
                framesMax: 2,
            },
            fall: {
                imageSrc: './assets/img/Kenji/Fall.png',
                framesMax: 2,
            },
            attack1: {
                imageSrc: './assets/img/Kenji/Attack1.png',
                framesMax: 4,
            },
            takeHit: {
                imageSrc: './assets/img/kenji/Take hit.png',
                framesMax: 3
            },
            death: {
                imageSrc: './assets/img/kenji/Death.png',
                framesMax: 7
            }
        }
    });

    var players = [
        player1,
        player2
    ];

    //const key1 = new Key({ key: 'q', action: players[0].moveLeft, endAction: players[0].endMoveLeft });
    //const key2 = new Key({ key: 'd', action: players[0].moveRight, endAction: players[0].endMoveRight });
    //const key3 = new Key({ key: 'k', action: players[1].moveLeft, endAction: players[1].endMoveLeft });
    //const key4 = new Key({ key: 'm', action: players[1].moveRight, endAction: players[1].endMoveRight });
    //const keysTest = [
    //    key1,
    //    key2,
    //    key3,
    //    key4
    //];

    function gameloop(timeStamp) {        

        context.fillRect(0, 0, canvas.width, canvas.height);
        background.update();
        shop.update();

        //for(let p in players) {
        //    p.update();
        //}
        player1.update();
        player2.update();

        if (players[0].isHited && players[0].frameCurrent == players[0].framesMax - 1) {
            players[0].isHited = false;
        }
        
        if (players[0].isAttacking && players[0].frameCurrent == players[0].framesMax - 1) {
            players[0].isAttacking = false;
        } else if (
            players[0].isAttacking
            && players[0].frameCurrent > 3
            && rectangularCollision({entity1: players[0], entity2: players[1]})
            && !players[1].isHited
        ) {
            players[1].takeHit(10);
            player2Health.style.width = player2.health + "%";
            checkWin();
        }
        
        if (players[1].isHited && players[1].frameCurrent == players[1].framesMax - 1) {
            players[1].isHited = false;
        }

        if (players[1].isAttacking && players[1].frameCurrent == players[1].framesMax - 1) {
            players[1].isAttacking = false;
        } else if (
            players[1].isAttacking
            && players[1].frameCurrent == 2
            && rectangularCollision({entity1: players[1], entity2: players[0]})
            && !players[0].isHited
        ) {
            players[0].takeHit(10);
            player1Health.style.width = player1.health + "%";
            checkWin();
        }

        showFPS(timeStamp);
        window.requestAnimationFrame(gameloop);
    }

    window.requestAnimationFrame(gameloop);

    function checkWin() {
        if (fightTimer <= 0) {
            if (players[0].health < players[1].health) {
                alert('players2 win');
            } else if (players[1].health < players[0].health) {
                alert('players1 win');
            } else {
                alert('equality');
            }
            closeFight();
        } else {
            if (players[0].health <= 0) {
                if(players[1].health <= 0) {
                    alert('equality');
                } else {
                    alert('players2 win');
                }
                closeFight();
            } else if (players[1].health <= 0) {
                if(players[0].health <= 0) {
                    alert('equality');
                } else {
                    alert('players1 win');
                }
                closeFight();
            }
        }
        
    }

    function rectangularCollision({entity1, entity2}) {
        return (
            entity1.attackBox.position.x + entity1.attackBox.width >= entity2.position.x
            && entity1.attackBox.position.x <= entity2.position.x + entity2.width
            && entity1.attackBox.position.y + entity1.attackBox.height >= entity2.position.y
            && entity1.attackBox.position.y <= entity2.position.y + entity2.height
        );
    }

    function keyDownListener(event) {
        
        //for(let i = 0; i < keysTest.length; i++) {
        //    if (keysTest[i].key = event.key) {
        //        keysTest[i].action();
        //    }
        //}
        switch(event.key) {
            case 'q':
                keys["q"].pressed = true;
                players[0].lastDirection = 'q';
                break;
            case 'd':
                keys["d"].pressed = true;
                players[0].lastDirection = 'd';
                break;
            case 'z':
                keys["z"].pressed = true;
                players[0].jump();
                break;
            case 'x':
                keys["x"].pressed = true;
                player1.attack();
                break;

            case 'k':
                keys["k"].pressed = true;
                players[1].lastDirection = 'k';
                break;
            case 'm':
                keys["m"].pressed = true;
                players[1].lastDirection = 'm';
                break;
            case 'o':
                keys["o"].pressed = true;
                players[1].jump();
                break;
            case ':':
                keys[":"].pressed = true;
                player2.attack();
                break;
        }
    }

    function keyUpListener(event) {
        //for(let i = 0; i < keysTest.length; i++) {
        //    if (keysTest[i].key = event.key) {
        //        keysTest[i].endAction();
        //    }
        //}
        switch(event.key) {
            case 'q':
                keys["q"].pressed = false;
                players[0].lastDirection = 'd';
                break;
            case 'd':
                keys["d"].pressed = false;
                players[0].lastDirection = 'q';
                break;
            case 'z':
                keys["z"].pressed = false;
                players[0].velocity.y = 0;
                break;

            case 'k':
                keys["k"].pressed = false;
                players[1].lastDirection = 'm';
                break;
            case 'm':
                keys["m"].pressed = false;
                players[1].lastDirection = 'k';
                break;
            case 'o':
                keys["o"].pressed = false;
                players[1].velocity.y = 0;
                break;
        }
    }

    var startTimer = 3;
    var fightTimer = 60;

    function loop(time, loopFunction, endFunction) {
        let timer = setInterval(() => {
            if(intervalCleared) {
                intervalCleared = false;
                clearInterval(timer);
            }
            if(time > 0) {
                time--;
                loopFunction();
            } else {
                endFunction();
                clearInterval(timer);
            }
        }, 1000);
    }

    loop(startTimer, showFightBeginningTimer, startFight);

    function startFight() {
        window.addEventListener('keydown', keyDownListener);
        window.addEventListener('keyup', keyUpListener);

        loop(fightTimer, showFightTimer, checkWin);
    }

    function showFightBeginningTimer() {
        //animation of showing startTimer
        console.log(startTimer);
        startTimer--;
    }

    function showFightTimer() {
        //animation of showing fightTimer
        console.log(fightTimer);
        fightTimer--;
    }

    function closeFight() {
        window.removeEventListener('keydown', keyDownListener);
        window.removeEventListener('keyup', keyUpListener);
        intervalCleared = true;
    }

    function resetGame() { 
        startTimer = 3;
        fightTimer = 60;

        //position des players;

        loop(startTimer, showFightBeginningTimer, startFight);
    }
}
*/


