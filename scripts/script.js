// Game Variables
const gameRec = [];
const globalGameRec = [];
let state;
let animateId;

// Levels
let level = 1;
let hasLevel0Init = false;
let hasLevel1Init = false;
let hasLevel2Init = false;
let hasLevel3Init = false;
let hasLevel4Init = false;
let hasLevel5Init = false;
let hasLevel6Init = false;
let hasLevel7Init = false;
let hasLevel8Init = false;
let hasLevel9Init = false;

// Physics
const grv = 3;
let grvAcc = 5;

// Display
const canvas = document.querySelector(".screen");
const ctx = canvas.getContext("2d");
let roomTransitAlpha = 0;
let fadeOut = true;


// Main Game Load
window.onload = () => {
    const player = new Player(canvas.width - 100, canvas.height - 140, 64, 64, 3, 2, 10, -1);
    startGame();
    // Start
    function startGame() {
        state = "NORMAL";
        player.initialize();
        gameHandler();
    }
    // Handle Loops
    function gameHandler() {
        checkLevel();
        checkState();
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
                if (!hasLevel1Init) level1Init();
                break;
            case 2:
                if (!hasLevel2Init) level2Init();
                break;
            case 3:
                break;
            default:
                break;
        }
    }
    // LEVEL 0
    function level0Init() {
        moveAllForNextLevel();
        // Environment
        environmentTileArray.push(new Environment(0, 0, canvas.height - 64, canvas.width, canvas.height, "darkgreen", false)); // Bottom Floor
        environmentTileArray.push(new Environment(1, 0, 0, 64, canvas.height - 64, "brown", false)); // Left Wall
        environmentTileArray.push(new Environment(2, canvas.width - 256, canvas.height / 2 - 176, canvas.width - 256, 256, "brown", false)); // Right Wall
        environmentTileArray.push(new Environment(3, 256, canvas.height / 2 - 64, canvas.width - 512, 64, "green", false)); // Middle Floor
        
        // -- Elevator
        environmentTileArray.push(new Environment(4, 76 - 5, canvas.height - 128 - 5, 168 + 10, 64 + 10, "black", true)); // Elevator Piece 1
        environmentTileArray.push(new Environment(5, 76, canvas.height - 128, 168, 64, "orange", true)); // Elevator Piece 2
        
        // Enemies
        enemyArray.push(new Enemy(0, "Lzard", 1000, 600, 156, 128, 2, 2, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(1, "Lzard", 500, 600, 156, 128, 2, 2, 1, true, false, 100, 0, 1, 0));

        // Items
        itemArray.push(new Item(0, "HANGING", "key", canvas.width / 2, canvas.height / 2, 32, 64))
        itemArray.push(new Item(1, "CLOSED", "roomTransit", canvas.width - 148, canvas.height / 5 - 4, 64, 64))
        itemArray.push(new Item(2, "NONE", "roomTransit", player.x, player.y + 12, 64, 64))
        
        // -- Initialize all enemies
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].initialize();
        }
        for (let i = 0; i < itemArray.length; i++) {
            itemArray[i].initialize();
        }

        // Initialize Level
        hasLevel0Init = true;
    }
    // LEVEL 1
    function level1Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 140;
        player.facing = 1;
        
        // Environment
        environmentTileArray.push(new Environment(6, 0, canvas.height - 64, canvas.width, canvas.height, "darkgreen", false)); // Bottom Floor
        // Items
        itemArray.push(new Item(4, "FALLING", "key", 900, player.y + 48, 64, 32)); // Key
        itemArray.push(new Item(5, "CLOSED", "roomTransit", canvas.width - 78, player.y + 12, 64, 64)); // Level end
        // Prompts
        promptArray.push(new Prompt(`Use A to move left, D to move right.`, 100, 100, 430, 200, player.x, player.y, 64, 64));
        promptArray.push(new Prompt(`Press E to pick up the key (stand on it).`, 800, 100, 470, 200, 800, player.y, 128, 64));
        promptArray.push(new Prompt(`Press E next to the door to open it.`, 800, 100, 470, 200, canvas.width - 256, player.y, 128, 64));
        promptArray.push(new Prompt(`Press E again to advance to the next level.`, 800, 100, 470, 200, canvas.width - 78, player.y, 128, 64));


        // -- Initialize all enemies
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].initialize();
        }
        for (let i = 0; i < itemArray.length; i++) {
            itemArray[i].initialize();
        }

        hasLevel1Init = true;
    }
    // LEVEL 2
    function level2Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 140;
        player.facing = 1;
        // Environment
        environmentTileArray.push(new Environment(6, 0, canvas.height - 64, canvas.width, canvas.height, "darkgreen", false)); // Bottom Floor
        environmentTileArray.push(new Environment(7, canvas.width / 2 - 100 - 128, canvas.height - 128, 64, 64, "darkred", false)); // Jump Block
        environmentTileArray.push(new Environment(7, canvas.width / 2 - 37 - 128, canvas.height - 192, 64, 128, "darkred", false)); // Jump Block
        environmentTileArray.push(new Environment(7, canvas.width / 2 + 24 - 128, canvas.height - 256, 64, 192, "darkred", false)); // Jump Block
        // Items
        itemArray.push(new Item(3, "NONE", "roomTransit", player.x, player.y + 12, 64, 64)); // Player start
        itemArray.push(new Item(4, "FALLING", "key", 900, player.y + 48, 64, 32)); // Key
        itemArray.push(new Item(5, "CLOSED", "roomTransit", canvas.width - 78, player.y + 12, 64, 64)); // Level end
        // Prompts
        promptArray.push(new Prompt(`Press Spacebar to jump.`, 500, 100, 330, 200, 300, player.y, 64, 64));

        // -- Initialize all enemies
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].initialize();
        }
        for (let i = 0; i < itemArray.length; i++) {
            itemArray[i].initialize();
        }

        hasLevel2Init = true;
    }
    
    // Function to move all objects away and make space for next room
    function moveAllForNextLevel() {
        for (let i = 0; i < environmentTileArray.length; i++) {
            environmentTileArray[i].x = -5000;
        }
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].x = -5000;
        }
        for (let i = 0; i < itemArray.length; i++) {
            itemArray[i].x = -5000;
        }
        for (let i = 0; i < promptArray.length; i++) {
            promptArray[i].triggerX = -5000;
            promptArray[i].updateCollision();
        }
    }



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
            case "ROOMTRANSIT":
                animateId = requestAnimationFrame(roomTransit);
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
    // State Controls
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

    // STATE NORMAL
    function stateNormal() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();
        recordGame();
        gameHandler();
    }
    // STATE STOP
    function stateStop() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();
        gameHandler();
    }
    // STATE REWIND
    function stateRewind() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();
        rewindGame();
        gameHandler();
    }
    function roomTransit() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();

        // Draw Room Fade
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 0, 0, ${roomTransitAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
    
        // Fade and switch level
        if (fadeOut) {
            roomTransitAlpha += 0.01;
            if (roomTransitAlpha >= 1) {
                globalRecordGame();
                fadeOut = false;
                level++;
                checkLevel();
            }
        } else {
            roomTransitAlpha -= 0.01;
            if (roomTransitAlpha <= 0) {
                state = "NORMAL";
                fadeOut = true;
            }
        }
        checkState();
    }





    // RECORD
    function recordGame() {
        const environment = [];
        const enemies = [];
        const items = [];

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

        for (let i = 0; i < itemArray.length; i++) {
            items.push(
                {
                    id: `Item ${i}`,
                    x: itemArray[i].x,
                    y: itemArray[i].y,
                    width: itemArray[i].width,
                    height: itemArray[i].height,
                    moveX: itemArray[i].moveX,
                    moveY: itemArray[i].moveY,
                    itemState: itemArray[i].itemState,
                    anim: itemArray[i].img.src,
                }
            );
        }
        gameRec.push([level, environment, enemies, items]);
    }

    // REWIND
    function rewindGame() {
        const index = gameRec.length - 1;

        // Prevent rewinding to previous level
        if (gameRec[index][0] === level) {
                
            // Restore Environment
            for (let i = 0; i < environmentTileArray.length; i++) {
                environmentTileArray[i].x = gameRec[index][1][i].x;
                environmentTileArray[i].y = gameRec[index][1][i].y;
            }
            // Restore Enemies
            for (let i = 0; i < enemyArray.length; i++) {
                enemyArray[i].x = gameRec[index][2][i].x;
                enemyArray[i].y = gameRec[index][2][i].y;
                enemyArray[i].dirX = gameRec[index][2][i].dirX;
                enemyArray[i].dirY = gameRec[index][2][i].dirY;
                enemyArray[i].img.src = gameRec[index][2][i].anim;
                enemyArray[i].spriteCount = gameRec[index][2][i].spriteCount;
                enemyArray[i].alive = gameRec[index][2][i].alive;
            }
            // Restore Items
            for (let i = 0; i < itemArray.length; i++) {
                itemArray[i].x = gameRec[index][3][i].x;
                itemArray[i].y = gameRec[index][3][i].y;
                itemArray[i].width = gameRec[index][3][i].width;
                itemArray[i].height = gameRec[index][3][i].height;
                itemArray[i].moveX = gameRec[index][3][i].moveX;
                itemArray[i].moveY = gameRec[index][3][i].moveY;
                itemArray[i].itemState = gameRec[index][3][i].itemState;
                itemArray[i].img.src = gameRec[index][3][i].anim;
            }

            // Delete Last Frame
            if (gameRec.length > 1) {
                gameRec.pop();
            } else {
                state = "STOP";
            }
        } else {
            state = "STOP";
        }
    }
    // COPY LEVEL RECORD
    function globalRecordGame() {
        globalGameRec.push(gameRec);
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
            case "e": // Interact
                player.checkInteractableCollision(itemArray, 0, 0, 0, 0);
            break;
            case "f": // Shoot
                if (player.canShoot && !player.shoot && !player.arrowFlying) player.shoot = true;
            break;
            case "p": // DEBUG
                state = "ROOMTRANSIT";
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

    // Update Player
    function drawPlayer() {
        // Stop player if in room transit
        if (state !== "ROOMTRANSIT") {
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
            
            // Check for prompts
            player.checkInteractableCollision(promptArray, 0, 0, 0, 0)

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
            } else if (player.checkArrowCollision(itemArray)) {
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

    // Draw Items
    function drawItems() {
        for (let i = 0; i < itemArray.length; i++) {
            itemArray[i].updateCollision();
            if (state === "NORMAL") itemArray[i].move();
            if (state !== "PICKED") ctx.drawImage(itemArray[i].img, itemArray[i].x, itemArray[i].y, itemArray[i].width, itemArray[i].height);
        }
    }


    // Draw Background + Environment Tiles
    function drawBackgroundAndEnvironment() {
        ctx.beginPath();
        ctx.fillStyle = "rgb(0, 195, 255)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();

        // Move movable environment and re-draw
        for (let i = 0; i < environmentTileArray.length; i++) {
            // Move movable pieces only if in NORMAL
            if (environmentTileArray[i].moves && state === "NORMAL") {
                    environmentTileArray[i].movePiece(false, true, 1, -1);
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
};