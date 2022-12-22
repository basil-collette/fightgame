import Sprite from './Entity/Sprite.js';
import Player from './Entity/Player.js';
import Utils from './Utils.js';

//DOM ELEMENTS
let DOM;
//CONTEXT ELEMENTS
let context;
//FRAME OBJECTS
let cancelAnimationFrame;
let requestAnimationFrame;
let frameID;
//SETTIGS
let SETTINGS;
let keys;
//ENTITIES
let players;
let scenery;
//CONSTANTS
let startTimer = 3;
let fightTimer = 60;
//PROPERTIES
let timestep;
let currentFPS;
var lastFrameTimeMs;
let delta;
let framesThisSecond;
let lastFpsUpdate;
let running;
let started;
let intervalCleared;

/* PROGRAM FUNCTIONS **************************************************************************************************************************************** */

function setDomElements() {
    DOM = {
        fpsDisplay: document.getElementById('fpsDisplay'),
        canvas: document.querySelector('canvas'),
        player1Health: document.getElementById('player1Health'),
        player2Health: document.getElementById('player2Health')
    }
}

function initSettings() {
    SETTINGS = {
        maxFPS: 15,
        showFPS: true,
    }
}

function setSettings({ maxFPS, showFPS }) {
    SETTINGS.maxFPS = maxFPS;
    SETTINGS.showFPS = showFPS;
}

function setScenery() {
    scenery = [
        new Sprite('background', { canvas: DOM.canvas, context }, {
            position: {x: 0, y: 0 },
            imageSrc: './assets/img/background.png',
            framesMax: 1,
            framesCycle: 1
        }),
        new Sprite('shop', { canvas: DOM.canvas, context }, {
            position: {x: 600, y: 128 },
            imageSrc: './assets/img/shop.png',
            scale: 2.75,
            framesMax: 6,
            framesCycle: 2
        })
    ];
}

function setPlayers() {
    players = [
        new Player('player1', { canvas: DOM.canvas, context }, keys, {
            position: {x: 50, y: 100},
            controls: {left: "q", right: "d", jump: "z", attack: "x"},
            scale: 2.5,
            offSet: {x: 215, y: 155},
            sprites: {
                idle: {
                    imageSrc: './assets/img/samuraiMack/Idle.png',
                    framesMax: 8,
                    framesCycle: 1
                },
                run: {
                    imageSrc: './assets/img/samuraiMack/Run.png',
                    framesMax: 8,
                    framesCycle: 2
                },
                jump: {
                    imageSrc: './assets/img/samuraiMack/Jump.png',
                    framesMax: 2,
                    framesCycle: 1
                },
                fall: {
                    imageSrc: './assets/img/samuraiMack/Fall.png',
                    framesMax: 2,
                    framesCycle: 1
                },
                attack1: {
                    imageSrc: './assets/img/samuraiMack/Attack1.png',
                    framesMax: 6,
                    framesCycle: 1
                },
                takeHit: {
                    imageSrc: './assets/img/samuraiMack/Take Hit - white silhouette.png',
                    framesMax: 4,
                    framesCycle: 3
                },
                death: {
                    imageSrc: './assets/img/samuraiMack/Death.png',
                    framesMax: 6,
                    framesCycle: 1
                }
            }
        }),
        new Player('player2', { canvas: DOM.canvas, context }, keys, {
            position: {x: 924, y: 100},
            controls: {left: "k", right: "m", jump: "o", attack: ":"},
            scale: 2.5,
            offSet: { x: 215, y: 170 },
            mirrored: true,
            sprites: {
                idle: {
                    imageSrc: './assets/img/Kenji/Idle.png',
                    framesMax: 4,
                    framesCycle: 2
                },
                run: {
                    imageSrc: './assets/img/Kenji/Run.png',
                    framesMax: 8,
                    framesCycle: 2
                },
                jump: {
                    imageSrc: './assets/img/Kenji/Jump.png',
                    framesMax: 2,
                    framesCycle: 1
                },
                fall: {
                    imageSrc: './assets/img/Kenji/Fall.png',
                    framesMax: 2,
                    framesCycle: 1
                },
                attack1: {
                    imageSrc: './assets/img/Kenji/Attack1.png',
                    framesMax: 4,
                    framesCycle: 3
                },
                takeHit: {
                    imageSrc: './assets/img/kenji/Take hit.png',
                    framesMax: 3,
                    framesCycle: 1
                },
                death: {
                    imageSrc: './assets/img/kenji/Death.png',
                    framesMax: 7,
                    framesCycle: 1
                }
            }
        })
    ];
}

function setEntities() {
    setScenery();

    setPlayers();
}

