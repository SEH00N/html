let canvas;
let ctx;

canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 700;

document.body.appendChild(canvas);

const spaceShipSize = 64;
const bulletSize = 32;
const enemySize = 48;
const gameOverSize = 128;

let enemySpawnDelay = 1;
let score = 0;

let gameOver = false;

let bgImage;
let spaceShipImage;
let bulletImage;
let enemyImage;
let gameOverImage;

let spaceShipX = (canvas.width - spaceShipSize) / 2;
let spaceShipY = canvas.height - spaceShipSize - 20;

let bulletList = [];
let enemyList = [];

let keysDown = {};

loadAllImage();
setUpKeyboardListener();
createEnemy();
main();

function loadAllImage() {
    bgImage = loadImage('bg');
    spaceShipImage = loadImage('spaceship');
    bulletImage = loadImage('bullet');
    enemyImage = loadImage('enemy');
    gameOverImage = loadImage('gameover');
}

function loadImage(imgName) {
    image = new Image();
    image.src = `images/${imgName}.png`

    return image;
}

function setUpKeyboardListener() {
    document.addEventListener('keydown', e => {
        keysDown[e.key] = true;
    });

    document.addEventListener('keyup', e => {
        delete keysDown[e.key];

        if(e.key == ' ')
            createBullet();
    });
}

function createBullet() {
    let bullet = new Bullet();
    bullet.init();
}

function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    
    return randomNum;
}

function createEnemy() {
    const interval = setInterval(() => {
        let enemy = new Enemy();
        enemy.init();
    }, enemySpawnDelay * 1000);
}

function update() {
    if('ArrowRight' in keysDown) {
        if(spaceShipX < canvas.width - spaceShipImage.width)
            spaceShipX += 4;
    } 
    else if('ArrowLeft' in keysDown) {
        if(spaceShipX > 0)
            spaceShipX -= 4;
    }

    bulletList.forEach(bullet => {
        if(bullet.alive) {
            bullet.update();
            bullet.checkHit();
        }
    });

    enemyList.forEach(enemy => {
        enemy.update();
    });
}

function render() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceShipImage, spaceShipX, spaceShipY, spaceShipSize, spaceShipSize);
    ctx.fillText(`Score:${score}`, 20, 20);
    ctx.fillStyle = 'white';
    ctx.font = "20px Arial"

    bulletList.forEach(bullet => {
        if(bullet.alive)
            ctx.drawImage(bulletImage, bullet.x, bullet.y, bulletSize, bulletSize);
    });

    enemyList.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemySize, enemySize);
    });
}

function main() {
    if(!gameOver) {
        update();
        render();
    
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameOverImage, (canvas.width - gameOverSize) / 2, (canvas.height - gameOverSize) / 2, gameOverSize, gameOverSize);
    }
}

class Bullet {
    constructor() {
        this.x = 0;
        this.y = 0;

        this.alive = true;
    }

    init() {
        this.x = spaceShipX + (spaceShipSize - bulletSize) / 2;
        this.y = spaceShipY;

        bulletList.push(this);
    }

    update() {
        this.y -= 10;

        if(this.y < 0)
            this.alive = false;
    }

    checkHit() {
        enemyList.forEach((enemy, i) => {
            let isPassed = this.y <= enemy.y + enemySize / 2;
            let isMatchedL = this.x + bulletSize > enemy.x;
            let isMatchedR = this.x < enemy.x + enemySize;
            
            let isHitted = isPassed && isMatchedL && isMatchedR;
            
            if(isHitted) {
                score++;
                this.alive = false;

                enemyList.splice(i, 1);
            }
        });
    }
}

class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    init() {
        this.x = generateRandomValue(0, canvas.width - enemySize);
        this.y = 0;

        enemyList.push(this);
    }

    update() {
        if(this.y > canvas.height - 48)
        {
            gameOver = true;
            console.log('gameover');
        }
        
        this.y += 3;
    }
}