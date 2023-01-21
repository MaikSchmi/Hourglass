// Game Variables
const gameRec = [];
let state;
let animateId;
let counterAnimateId;

// Physics
const grv = 1;
let grvAcc = 1;

// Display
const canvas = document.querySelector(".screen");
const ctx = canvas.getContext("2d");

// Player

let playerSpriteCount = 0;
let playerFacing = 1;

class Player {
    constructor(x, y, width, height, xSpeed, ySpeed, jumpSpeed) {
        // Pass in vars
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.jumpSpeed = jumpSpeed;

        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;

        // Other
        this.moveRight = false;
        this.moveLeft = false;
        this.jump = false;
        this.canJump = false;
        this.shoot = false;
        this.canShoot = true;

        // Arrow
        this.arrowImgDir = [];
        this.arrowFlying = false;
        this.arrowX = this.x + this.width / 2;
        this.arrowY = this.y + this.height / 2;
        this.arrowSpeed = 5;
        this.arrowDir = 1;

        // Images
        // -- Player Image
        this.img; 
        // -- Player Sprites
        this.animIdle = [];
        this.animIdleLeft = [];
        this.animWalk = [];
        this.animWalkLeft = [];
        this.animJump = [];
        this.animJumpLeft = [];
        this.animShoot = [];
        this.animShootLeft = [];
    }

    initialize() {
        // Load images
        this.img = new Image();
        // --- Idle
        for (let i = 0; i < 4; i++) {
            this.animIdle.push(`../img/Shel/shel_idle/shel_idle_00${i}.png`);
            this.animIdleLeft.push(`../img/Shel/shel_idle_left/shel_idle_00${i}.png`);
        }
        // --- Walk
        for (let i = 0; i < 12; i++) {
            if (i < 10) {
                this.animWalk.push(`../img/Shel/shel_walk/shel_walk_00${i}.png`);
                this.animWalkLeft.push(`../img/Shel/shel_walk_left/shel_walk_00${i}.png`);
            } else {
                this.animWalk.push(`../img/Shel/shel_walk/shel_walk_0${i}.png`);
                this.animWalkLeft.push(`../img/Shel/shel_walk_left/shel_walk_0${i}.png`);
            }
        }
        // --- Jump
        for (let i = 0; i < 12; i++) {
            if (i < 10) {
                this.animJump.push(`../img/Shel/shel_jump/shel_jump_00${i}.png`);
                this.animJumpLeft.push(`../img/Shel/shel_jump_left/shel_jump_00${i}.png`);
            } else {
                this.animJump.push(`../img/Shel/shel_jump/shel_jump_0${i}.png`);
                this.animJumpLeft.push(`../img/Shel/shel_jump_left/shel_jump_0${i}.png`);
            }
        }
        // --- Shoot
        for (let i = 0; i < 8; i++) {
            this.animShoot.push(`../img/Shel/shel_attackbow/shel_attackbow_00${i}.png`);
            this.animShootLeft.push(`../img/Shel/shel_attackbow_left/shel_attackbow_00${i}.png`);
        }
        // --- Arrow
        this.arrowImg = new Image();
        this.arrowImgDir.push("../img/Shel/arrow_left.png", "../img/Shel/arrow_right.png")
    }

    checkCollision() {
        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;

        for (let i = 0; i < environmentTileArray.length; i++) {
            if (this.left < environmentTileArray[i].right &&
                this.right > environmentTileArray[i].left &&
                this.top < environmentTileArray[i].bottom &&
                this.bottom > environmentTileArray[i].top) {
                    return true;
            }
        }
    }

    spawnArrow() {
        // Set arrow values
        this.arrowDir = playerFacing;

        if (this.arrowDir === -1) {
            this.arrowImg.src = this.arrowImgDir[0];
        } else if (this.arrowDir === 1) {
            this.arrowImg.src = this.arrowImgDir[1];
        }

        this.arrowX = this.x + 32 * this.arrowDir;
        this.arrowY = this.y + 32;
        this.arrowFlying = true;
    }
}

const environmentTileArray = [];
class Environment {
    constructor(x, y, width, height, color) {
        // Pass in vars
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
    }
}

// Movement
const xSpeed = 2;
const ySpeed = 2;
let xPos = 300;
let yPos = 300;
let xDir = 1;
let yDir = 1;

