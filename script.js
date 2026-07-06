let ballElement = document.getElementById('ball');
let leftbarElement = document.getElementById('left-bar');
let rightbarElement = document.getElementById('right-bar');
let scoreElement = document.getElementById('score');

let ballX = 400;
let ballY = 250;
let ballSpeedX = 5;
let ballSpeedY = 5;

let leftbarY = 200;
let rightbarY = 200;
let barSpeed = 15;

let leftScore = 0;
let rightScore = 0;

let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

let botSpeed = 12;
let botAccuracy = 0.8;

let currentAbility = 0;

let playerCanUseAbility = true;
let botCanUseAbility = true;

let powerupElement = document.getElementById('big-powerup');
let powerupX = 0;
let powerupY = 0;
let powerupActive = false;

let leftBarHeight = 100;
let rightBarHeight = 100;

let gravityActive = false;

let extraBalls = []

document.addEventListener('keydown', function(event) {
    if (event.key === 'w' || event.key === 'W') {wPressed = true;}
    if (event.key === 's' || event.key === 'S') {sPressed = true;}
    if (event.key === 'ArrowUp') {upPressed = true;}
    if (event.key === 'ArrowDown') {downPressed = true;}

    if (event.key === '1') {selectAbility(1); }
    if (event.key === '2') {selectAbility(2);}
    if (event.key === '3') {selectAbility(3);}
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'w' || event.key === 'W') {wPressed = false;}
    if (event.key === 's' || event.key === 'S') {sPressed = false;}
});

function movebar () {
    if (wPressed === true) {leftbarY = leftbarY - barSpeed;}
    if (sPressed === true) {leftbarY = leftbarY + barSpeed;}

    if (leftbarY < 10) {leftbarY = 10;}
    if (leftbarY > 490) {leftbarY = 490;}

    if (rightbarY < 10) {rightbarY = 10;}
    if (rightbarY > 490) {rightbarY = 490;}

    leftbarElement.style.top = leftbarY + 'px';
    rightbarElement.style.top = rightbarY + 'px';
}

