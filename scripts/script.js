// Game Variables
const gameRec = [];
let state;
let animateId;
let counterAnimateId;
let globalCollision = "";

// Levels
let level = 0;
let hasLevel0Init = false;
let hasLevel1Init = false;
let hasLevel2Init = false;

// Physics
const grv = 3;
let grvAcc = 5;

// Display
const canvas = document.querySelector(".screen");
const ctx = canvas.getContext("2d");

// Player
let playerFacing;

class Player {
    constructor(x, y, width, height, xSpeed, ySpeed, jumpSpeed, facing) {
        // Pass in vars
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.jumpSpeed = jumpSpeed;
        this.facing = facing

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
        this.arrowX; // Defined in spawnArrow()
        this.arrowY; // Defined in spawnArrow()
        this.arrowWidth = 74;
        this.arrowHeight = 20;
        this.arrowSpeed = 5;
        this.arrowDir = 1;

        // Images
        // -- Player Image
        this.img; 
        this.spriteCount = 0;
        this.spriteSpeed = 12;
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

        playerFacing = this.facing;
    }

    checkCollision() {

        this.collArr = [
            {x: this.x, y: this.y}, // Top left
            {x: this.x + this.width / 2, y: this.y}, // Top center
            {x: this.x + this.width, y: this.y}, // Top right
            {x: this.x + this.width, y: this.y + this.height / 2}, // Center Right
            {x: this.x + this.width, y: this.y + this.height}, // Bottom Right
            {x: this.x + this.width / 2, y: this.y + this.height}, // Bottom Center
            {x: this.x, y: this.y + this.height}, // Bottom Left
            {x: this.x, y: this.y + this.height / 2}, // Center Left
        ];

        // Collision
        this.left = this.collArr[0].x;
        this.right = this.collArr[2].x
        this.top = this.collArr[0].y;
        this.bottom = this.collArr[6].y;
        for (let i = 0; i < environmentTileArray.length; i++) {
            if (this.left < environmentTileArray[i].right &&
                this.right > environmentTileArray[i].left &&
                this.top < environmentTileArray[i].bottom &&
                (this.bottom >= environmentTileArray[i].top || this.bottom > environmentTileArray[i].top + 1)) { 
                    if (this.bottom > environmentTileArray[i].top) {
                        this.y--;
                    }
                    return true;
                }
        }
    }

    checkEnemyCollision() {

        this.collArr = [
            {x: this.x, y: this.y}, // Top left
            {x: this.x + this.width / 2, y: this.y}, // Top center
            {x: this.x + this.width, y: this.y}, // Top right
            {x: this.x + this.width, y: this.y + this.height / 2}, // Center Right
            {x: this.x + this.width, y: this.y + this.height}, // Bottom Right
            {x: this.x + this.width / 2, y: this.y + this.height}, // Bottom Center
            {x: this.x, y: this.y + this.height}, // Bottom Left
            {x: this.x, y: this.y + this.height / 2}, // Center Left
        ];

        // Collision
        this.left = this.collArr[0].x;
        this.right = this.collArr[2].x
        this.top = this.collArr[0].y;
        this.bottom = this.collArr[6].y;
        for (let i = 0; i < enemyArray.length; i++) {
            if (this.left < enemyArray[i].right &&
                this.right > enemyArray[i].left &&
                this.top < enemyArray[i].bottom &&
                (this.bottom >= enemyArray[i].top || this.bottom > enemyArray[i].top + 1)) { 
                    return true;
                }
        }
    }

