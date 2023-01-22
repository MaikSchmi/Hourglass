// Game Variables
const gameRec = [];
let state;
let animateId;

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
    }

    updateCollision() {

        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
    }

    checkCollision(arr, ot, or, ob, ol) {
        for (let i = 0; i < arr.length; i++) {
            if (this.left - ol < arr[i].right &&
                this.right + or > arr[i].left &&
                this.top - ot < arr[i].bottom &&
                this.bottom + ob >= arr[i].top) { 
                    if (this.bottom > arr[i].top) {
                        this.y--;
                    }
                    return true;
                }
        }
    }

    checkArrowCollision(arr) {
        // Collision Arrow
        this.arrowLeft = this.arrowX;
        this.arrowRight = this.arrowX + this.arrowWidth;
        this.arrowTop = this.arrowY;
        this.arrowBottom = this.arrowY + this.arrowHeight;
        for (let i = 0; i < arr.length; i++) {
        // Arrow
            if (this.arrowLeft < arr[i].right &&
                this.arrowRight > arr[i].left &&
                this.arrowTop < arr[i].bottom &&
                this.arrowBottom > arr[i].top) {
                    arr[i].hit();
                    return true;
            }
        }
    }

    spawnArrow() {
        // Set arrow values
        this.arrowDir = this.facing;

        if (this.arrowDir === -1) {
            this.arrowImg.src = this.arrowImgDir[0];
        } else if (this.arrowDir === 1) {
            this.arrowImg.src = this.arrowImgDir[1];
        }

        this.arrowX = this.x + 32 * this.arrowDir;
        this.arrowY = this.y + 32;
    }

    destroyArrow() {
        this.arrowFlying = false;
    }

    die() {
        state = "DEAD";
    }
}

// Enemies
const enemyArray = [];
class Enemy {
    constructor(id, name, x, y, width, height, xSpeed, ySpeed, facing, movesX, movesY, distX, distY, dirX, dirY) {
        // Main
        this.id = id;
        this.alive = true;

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
        this.distX = distX;
        this.distY = distY;
        this.dirX = dirX;
        this.dirY = dirY;

        // Position
        this.startX = this.x;
        this.startY = this.y;
        this.speedX = 1;
        this.speedY = 1

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
                this.lzardAnimIdle.push(`../img/Lzard/lzard_idle_right/lzard_idle_00_00${i}.png`);
                this.lzardAnimIdleLeft.push(`../img/Lzard/lzard_idle_left/lzard_idle_00_00${i}.png`);
            } else {
                this.lzardAnimIdle.push(`../img/Lzard/lzard_idle_right/lzard_idle_00_0${i}.png`);
                this.lzardAnimIdleLeft.push(`../img/Lzard/lzard_idle_left/lzard_idle_00_0${i}.png`);
            }
        }
        // --- Walking
        for (let i = 0; i < 60; i++) {
            if (i < 10) {
                this.lzardAnimWalk.push(`../img/Lzard/lzard_walking_right/Lzard_Animation_Walking_00${i}.png`);
                this.lzardAnimWalkLeft.push(`../img/Lzard/lzard_walking_left/Lzard_Animation_Walking_00${i}.png`);
            } else {
                this.lzardAnimWalk.push(`../img/Lzard/lzard_walking_right/Lzard_Animation_Walking_0${i}.png`);
                this.lzardAnimWalkLeft.push(`../img/Lzard/lzard_walking_left/Lzard_Animation_Walking_0${i}.png`);
            }
        }

        this.img.src = "../img/Lzard/lzard.png"
    }

    updateCollision() {
        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
    }

    move() {
        // Horizontal movement
        if (this.movesX) {
            if (this.x > this.startX + this.distX) {
                this.dirX *= -1;
            }
            if (this.x < this.startX - this.distX) {
                this.dirX *= -1;
            }
            // Move
            this.x += this.speedX * this.dirX;
        }
        // Vertical movement
        if (this.movesY) {
            if (this.y > this.startY + this.distY) {
                this.dirY *= -1;
            }
            if (this.y < this.startY - this.distY) {
                this.dirY *= -1;
            }
            // Move
            this.y += this.speedY * this.dirY;
        }
    }

    hit() {
        for (let i = 0; i < enemyArray.length; i++) {
            if (enemyArray[i].getId() === this.getId()) {
                enemyArray[i].x = -5000;
                enemyArray[i].alive = false;
            }
        }
    }

    getId() {
        return this.id;
    }
}