function initKeys() {
        /*
    var keyMap = {
        68: 'right',
        65: 'left',
        87: 'up',
        83: 'down'
      }
      function keydown(event) {
        var key = keyMap[event.keyCode]
        state.pressedKeys[key] = true
      }
      */

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

    keys = {
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
}

/* set an action to a key */
function setKey(keyCode, action) {

}

function update() {
    scenery.forEach((sceneElement) => {
        sceneElement.update(currentFPS);
    });

    players.forEach((currentPlayer) => {
        currentPlayer.update(currentFPS);

        let currentEnemy = players.find(p => p != currentPlayer);

        if (currentPlayer.isHited && currentPlayer.frameCurrent == currentPlayer.framesMax - 1) {
            currentPlayer.isHited = false;
        }
        
        if (currentPlayer.isAttacking && currentPlayer.frameCurrent == currentPlayer.framesMax - 1) {
            currentPlayer.isAttacking = false;
        } else if (
            currentPlayer.isAttacking
            && currentPlayer.frameCurrent > 3
            && Utils.rectangularCollision({e1: currentPlayer.attackBox, e2: currentEnemy})
            && !currentEnemy.isHited
        ) {
            currentEnemy.takeHit(10);
            updateHealthBars();
            checkWin();
        }
    });
}

function draw(interp) {
    scenery.forEach((sceneElement) => {
        sceneElement.draw(interp);
    });

    players.forEach((currentPlayer) => {
        currentPlayer.draw(interp);
    });
}

function panic() {
    delta = 0; // discard the unsimulated time
    // ... snap the player to the authoritative state
}

function begin() { //before update
    scenery.forEach((sceneElement) => {
        sceneElement.begin();
    });

    players.forEach((currentPlayer) => {
        currentPlayer.begin();
    });
}

function end() { //after rendering
    scenery.forEach((sceneElement) => {
        sceneElement.end();
    });

    players.forEach((currentPlayer) => {
        currentPlayer.end();
    });
}

function updateHealthBars() {
    DOM.player1Health.style.width = players[0].health + "%";
    DOM.player2Health.style.width = players[1].health + "%";
}

function mainLoop(timestamp) {        
    // Throttle the frame rate. (return untill it's time to loop, depending on asked FPS)
    if (timestamp < lastFrameTimeMs + (1000 / SETTINGS.maxFPS)) {
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
        numUpdateSteps++;
        if (numUpdateSteps >= 240) {
            panic();
            break;
        }
    }

    draw(delta / timestep);

    if (SETTINGS.showFPS) {
        renderFPS(currentFPS);
    }

    if (timestamp > lastFpsUpdate + 1000) {
        currentFPS = framesThisSecond; //fps = 0.25 * framesThisSecond + 0.75 * fps; //quel intéret ?
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
        frameID = requestAnimationFrame(function(timestamp) {
            update(currentFPS);
            draw(1); // initial draw
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

function keyDownListener(event) {
    /*
    keys.forEach((currentKey) => {
        if (currentKey = event.key) {
            currentKey.downAction();
        }
    });
    */
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
            players[0].jump(currentFPS);
            break;
        case 'x':
            keys["x"].pressed = true;
            players[0].attack();
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
            players[1].jump(currentFPS);
            break;
        case ':':
            keys[":"].pressed = true;
            players[1].attack();
            break;

        case 'return':
            stop();
            break;
    }
}

function keyUpListener(event) {
    /*
    keys.forEach((currentKey) => {
        if (currentKey = event.key) {
            currentKey.upAction();
        }
    });
    */
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

    return timer;
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

function resetSettings() {
    SETTINGS = {
        maxFPS: 45,
        showFPS: false,
    }
}

/* UTILS ********************************************************************************************* */

/* Affiche sur un élément du DOM les fps actuel */
function renderFPS(timeStamp) {
    DOM.fpsDisplay.textContent = Math.round(currentFPS) + ' FPS';
}

function init() {

    initSettings();

    setDomElements();

    //setDomProperties();
    DOM.canvas.width = 1024;
    DOM.canvas.height = 576;

    context = DOM.canvas.getContext('2d');

    currentFPS = SETTINGS.maxFPS;
    timestep = 1000 / SETTINGS.maxFPS;

    frameID = 0;

    cancelAnimationFrame = (typeof cancelAnimationFrame === 'function') ? cancelAnimationFrame : clearTimeout;
    requestAnimationFrame = (typeof requestAnimationFrame === 'function') ? requestAnimationFrame : (function() {
        var lastTimestamp = Date.now(), now, timeout;

        return function(callback) {
            now = Date.now();
            timeout = Math.max(0, timestep - (now - lastTimestamp));
            lastTimestamp = now + timeout;
            return setTimeout(function() {
                callback(now + timeout);
            }, timeout);
        };
    })();

    lastFrameTimeMs = 0;
    delta = 0;
    framesThisSecond = 0;
    lastFpsUpdate = 0;
    running = false;
    started = false;
    intervalCleared = false;

    initKeys();

    setEntities();
    
    start();

}

window.onload = init();