    checkArrowCollision() {
        // Collision Arrow
        this.arrowLeft = this.arrowX;
        this.arrowRight = this.arrowX + this.arrowWidth;
        this.arrowTop = this.arrowY;
        this.arrowBottom = this.arrowY + this.arrowHeight;
        for (let i = 0; i < environmentTileArray.length; i++) {
        // Arrow
            if (this.arrowLeft < environmentTileArray[i].right &&
                this.arrowRight > environmentTileArray[i].left &&
                this.arrowTop < environmentTileArray[i].bottom &&
                this.arrowBottom > environmentTileArray[i].top) {
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


// Enemies
const enemyArray = [];
class Enemy {
    constructor(name, x, y, width, height, xSpeed, ySpeed, facing, movesX, movesY) {
        // Main
        this.id = name;

        // Pass in vars
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.facing = facing;
        this.movesX = movesX;
        this.movesY = movesY;

        // Images
        // -- Enemy Image
        this.img;
        this.spriteCount = 0;
        // -- Lzard Enemy Sprites
        this.lzardSpriteSpeed = 2;
        this.lzardAnimIdle = [];
        this.lzardAnimIdleLeft = [];
        this.lzardAnimWalk = [];
        this.lzardAnimWalkLeft = [];
    }

    initialize() {
        // Load Images
        this.img = new Image();

        // --- Idle
        for (let i = 0; i < 62; i++) {
            if (i < 10) {
                this.lzardAnimIdleLeft.push(`../img/Lzard/lzard_idle_left/lzard_idle_00_00${i}.png`);
            } else {
                this.lzardAnimIdleLeft.push(`../img/Lzard/lzard_idle_left/lzard_idle_00_0${i}.png`);
            }
        }
        // --- Walking
        for (let i = 0; i < 60; i++) {
            if (i < 10) {
                this.lzardAnimWalkLeft.push(`../img/Lzard/lzard_idle_left/Lzard_Animation_Walking_00${i}.png`);
            } else {
                this.lzardAnimWalkLeft.push(`../img/Lzard/lzard_idle_left/Lzard_Animation_Walking_0${i}.png`);
            }
        }
    }

    updateCollision() {
        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;

        this.collArr = [
            {x: this.x, y: this.y}, // Top left
            {x: this.x + this.width / 2, y: this.y}, // Top center
            {x: this.x + this.width, y: this.y}, // Top right
            {x: this.x + this.width, y: this.y + this.height / 2}, // Center Right
            {x: this.x + this.width, y: this.y + this.height}, // Bottom Right
            {x: this.x + this.width / 2, y: this.y + this.height}, // Bottom Center
            {x: this.x, y: this.y + this.height}, // Bottom Left
            {x: this.x, y: this.y + this.height / 2}, // Center Left
        ];
    }

    
}

// Environment
const environmentTileArray = [];
class Environment {
    constructor(x, y, width, height, color, moves) {
        // Pass in vars
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.moves = moves;

        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;

        this.collArr = [
            {x: this.x, y: this.y}, // Top left
            {x: this.x + this.width / 2, y: this.y}, // Top center
            {x: this.x + this.width, y: this.y}, // Top right
            {x: this.x + this.width, y: this.y + this.height / 2}, // Center Right
            {x: this.x + this.width, y: this.y + this.height}, // Bottom Right
            {x: this.x + this.width / 2, y: this.y + this.height}, // Bottom Center
            {x: this.x, y: this.y + this.height}, // Bottom Left
            {x: this.x, y: this.y + this.height / 2}, // Center Left
        ];
    }

    movePiece(xPos, yPos) {
        this.y = yPos;
    }

    updateCollision() {
        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;

        this.collArr = [
            {x: this.x, y: this.y}, // Top left
            {x: this.x + this.width / 2, y: this.y}, // Top center
            {x: this.x + this.width, y: this.y}, // Top right
            {x: this.x + this.width, y: this.y + this.height / 2}, // Center Right
            {x: this.x + this.width, y: this.y + this.height}, // Bottom Right
            {x: this.x + this.width / 2, y: this.y + this.height}, // Bottom Center
            {x: this.x, y: this.y + this.height}, // Bottom Left
            {x: this.x, y: this.y + this.height / 2}, // Center Left
        ];
    }
}

// Movement
const xSpeed = 2;
const ySpeed = 2;
let xPos
let yPos
let xDir
let yDir

window.onload = () => {
    const player = new Player(canvas.width - 100, canvas.height - 140, 64, 64, 3, 2, 10, -1);
    startGame();

    function startGame() {
        state = "NORMAL";
        player.initialize();
        
        gameHandler();
    }

    function gameHandler() {
        drawBackground();
        checkLevel();
        drawPlayer();
        drawArrow();
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

        // Collision / Movement
        if (yPos > 100) {
            yPos--;
            recordState();
        }
        gameHandler();
    }
    // STATE STOP
    function stateStop() {
        gameHandler();
        
    }
    // STATE REWIND
    function stateRewind() {

        const lastFrame = gameRec[gameRec.length - 1];
        xPos = lastFrame.xPos;
        yPos = lastFrame.yPos;
        
        if (gameRec.length > 1) {
            gameRec.pop();
        } else {
            state = "STOP";
        }
        
        gameHandler();

    }
    // RECORD
    function recordState() {
        gameRec.push({xPos, yPos})
    }

    // LEVELS FRAMEWORK

    // --- Level switcher
    function checkLevel() {
        switch (level) {
            case 0:
                if (!hasLevel0Init) level0Init();
                level0();
                break;
            case 1:
                level1();
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                break;
        }
    }
    // LEVEL 0
    // --- Init
    function level0Init() {
        // Movement
        xPos = 76;
        yPos = canvas.height - 128;
        xDir = 1;
        yDir = 1;

        // Environment
        environmentTileArray.push(new Environment(0, canvas.height - 64, canvas.width, canvas.height, "darkgreen", false)); // Bottom Floor
        environmentTileArray.push(new Environment(0, 0, 64, canvas.height - 64, "brown", false)); // Left Wall
        environmentTileArray.push(new Environment(canvas.width - 64, canvas.height / 2 - 176, canvas.width - 256, 256, "brown", false)); // Right Wall
        environmentTileArray.push(new Environment(256, canvas.height / 2 - 64, canvas.width - 512, 64, "green", false)); // Middle Floor
        
        // Elevator
        environmentTileArray.push(new Environment(xPos - 5, yPos - 5, 168 + 10, 64 + 10, "black", true)); // Elevator Piece 1
        environmentTileArray.push(new Environment(xPos, yPos, 168, 64, "orange", true)); // Elevator Piece 2
        
        enemyArray.push(new Enemy("Lzard", 1000, 600, 128, 128, 2, 2, 1, false, false));

        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].initialize();
        }

        hasLevel0Init = true;
    }
    // --- Loop
    function level0() {
        // Move movable environment and re-draw
        for (let i = 0; i < environmentTileArray.length; i++) {
            if (environmentTileArray[i].moves) {
                if (i === 4) {
                    environmentTileArray[i].movePiece(xPos-5, yPos-5);
                } else {
                    environmentTileArray[i].movePiece(xPos, yPos);
                }
                environmentTileArray[i].updateCollision();
            }
            ctx.fillStyle = environmentTileArray[i].color;
            ctx.fillRect(environmentTileArray[i].x, environmentTileArray[i].y, environmentTileArray[i].width, environmentTileArray[i].height)
        }

        // Enemies
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].updateCollision();
            animateSprite(
                enemyArray[i], 
                enemyArray[i].img, 
                enemyArray[i].lzardAnimIdleLeft, 
                enemyArray[i].lzardSpriteSpeed,
                enemyArray[i].x, 
                enemyArray[i].y, 
                enemyArray[i].width, 
                enemyArray[i].height
            )
        }



    }