// Environment
const environmentTileArray = [];
class Environment {
    constructor(id, x, y, width, height, color, moves) {
        this.id = id;
        // Pass in vars
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.moves = moves;

        // Position
        this.startX = this.x;
        this.startY = this.y;

        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
    }

    movePiece(movesX, movesY, speed, dir) {
        if (this.x > 0 && this.y > 0 && this.x + this.width < canvas.width && this.y + this.height < canvas.height) {
            // Horizontal movement
            if (movesX) {
                // Move
                this.x += speed * dir;
            }
            // Vertical movement
            if (movesY) {
                // Move
                this.y += speed * dir;
            }
        }
    }

    updateCollision() {
        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
    }

    hit() {}
}

// Movement

window.onload = () => {
    const player = new Player(canvas.width - 100, canvas.height - 140, 64, 64, 3, 2, 10, -1);
    startGame();

    function startGame() {
        state = "NORMAL";
        player.initialize();
        gameHandler();
    }

    function gameHandler() {
        checkLevel();
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
            case "DEAD":
                cancelAnimationFrame(animateId);
                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);
                ctx.fillStyle = "red";
                ctx.fillText("DEAD!", 200, 200, 1200);
                ctx.closePath();
                break;
            default:
                break;
        }
    }     
    // STATE NORMAL
    function stateNormal() {
        drawBackgroundAndEnvironment()
        drawPlayer();
        enableEnemies();
        recordGame();
        gameHandler();
    }

    // STATE STOP
    function stateStop() {
        drawBackgroundAndEnvironment()
        drawPlayer();
        enableEnemies();
        gameHandler();
        
    }
    // STATE REWIND
    function stateRewind() {
        drawBackgroundAndEnvironment()
        drawPlayer();
        enableEnemies();
        rewindGame();
        gameHandler();

    }
    // RECORD
    function recordGame() {
        let environment = [];
        let enemies = [];

        for (let i = 0; i < environmentTileArray.length; i++) {
            environment.push(
                {
                    id: `Environment ${i}`,
                    x: environmentTileArray[i].x,
                    y: environmentTileArray[i].y
                }
            );
        }

        for (let i = 0; i < enemyArray.length; i++) {
            enemies.push(
                {
                    id: `Enemy ${i}`, 
                    x: enemyArray[i].x, 
                    y: enemyArray[i].y,
                    dirX: enemyArray[i].dirX,
                    dirY: enemyArray[i].dirY,
                    facing: enemyArray[i].facing,
                    anim: enemyArray[i].img.src,
                    spriteCount: enemyArray[i].spriteCount,
                    alive: enemyArray[i].alive,
                }
            );
            
        }

        gameRec.push([environment, enemies]);
    }

    function rewindGame() {
        const index = gameRec.length - 1;
        
        // Restore Environment
        for (let i = 0; i < environmentTileArray.length; i++) {
            environmentTileArray[i].x = gameRec[index][0][i].x;
            environmentTileArray[i].y = gameRec[index][0][i].y;
        }
        // Restore Enemies
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].x = gameRec[index][1][i].x;
            enemyArray[i].y = gameRec[index][1][i].y;
            enemyArray[i].dirX = gameRec[index][1][i].dirX;
            enemyArray[i].dirY = gameRec[index][1][i].dirY;
            enemyArray[i].img.src = gameRec[index][1][i].anim;
            enemyArray[i].spriteCount = gameRec[index][1][i].spriteCount;
            enemyArray[i].alive = gameRec[index][1][i].alive;
        }
        // Delete Last Frame
        if (gameRec.length > 1) {
            gameRec.pop();
        } else {
            state = "STOP";
        }
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
        // Environment
        environmentTileArray.push(new Environment(0, 0, canvas.height - 64, canvas.width, canvas.height, "darkgreen", false)); // Bottom Floor
        environmentTileArray.push(new Environment(1, 0, 0, 64, canvas.height - 64, "brown", false)); // Left Wall
        environmentTileArray.push(new Environment(2, canvas.width - 64, canvas.height / 2 - 176, canvas.width - 256, 256, "brown", false)); // Right Wall
        environmentTileArray.push(new Environment(3, 256, canvas.height / 2 - 64, canvas.width - 512, 64, "green", false)); // Middle Floor
        
        // -- Elevator
        environmentTileArray.push(new Environment(4, 76 - 5, canvas.height - 128 - 5, 168 + 10, 64 + 10, "black", true)); // Elevator Piece 1
        environmentTileArray.push(new Environment(5, 76, canvas.height - 128, 168, 64, "orange", true)); // Elevator Piece 2
        
        // Enemies
        enemyArray.push(new Enemy(0, "Lzard", 1000, 600, 156, 128, 2, 2, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(1, "Lzard", 500, 600, 156, 128, 2, 2, 1, true, false, 100, 0, 1, 0));
        
        // -- Initialize all enemies
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].initialize();
        }

        // Initialize Level
        hasLevel0Init = true;
    }
    // --- Loop
    function level0() {

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
        player.updateCollision();
        // --- Ground contact, enable jump
        if (player.checkCollision(environmentTileArray, 0, 0, 1, 0)) {
            player.canJump = true;
            grvAcc = 1;
        } else {
            player.canJump = false;
            if (grvAcc < player.ySpeed) grvAcc += .25;
            player.y += grv + grvAcc;
        }        

        // --- Jump
        if (player.jump) {
            if (!player.checkCollision(environmentTileArray, 10, 0, -3, 0)){
                if (grvAcc < player.ySpeed) grvAcc += .25;
                player.y -= player.jumpSpeed + grvAcc;
            } else {
                player.jump = false;
            }
            setTimeout(() => {
                player.jump = false;
            }, 150);
        }

        // ENEMY
        if (player.checkCollision(enemyArray, 0, -16, 0, -32)) {
            player.die();
        }
        
        // Update Arrow Use
        enableArrow();

        // MOVEMENT
        // --- Move Left
        if (player.moveLeft && player.x > 0 && !player.checkCollision(environmentTileArray, 0, 0, -1, 5) && !player.shoot) {
            player.x -= player.xSpeed;
            animateSprite(player, player.img, player.animWalkLeft, player.spriteSpeed, player.x, player.y, player.width, player.height);
        // --- Move Right
        } else if (player.moveRight && player.x < canvas.width - player.width && !player.checkCollision(environmentTileArray, 0, 5, -1, 0) && !player.shoot) {
            player.x += player.xSpeed;
            animateSprite(player, player.img, player.animWalk, player.spriteSpeed, player.x, player.y, player.width, player.height);
        // --- Shoot / Idle
        } else {
            if (player.facing === 1) {
                if (player.shoot) {
                    animateSprite(player, player.img, player.animShoot, player.spriteSpeed, player.x, player.y, player.width, player.height);
                } else {
                    animateSprite(player, player.img, player.animIdle, player.spriteSpeed, player.x, player.y, player.width, player.height);
                }
            } else if (player.facing === -1) {
                if (player.shoot) {
                    animateSprite(player, player.img, player.animShootLeft, player.spriteSpeed, player.x, player.y, player.width, player.height);
                } else {
                    animateSprite(player, player.img, player.animIdleLeft, player.spriteSpeed, player.x, player.y, player.width, player.height);
                }
            }
        }
    }

    // Arrow
    function enableArrow() {
        // Shoot arrow
        if (player.shoot) {
            player.spawnArrow();
            drawArrow();
            setTimeout(() => {
                player.shoot = false;
                player.arrowFlying = true;
            }, 100);
        }
        // Arrow Interactions
        if (player.arrowFlying) {
            drawArrow();
            if (player.checkArrowCollision(environmentTileArray)) {
                player.destroyArrow();
            } else if (player.checkArrowCollision(enemyArray)) {
                player.destroyArrow();
            } else if (player.arrowX > canvas.width + player.arrowWidth || player.arrowY < 0) {
                player.destroyArrow();
            } else {
                player.arrowX += player.arrowSpeed * player.arrowDir;
            }
        }
    }
    function drawArrow() {
        ctx.drawImage(player.arrowImg, player.arrowX, player.arrowY, player.arrowWidth, player.arrowHeight);
    }

    // Enemy Control
    function enableEnemies() {
        for (let i = 0; i < enemyArray.length; i++) {
            const enemy = enemyArray[i].name;
            if (enemy === "Lzard") {
                // Collision update
                enemyArray[i].updateCollision();

                // Movement
                if (state === "NORMAL") enemyArray[i].move();
            
                // Animation
                let sprite = enemyArray[i].lzardAnimIdleLeft;
                if (enemyArray[i].movesX && enemyArray[i].dirX === -1) {
                    sprite = enemyArray[i].lzardAnimWalkLeft;
                } else if (enemyArray[i].movesX && enemyArray[i].dirX === 1) {
                    sprite = enemyArray[i].lzardAnimWalk;
                }
                animateSprite(
                    enemyArray[i], 
                    enemyArray[i].img, 
                    sprite,
                    enemyArray[i].lzardSpriteSpeed,
                    enemyArray[i].x, 
                    enemyArray[i].y, 
                    enemyArray[i].width, 
                    enemyArray[i].height
                )
                
            }
        }
    }

    // Player Controls
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "d": // Left
                player.facing = 1;
                player.moveRight = true;
            break;
            case "a": // Right
                player.facing = -1;
                player.moveLeft = true;
            break;
            case " ": // Jump
                if (player.canJump) player.jump = true;
            break;
            case "f": // Shoot
                if (player.canShoot && !player.shoot && !player.arrowFlying) player.shoot = true;
            break;
            case "p": // DEBUG
                console.log(gameRec[0]);
                console.log(gameRec[1]);
                console.log(gameRec[2]);
                console.log(gameRec[3]);
            break;
        }
    });
    document.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "d":
                player.facing = 1;
                player.moveRight = false;
            break;
            case "a":
                player.facing = -1;
                player.moveLeft = false;
            break;
        }
    });

    // Animate Sprite
    function animateSprite(obj, imgContainer, sprite, speed, x, y, w, h) {
        // Reset sprite count
        if (obj.spriteCount > sprite.length - 2) {
            obj.spriteCount = 0;
        }
        // Animate all in NORMAL
        if (state === "NORMAL") {
            if (animateId % speed === 0) {
                obj.spriteCount++;  
                imgContainer.src = sprite[obj.spriteCount];      
            }
        // Animate only Player in all except normal
        } else if (state !== "NORMAL" && obj === player) {
            if (animateId % speed === 0) {
                obj.spriteCount++;  
                imgContainer.src = sprite[obj.spriteCount];      
            }
        }
        // Draw
        ctx.drawImage(imgContainer, x, y, w, h); 
    }




    // Draw Background + Environment Tiles
    function drawBackgroundAndEnvironment() {
        ctx.beginPath();
        ctx.fillStyle = "rgb(0, 195, 255)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();

        // Move movable environment and re-draw
        for (let i = 0; i < environmentTileArray.length; i++) {
            const speedY = 2;
            // Move movable pieces only if in NORMAL
            if (environmentTileArray[i].moves && state === "NORMAL") {
                    environmentTileArray[i].movePiece(false, true, 1, -1)
            }
            // Draw
            ctx.fillStyle = environmentTileArray[i].color;
            ctx.fillRect(environmentTileArray[i].x, environmentTileArray[i].y, environmentTileArray[i].width, environmentTileArray[i].height)
        }
        // Update environment tile collision
        for (let i = 0; i < environmentTileArray.length; i++) {
            environmentTileArray[i].updateCollision();
        }
    }   
};