window.onload = () => {
    const player = new Player(100, 590, 100, 100, 5, 10, 25);
    startGame();

    function startGame() {
        state = "NORMAL";
        player.initialize();

        // Create environment
        const tileWidth = canvas.width;
        const tileHeight = canvas.height;
        const tileX = 0;
        const tileY = canvas.height - 64;            

        environmentTileArray.push(new Environment(tileX, tileY, tileWidth, tileHeight, "darkgreen"));

        checkState();
    }
    // CHANGE STATE
    document.addEventListener("keydown", e => {
        switch (e.key) {
            case "ArrowLeft":
                if (state === "NORMAL") {
                    state = "STOP";
                    checkState();
                } else if (state === "STOP") {
                    state = "REWIND";
                    checkState();
                }
                break;
            case "ArrowRight":
                if (state === "REWIND") {
                    state = "STOP"
                    checkState();
                } else if (state === "STOP") {
                    state = "NORMAL"
                    checkState();
                }
                break;
        }
    });
    // STATE MACHINE
    function checkState() {
        cancelAnimationFrame(animateId); // Cancel every frame and choose again to avoid speed leak
        switch (state) {
            case "NORMAL":
                animateId = requestAnimationFrame(stateNormal);
                break;
            case "STOP":
                animateId = requestAnimationFrame(stateStop);
                break;
            case "REWIND":
                animateId = requestAnimationFrame(stateRewind);
                break;
            default:
                break;
        }
    }     
    // STATE NORMAL
    function stateNormal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        
        xPos += xDir * xSpeed;
        yPos += yDir * ySpeed;

        drawObject();
        drawPlayer();
        drawArrow();
        
        recordState();
        checkState();
    }
    // STATE STOP
    function stateStop() {
        drawBackground();
        drawObject();
        drawPlayer();
        checkState();
    }
    // STATE REWIND
    function stateRewind() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();

        const lastFrame = gameRec[gameRec.length - 1];
        xPos = lastFrame.xPos;
        yPos = lastFrame.yPos;
        
        if (gameRec.length > 1) {
            gameRec.pop();
        } else {
            state = "STOP";
        }

        drawObject();
        drawPlayer();
        checkState();
    }
    // RECORD
    function recordState() {
        gameRec.push({xPos, yPos})
    }



    // Update Player
    function drawPlayer() {
        // PHYSICS
        // --- Gravity
        if (!player.checkCollision()) {
            player.canJump = false;
            player.y += grv + grvAcc;
            if (grvAcc < player.ySpeed) grvAcc += .25;
        } else {
            player.canJump = true;
            grvAcc = 1;
        }

        if (player.jump) {
            player.y -= player.jumpSpeed - grvAcc;

            setTimeout(() => {
                player.jump = false;
            }, 100);
        }

        if (player.shoot) {
            player.spawnArrow();
            setTimeout(() => {
                player.arrowFlying = true;
                player.shoot = false;
            }, 700);
        }

        // MOVEMENT
        // --- Move Left
        if (player.moveLeft && player.x > 0) {
            player.x -= player.xSpeed;
            animateSprite(player.img, player.animWalkLeft, player.x, player.y, player.width, player.height);
        // --- Move Right
        } else if (player.moveRight && player.x < canvas.width - player.width * 2) {
            player.x += player.xSpeed;
            animateSprite(player.img, player.animWalk, player.x, player.y, player.width, player.height);
        // --- Shoot / Idle
        } else {
            if (playerFacing === 1) {
                if (player.shoot) {
                    animateSprite(player.img, player.animShoot, player.x, player.y, player.width, player.height);
                } else {
                    animateSprite(player.img, player.animIdle, player.x, player.y, player.width, player.height);
                }
            } else if (playerFacing === -1) {
                if (player.shoot) {
                    animateSprite(player.img, player.animShootLeft, player.x, player.y, player.width, player.height);
                } else {
                    animateSprite(player.img, player.animIdleLeft, player.x, player.y, player.width, player.height);
                }
            }
        }
    }

    function drawArrow() {
        if (player.arrowFlying) {
            ctx.drawImage(player.arrowImg, player.arrowX, player.arrowY, 120, 60)
            player.arrowX += player.arrowSpeed * player.arrowDir;
        }
    }

    // Player Controls
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "d": // Left
                playerFacing = 1;
                player.moveRight = true;
            break;
            case "a": // Right
                playerFacing = -1;
                player.moveLeft = true;
            break;
            case " ": // Jump
                if (player.canJump) player.jump = true;
            break;
            case "f": // Shoot
                if (player.canShoot && !player.shoot && !player.arrowFlying) player.shoot = true;
            break;
        }
    });
    document.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "d":
                playerFacing = 1;
                player.moveRight = false;
            break;
            case "a":
                playerFacing = -1;
                player.moveLeft = false;
            break;
        }
    });

    // Animate Sprite Function
    function animateSprite(imgContainer, sprite, x, y, w, h) {
        if (playerSpriteCount > sprite.length - 2) {
            playerSpriteCount = 0;
        }
        if (animateId % 12 === 0) {
            playerSpriteCount++;  
            imgContainer.src = sprite[playerSpriteCount];         
        }
        ctx.drawImage(imgContainer, x, y, w, h); 
    }




    // Draw Background
    function drawBackground() {
        ctx.beginPath();
        ctx.fillStyle = "rgb(0, 195, 255)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
        
        // Floor Tiles
        for (let i = 0; i < environmentTileArray.length; i++) {
            ctx.fillStyle = environmentTileArray[i].color
            ctx.fillRect(environmentTileArray[i].x, environmentTileArray[i].y, environmentTileArray[i].width, environmentTileArray[i].height);
        }

    }
    // Draw Object
    function drawObject() {
        // Draw
        ctx.beginPath();
        ctx.fillStyle = "black"
        ctx.fillRect(xPos, yPos, 300, 300);
        ctx.closePath();

        // Collision / Movement

        if (xPos + 300 > canvas.width || xPos < 0) {
            xDir *= -1;
        }
        if (yPos + 300 > canvas.height || yPos < 0) {
            yDir *= -1; 
        }
    }
};