function moveball() {

    if (gravityActive === true) {
        ballSpeedY = ballSpeedY + 0.3;
    }
    
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    if (ballY <= 0) {ballSpeedY = ballSpeedY * -1;}
    if (ballY >= 580) {ballSpeedY = ballSpeedY * -1;}

    let allPowerups = document.getElementsByClassName('powerup-img');

    for (let i = allPowerups.length - 1; i >= 0; i = i - 1) {
        let currentPowerup = allPowerups[i];

        let pX = parseInt(currentPowerup.style.left);
        let pY = parseInt(currentPowerup.style.top);

        if (ballX + 20 > pX && ballX < pX + 50) {
            if (ballY + 20 > pY && ballY < pY + 50) {

                if (currentPowerup.classList.contains('big-bar')) {
                    if (ballSpeedX > 0) {
                        activateBigbar('left');
                    } else {activateBigbar('right');

                    }
                }
                else if (currentPowerup.classList.contains('gravity-buff')) {
                    activateGravity();
                }

                else if (currentPowerup.classList.contains('multi-2')) {activateMultipler(2);}
                else if (currentPowerup.classList.contains('multi-3')) {activateMultipler(3);}
                else if (currentPowerup.classList.contains('multi-4')) {activateMultipler(4);}
                else if (currentPowerup.classList.contains('multi-5')) {activateMultipler(5);}

                currentPowerup.remove();
            }
        }
    }

    if (ballX <= 30 && ballX >= 10) {
        if (ballY + 20 >= leftbarY && ballY <= leftbarY + leftBarHeight) {
            if (currentAbility === 1) {
                ballSpeedX = Math.abs(ballSpeedX);
                ballSpeedY = -Math.abs(ballSpeedX);
                selectAbility(0);
                startPlayerCooldown();
            }
            else if (currentAbility === 2) {
                ballSpeedX = Math.abs(ballSpeedX);
                ballSpeedY = 0;
                selectAbility(0);
                startPlayerCooldown();
            }
            else if (currentAbility === 3) {
                ballSpeedX = Math.abs(ballSpeedX);
                ballSpeedY = Math.abs(ballSpeedX);
                selectAbility(0);
                startPlayerCooldown();
            }
            else {ballSpeedX = Math.abs(ballSpeedX);}

            Speedupball();
        }
    }

    if (ballX >= 1150 && ballX <= 1170) {
        if (ballY + 20 >= rightbarY && ballY <= rightbarY + rightBarHeight) {
            if (botCanUseAbility === true) {
                let botChoice = Math.floor(Math.random() * 3) + 1;

                if (botChoice === 1) {
                    ballSpeedX = -Math.abs(ballSpeedX);
                    ballSpeedY = -Math.abs(ballSpeedX);
                }
                else if (botChoice === 2) {
                    ballSpeedX = -Math.abs(ballSpeedX);
                    ballSpeedY = 0;
                }
                else if (botChoice === 3) {
                    ballSpeedX = -Math.abs(ballSpeedX);
                    ballSpeedY = Math.abs(ballSpeedX);
                }

                startBotCooldown();
            }
            else {ballSpeedX = -Math.abs(ballSpeedX);}

            Speedupball();
        }
    }

    if (ballX <= 0) {rightScore = rightScore + 1; resetball(); }
    if (ballX >= 1200) {leftScore = leftScore +1; resetball();}

    ballElement.style.left = ballX + 'px';
    ballElement.style.top = ballY + 'px';
    scoreElement.innerHTML = leftScore + " - " + rightScore;

    createTrail(ballX, ballY);

    for(let i = extraBalls.length - 1; i >= 0; i = i - 1) {
        let eb = extraBalls[i];

        if (gravityActive === true ) {eb.speedY = eb.speedY + 0.3;}

        eb.x = eb.x + eb.speedX;
        eb.y = eb.y + eb.speedY;

        createTrail(eb.x, eb.y);

        let allPowerups = document.getElementsByClassName('powerup-img');

        for (let j = allPowerups.length - 1; j >= 0; j = j - 1) {
            let currentPowerup = allPowerups[j];
            let pX = parseInt(currentPowerup.style.left);
            let pY = parseInt(currentPowerup.style.top);

            if (eb.x + 20 > pX && eb.x < pX + 50) {
                if (eb.y + 20 > pY && eb.y < pY + 50) {
                    if (currentPowerup.classList.contains('big-bar')) {
                        if (eb.speedX > 0) {activateBigbar('left');}
                        else {activateBigbar('right');}
                    }
                    else if (currentPowerup.classList.contains('gravity-buff')) {
                        activateGravity();
                    }
                    else if (currentPowerup.classList.contains('multi-2')) {activateMultipler(2);}
                    else if (currentPowerup.classList.contains('multi-3')) {activateMultipler(3);}
                    else if (currentPowerup.classList.contains('multi-4')) {activateMultipler(4);}
                    else if (currentPowerup.classList.contains('multi-5')) {activateMultipler(5);}

                    currentPowerup.remove();
                }
            }
        }

        if(eb.y <= 0) {eb.speedY = eb.speedY * -1;}
        if(eb.y >= 580) {eb.speedY = eb.speedY * -1;}

        if (eb.x <= 30 && eb.x >= 10 && eb.y + 20 >= leftbarY && eb.y <= leftbarY + leftBarHeight) {
            eb.speedX = Math.abs(eb.speedX);
        }

        if (eb.x >= 1150 && eb.x <= 1170 && eb.y + 20 >= rightbarY && eb.y <= rightbarY + rightBarHeight) {
            eb.speedX = -Math.abs(eb.speedX);
        }

        if (eb.x <= 0) {
            rightScore = rightScore + 1;
            eb.element.remove();
            extraBalls.splice(i,1);
        }
        else if (eb.x >= 1200) {
            leftScore = leftScore + 1;
            eb.element.remove();
            extraBalls.splice(i,1);
        }
        else {
            eb.element.style.left = eb.x + 'px';
            eb.element.style.top = eb.y + 'px';
        }
}
}

function resetball() {
    ballX = 600;
    ballY = 300;

    if (ballSpeedX > 0) {ballSpeedX = -5;}
    else {ballSpeedX = 5;}

    let newSpeedY = Math.floor(Math.random() * 5) + 2;

    if (Math.random() > 0.5) {newSpeedY = newSpeedY * -1};

    ballSpeedY = newSpeedY;
}

function rungame () {
    movebar();
    movebot();
    moveball();
}

function Speedupball () {
    if (ballSpeedX > 0) {ballSpeedX = ballSpeedX + 0.5;}
    if (ballSpeedX < 0) {ballSpeedX = ballSpeedX - 0.5;}

    if (ballSpeedY > 0) {ballSpeedY = ballSpeedY + 0.5;}
    if (ballSpeedY < 0) {ballSpeedY = ballSpeedY - 0.5;}

}