    // LEVEL 1
    // --- Init
    function level1Init() {

    }
    // --- Loop
    function level1() {

    }




    // Update Player
    function drawPlayer() {
        // PHYSICS
        // --- Gravity
        if (!player.checkCollision()) {
            player.canJump = false;
            if (grvAcc < player.ySpeed) grvAcc += .25;
            player.y += grv + grvAcc;
        } else {
            player.canJump = true;
            grvAcc = 1;
        }        

        player.checkEnemyCollision()

        if (player.jump) {
            if (grvAcc < player.ySpeed) grvAcc += .25;
            player.y -= player.jumpSpeed + grvAcc;

            setTimeout(() => {
                player.jump = false;
            }, 150);
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
        if (player.moveLeft && player.x > 0 && !player.checkEnemyCollision()) {
            player.x -= player.xSpeed;
            animateSprite(player, player.img, player.animWalkLeft, player.spriteSpeed, player.x, player.y, player.width, player.height);
        // --- Move Right
        } else if (player.moveRight && player.x < canvas.width - player.width) {
            player.x += player.xSpeed;
            animateSprite(player, player.img, player.animWalk, player.spriteSpeed, player.x, player.y, player.width, player.height);
        // --- Shoot / Idle
        } else {
            if (playerFacing === 1) {
                if (player.shoot) {
                    animateSprite(player, player.img, player.animShoot, player.spriteSpeed, player.x, player.y, player.width, player.height);
                } else {
                    animateSprite(player, player.img, player.animIdle, player.spriteSpeed, player.x, player.y, player.width, player.height);
                }
            } else if (playerFacing === -1) {
                if (player.shoot) {
                    animateSprite(player, player.img, player.animShootLeft, player.spriteSpeed, player.x, player.y, player.width, player.height);
                } else {
                    animateSprite(player, player.img, player.animIdleLeft, player.spriteSpeed, player.x, player.y, player.width, player.height);
                }
            }
        }
    }

    function drawArrow() {
        if (player.arrowFlying) {
            ctx.drawImage(player.arrowImg, player.arrowX, player.arrowY, player.arrowWidth, player.arrowHeight)
            if (!player.checkArrowCollision()) {
                player.arrowX += player.arrowSpeed * player.arrowDir;
            }
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
            case "p": // DEBUG
                const newEnemy = new Enemy("Lzard", 0, 0, 0, 0, 0, 0, 0, 0, 0);
                newEnemy.initialize();
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
    function animateSprite(obj, imgContainer, sprite, speed, x, y, w, h) {
        if (obj.spriteCount > sprite.length - 2) {
            obj.spriteCount = 0;
        }
        if (animateId % speed === 0) {
            obj.spriteCount++;  
            imgContainer.src = sprite[obj.spriteCount];      
        }
        ctx.drawImage(imgContainer, x, y, w, h); 
    }




    // Draw Background
    function drawBackground() {
        ctx.beginPath();
        ctx.fillStyle = "rgb(0, 195, 255)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
    }

    function drawElevator() {
        // Draw
        ctx.beginPath();
        ctx.fillStyle = "black"
        ctx.fillRect(xPos - 5, yPos - 5, 168 + 10, 64 + 10);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "orange"
        ctx.fillRect(xPos, yPos, 168, 64);
        ctx.closePath();
    }
        
};