function movebot() {
    if (ballX > 800) {
        let rightbarCenter = rightbarY + (rightBarHeight / 2);
        let distanceToBall = Math.abs(rightbarCenter - ballY);

        if (distanceToBall > botSpeed) {
            if (Math.random() < botAccuracy) {
                if (rightbarCenter > ballY) {rightbarY = rightbarY - botSpeed;}
                if (rightbarCenter < ballY) {rightbarY = rightbarY + botSpeed;}
            }
        }
    }

    if (rightbarY < 10) {rightbarY = 10;}
    if (rightbarY > 590 - rightBarHeight) {rightbarY = 590 - rightBarHeight;}

    rightbarElement.style.top = rightbarY + 'px';
}

function selectAbility(number) {

    if (playerCanUseAbility === false) {return;}
    
    currentAbility = number;

    document.getElementById('hit-1').style.color = "white";
    document.getElementById('hit-2').style.color = "white";
    document.getElementById('hit-3').style.color = "white";

    if (number === 1) {document.getElementById('hit-1').style.color = "green"; }
    if (number === 2) {document.getElementById('hit-2').style.color = "green"; }
    if (number === 3) {document.getElementById("hit-3").style.color = "green"; }

}

function startPlayerCooldown () {
    playerCanUseAbility = false;
    let tracker = document.getElementById('cooldown-tracker');
    tracker.innerHTML = "WAIT...";
    tracker.classList.add('cooling-down');

    setTimeout(function() {
        playerCanUseAbility = true;
        tracker.innerHTML = "READY";
        tracker.classList.remove('cooling-down');
    }, 5000);
}

function startBotCooldown() {
    botCanUseAbility = false;

    setTimeout(function() {
        botCanUseAbility = true;
    }, 5000);
}

function spawnPowerup () {
    let newPowerup = document.createElement('img');

    let randomChance = Math.random();

    if(randomChance < 0.30) {
        newPowerup.src = 'big-powerup.png';
        newPowerup.className = 'powerup-img big-bar';
    } else if (randomChance < 0.70) {
        newPowerup.src = 'gravity-powerup.png';
        newPowerup.className = 'powerup-img gravity-buff';
    } else {let multiChance = Math.random();

        if (multiChance < 0.40) {
            newPowerup.src = '2-balls.png';
            newPowerup.className = 'powerup-img multi-2';
        }
        else if (multiChance < 0.70) {
            newPowerup.src = '3-balls.png';
            newPowerup.className = 'powerup-img multi-3';
        }
        else if (multiChance < 0.90) {
            newPowerup.src = '4-balls.png';
            newPowerup.className = 'powerup-img multi-4';
        }
        else {
            newPowerup.src = '5-balls.png';
            newPowerup.className = 'powerup-img multi-5';
        }
    }

    let randomX = Math.floor(Math.random() * 600) + 300;
    let randomY = Math.floor(Math.random() *450) + 50;

    newPowerup.style.left = randomX + 'px';
    newPowerup.style.top = randomY + 'px';

    document.getElementById('game').appendChild(newPowerup);
}

setInterval(spawnPowerup, 2000);

function activateBigbar (player) {
    if (player === 'left') {
        leftBarHeight = leftBarHeight + 100;
        leftbarElement.style.height = leftBarHeight + 'px';

        setTimeout(function() {
            leftBarHeight = leftBarHeight - 100;
            leftbarElement.style.height = leftBarHeight + 'px';
        }, 20000);
    } else {
        rightBarHeight = rightBarHeight + 100;
        rightbarElement.style.height = rightBarHeight + 'px';
        
        setTimeout(function() {
            rightBarHeight = rightBarHeight - 100;
            rightbarElement.style.height = rightBarHeight + 'px';
        }, 20000);
    }
}

function createTrail (currentX, currentY) {
    let trail = document.createElement('img');
    trail.src = 'ball.png';
    trail.className = 'ball-trail';

    trail.style.left = currentX + 'px';
    trail.style.top = currentY + 'px';

    document.getElementById('game').appendChild(trail)

    setTimeout(function() {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0.2)';
    }, 10);

    setTimeout(function() {
        trail.remove();
    }, 300);
}

function activateGravity () {
    gravityActive = true;

    setTimeout(function(){
        gravityActive = false;
    }, 10000);
}

function activateMultipler(amount) {
    for (let i = 0; i < amount - 1; i = i + 1) {

        let newBall = document.createElement('img');
        newBall.src = 'ball.png';
        newBall.className = 'extra-ball';

        newBall.style.left = ballX + 'px';
        newBall.style.top = ballY + 'px';
        document.getElementById('game').appendChild(newBall);

        extraBalls.push({
            element: newBall,
            x: ballX,
            y: ballY,
            speedX: ballSpeedX,
            speedY: ballSpeedY + (Math.random() * 6 - 3)
        });
    }
}


setInterval(rungame, 30);