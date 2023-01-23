// Menu Controls
const btnStart = document.getElementById("btn-start");
const btnTimeTrial = document.getElementById("btn-time-trial");
const btnHighscores = document.getElementById("btn-highscores");
const btnCredits = document.getElementById("btn-credits");
const btnQuit = document.getElementById("btn-quit");
const btnRetry = document.getElementById("btn-retry");

// Display
const mainMenu = document.getElementById("title-screen-container");
const canvas = document.querySelector(".screen");
const ctx = canvas.getContext("2d");
let roomTransitAlpha = 1;
let fadeOut = false;
let bgColor = "rgb(0, 195, 255)"

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


// Main Game Load
window.onload = () => {
    canvas.style.visibility = "hidden";
    btnRetry.style.display = "none";
    // Menu Controls
    btnStart.addEventListener("click", e => {
        state = "ROOMTRANSIT";
        mainMenu.style.display = "none";
        canvas.style.visibility = "visible";
    });
    btnTimeTrial.addEventListener("click", e => {
        console.log("clicked")
    });
    btnHighscores.addEventListener("click", e => {
        console.log("clicked")
    });
    btnCredits.addEventListener("click", e => {
        console.log("clicked")
    });
    btnQuit.addEventListener("click", e => {
        alert("Just close the browser tab ...");
    });
    btnRetry.addEventListener("click", e => {
        state = "LEVELREWIND";
        level = 1;
        btnRetry.style.display = "none";
        checkState();
    });
    
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
            case 0: if (!hasLevel0Init) level0Init(); break;
            case 1: if (!hasLevel1Init) level1Init(); break;
            case 2: if (!hasLevel2Init) level2Init(); break;
            case 3: if (!hasLevel3Init) level3Init(); break;
            case 4: if (!hasLevel4Init) level4Init(); break;
            case 5: if (!hasLevel5Init) level5Init(); break;
            case 6: if (!hasLevel6Init) level6Init(); break;
            case 7: if (!hasLevel7Init) level7Init(); break;
            case 8: if (!hasLevel8Init) level8Init(); break;
            case 9: if (!hasLevel9Init) level9Init(); break;
            default: break;
        }
    }
    // LEVEL 0
    function level0Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 195, 255)"
        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, canvas.height, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, 0, 0, 64, canvas.height - 64, "brown", false)); // Left Wall
        environmentTileArray.push(new Environment(level, canvas.width - 256, canvas.height / 2 - 176, canvas.width - 256, 256, "brown", false, false, 0, 0, 0, 0, 0)); // Right Wall
        environmentTileArray.push(new Environment(level, 256, canvas.height / 2 - 64, canvas.width - 512, 64, "green", false, false, 0, 0, 0, 0, 0)); // Middle Floor
        
        // -- Elevator
        environmentTileArray.push(new Environment(level, 76 - 5, canvas.height - 128 - 15, 168 + 10, 64 + 10, "black", false, true, 0, 396, 0, -1, 1)); // Elevator Piece 1
        environmentTileArray.push(new Environment(level, 76, canvas.height - 128 - 10, 168, 64, "orange", false, true, 0, 396, 0, -1, 1)); // Elevator Piece 2
        
        // Enemies
        enemyArray.push(new Enemy(level, "Lzard", 1000, 600, 156, 128, 2, 2, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Lzard", 500, 600, 156, 128, 2, 2, 1, true, false, 100, 0, 1, 0));

        // Items
        itemArray.push(new Item(level, "HANGING", "key", canvas.width / 2, canvas.height / 2, 32, 64))
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 148, canvas.height / 5 - 4, 64, 64))
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y, 64, 64))
        
        // Initialize Objects
        initializeAll();
        hasLevel0Init = true;
    }
    // LEVEL 1
    function level1Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 128;
        player.facing = 1;
        
        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 64, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 16, "green", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        // Items
        itemArray.push(new Item(level, "FALLING", "key", 900, player.y + 36, 64, 32)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 78, player.y, 64, 64)); // Level end
        // Prompts
        promptArray.push(new Prompt(`Use A to move left, D to move right.`, 100, 100, 450, 100, player.x, player.y, 64, 64));
        promptArray.push(new Prompt(`Press E to pick up the key (stand on it).`, 800, 100, 470, 100, 800, player.y, 128, 64));
        promptArray.push(new Prompt(`Press E next to the door to open it.`, 800, 100, 460, 100, canvas.width - 256, player.y, 128, 64));
        promptArray.push(new Prompt(`Press E again to advance to the next level.`, 800, 100, 520, 100, canvas.width - 78, player.y, 128, 64));


        // Initialize Objects
        initializeAll();
        hasLevel1Init = true;
    }
    // LEVEL 2
    function level2Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 128;
        player.facing = 1;
        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 64, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 16, "green", false, false, 0, 0, 0, 0, 0)); // Bottom Floor

        environmentTileArray.push(new Environment(level, canvas.width / 2 - 100 - 128, canvas.height - 128, 64, 64, "darkred", false, false, 0, 0, 0, 0, 0)); // Jump Block
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 37 - 128, canvas.height - 192, 64, 128, "darkred", false, false, 0, 0, 0, 0, 0)); // Jump Block
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 24 - 128, canvas.height - 256, 64, 192, "darkred", false, false, 0, 0, 0, 0, 0)); // Jump Block
        // Items
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y, 64, 64)); // Player start
        itemArray.push(new Item(level, "FALLING", "key", 900, player.y + 36, 64, 32)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 78, player.y, 64, 64)); // Level end
        // Prompts
        promptArray.push(new Prompt(`Press Spacebar to jump.`, 500, 100, 330, 100, 300, player.y, 64, 64));
        promptArray.push(new Prompt(`Remember: Pick up the key and use it with E !`, 800, 100, 550, 100, 800, player.y, 128, 64));

        // Initialize Objects
        initializeAll();
        hasLevel2Init = true;
    }

    // LEVEL 3
    function level3Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 128;
        player.facing = 1;

        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 64, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 16, "green", false, false, 0, 0, 0, 0, 0)); // Bottom Floor

        environmentTileArray.push(new Environment(level, canvas.width / 2 + 140, 0, canvas.width / 2 - 140, canvas.height / 2 + 80, "green", false, false, 0, 0, 0, 0, 0)); // Ceiling
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 150, 0, canvas.width / 2 - 140, canvas.height / 2 + 70, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Ceiling
        
        // Enemies
        enemyArray.push(new Enemy(level, "Lzard", 750, 600, 156, 128, 2, 2, 1, false, false, 0, 0, 0, 0));

        // Items
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y, 64, 64)); // Player start
        itemArray.push(new Item(level, "FALLING", "key", 900, player.y + 36, 64, 32)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 78, player.y, 64, 64)); // Level end
        
        // Prompts
        promptArray.push(new Prompt(`Watch out! A dangerous Lizard!`, 250, 250, 400, 100, 100, player.y, 256, 64));
        promptArray.push(new Prompt(`Press F to shoot!`, 700, 250, 250, 100, 460, player.y, 256, 64));

        // Initialize Objects
        initializeAll();
        hasLevel3Init = true;
    }

    // LEVEL 4
    function level4Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 128;
        player.facing = 1;

        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width / 2, 64, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width / 2, 16, "green", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 1, canvas.height - 128, canvas.width / 2, 128, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 1, canvas.height - 128, canvas.width / 2, 16, "green", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 64 - 1, canvas.height - 240, canvas.width / 2, 128, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 64 - 1, canvas.height - 240, canvas.width / 2, 16, "green", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width / 2 - 140, canvas.height / 2 + 80, "green", false, false, 0, 0, 0, 0, 0)); // Ceiling
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width / 2 - 150, canvas.height / 2 + 70, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Ceiling
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 150, 0, canvas.width, 138, "green", false, false, 0, 0, 0, 0, 0)); // Ceiling
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width, 128, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Ceiling
        
        environmentTileArray.push(new Environment(level, canvas.width - 128, 0, 128, 138, "orange", false, false, 0, 0, 0, 0, 0)); // Right Wall
        environmentTileArray.push(new Environment(level, canvas.width - 128, 0, 128, 128, "brown", false, false, 0, 0, 0, 0, 0)); // Right Wall
        environmentTileArray.push(new Environment(level, canvas.width - 128, 540, 128, 128, "orange", false, false, 0, 0, 0, 0, 0)); // Right Wall
        environmentTileArray.push(new Environment(level, canvas.width - 128, 556, 128, 230, "brown", false, false, 0, 0, 0, 0, 0)); // Right Wall
        // Enemies
        enemyArray.push(new Enemy(level, "Lzard", 800, 425, 156, 128, 2, 2, 1, true, false, 100, 0, 1, 0));

        // Items
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y, 64, 64)); // Player start
        itemArray.push(new Item(level, "HANGING", "key", 400, player.y - 158, 32, 64)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 96, player.y - 152, 64, 64)); // Level end
        
        // Prompts
        promptArray.push(new Prompt(`You may have to get creative to reach this key ...`, 400, 250, 560, 100, 300, player.y, 256, 64));

        // Initialize Objects
        initializeAll();
        hasLevel4Init = true;
    }

    // LEVEL 5
    function level5Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 135, 255)"

        // Move Player
        player.x = 10;
        player.y = canvas.height - 128;
        player.facing = 1;
        
        // Environment
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width / 1.5, canvas.height / 2, "orange", false, false, 0, 0, 0, 0, 0)); // Ceiling
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width / 1.5 - 10, canvas.height / 2 - 10, "brown", false, false, 0, 0, 0, 0, 0)); // Ceiling
        environmentTileArray.push(new Environment(level, canvas.width / 1.5 - 10, 0, canvas.width, 96, "orange", false, false, 0, 0, 0, 0, 0)); // Ceiling Right
        environmentTileArray.push(new Environment(level, canvas.width / 1.5 - 10, 0, canvas.width, 86, "brown", false, false, 0, 0, 0, 0, 0)); // Ceiling Right
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 128, "orange", false, false, 0, 0, 0, 0, 0)); // Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 54, canvas.width, 230, "brown", false, false, 0, 0, 0, 0, 0)); // Floor 
        environmentTileArray.push(new Environment(level, canvas.width - 206, 256, canvas.width, 465, "orange", false, false, 0, 0, 0, 0, 0)); // Right Wall
        environmentTileArray.push(new Environment(level, canvas.width - 196, 266, canvas.width, 480, "brown", false, false, 0, 0, 0, 0, 0)); // Right Wall

        environmentTileArray.push(new Environment(level, canvas.width / 2 + 260, canvas.height - 128, 168, 64, "orange", false, true, 0, 396, 0, -1, 1)); // Elevator Piece
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 270, canvas.height - 118, 148, 44, "brown", false, true, 0, 396, 0, -1, 1)); // Elevator Piece

        // Items
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y, 64, 64)); // Player start
        itemArray.push(new Item(level, "HANGING", "key", canvas.width / 2 + 324, 96, 32, 64)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 96, 192, 64, 64)); // Level end
        
        // Prompts
        promptArray.push(new Prompt(`Hurry! The lift is leaving without you!`, 400, 250, 460, 100, player.x, player.y, 256, 64));
        promptArray.push(new Prompt(`Don't worry, hit the Arrow Left key to Stop time and again to Rewind time.`, 400, 250, 800, 100, canvas.width / 2, player.y, 192, 64));
        promptArray.push(new Prompt(`Now hit the Arrow Right key to Resume time as normal again.`, 400, 250, 700, 100, canvas.width / 2 + 64, player.y - 64, 256, 64));

        // Initialize Objects
        initializeAll();
        hasLevel5Init = true;
    }

    // LEVEL 6
    function level6Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 128;
        player.facing = 1;
        
        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 128, "orange", false, false, 0, 0, 0, 0, 0)); // Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 54, canvas.width, 230, "brown", false, false, 0, 0, 0, 0, 0)); // Floor 
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 256, canvas.height / 1.5 - 10, 512, 128, "orange", false, false, 0, 0, 0, 0, 0)); // Middle Block Bottom
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 256, canvas.height / 1.5, 512, 230, "brown", false, false, 0, 0, 0, 0, 0)); // Middle Block Bottom 
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 256, canvas.height / 4 - 10, 512, 220, "orange", false, false, 0, 0, 0, 0, 0)); // Middle Block Top
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 246, canvas.height / 4, 492, 200, "brown", false, false, 0, 0, 0, 0, 0)); // Middle Block Top
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width / 6, 512, "orange", false, false, 0, 0, 0, 0, 0)); // Wall Left
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width / 6 - 10, 502, "brown", false, false, 0, 0, 0, 0, 0)); // Wall Left
        environmentTileArray.push(new Environment(level, canvas.width - 224, 0, 224, 512, "orange", false, false, 0, 0, 0, 0, 0)); // Wall Right
        environmentTileArray.push(new Environment(level, canvas.width - 214, 0, 224, 502, "brown", false, false, 0, 0, 0, 0, 0)); // Wall Right
        environmentTileArray.push(new Environment(level, 220, 0, canvas.width - 440, 64, "orange", false, false, 0, 0, 0, 0, 0)); // Ceiling
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width, 54, "brown", false, false, 0, 0, 0, 0, 0)); // Ceiling
        environmentTileArray.push(new Environment(level, 235, canvas.height - 128, 168, 64, "orange", false, true, 0, 396, 0, -1, 1)); // Elevator 1 Piece
        environmentTileArray.push(new Environment(level, 245, canvas.height - 118, 148, 44, "brown", false, true, 0, 396, 0, -1, 1)); // Elevator 1 Piece
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 267, 116, 168, 64, "orange", false, true, 0, 396, 0, 1, 1)); // Elevator 2 Piece
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 277, 126, 148, 44, "brown", false, true, 0, 396, 0, 1, 1)); // Elevator 2 Piece
        
        // Items
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y, 64, 64)); // Player start
        itemArray.push(new Item(level, "HANGING", "key", canvas.width / 2, 64, 32, 64)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 96, player.y, 64, 64)); // Level end

        // Initialize Objects
        initializeAll();
        hasLevel6Init = true;
    }

    // LEVEL 7
    function level7Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 140;
        player.facing = 1;
        
        // Items
        itemArray.push(new Item(3, "NONE", "roomTransit", player.x, player.y + 12, 64, 64)); // Player start

        // Initialize Objects
        initializeAll();
        hasLevel7Init = true;
    }

    // LEVEL 8
    function level8Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 140;
        player.facing = 1;

        // Items
        itemArray.push(new Item(3, "NONE", "roomTransit", player.x, player.y + 12, 64, 64)); // Player start

        // Initialize Objects
        initializeAll();
        hasLevel8Init = true;
    }

    // LEVEL 9
    function level9Init() {
        moveAllForNextLevel();
        // Move Player
        player.x = 10;
        player.y = canvas.height - 140;
        player.facing = 1;
        
        // Items
        itemArray.push(new Item(3, "NONE", "roomTransit", player.x, player.y + 12, 64, 64)); // Player start

        // Initialize Objects
        initializeAll();
        hasLevel9Init = true;
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

    // Level Object Initialization
    function initializeAll() {
        // -- Initialize all enemies
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i].initialize();
        }
        for (let i = 0; i < itemArray.length; i++) {
            itemArray[i].initialize();
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
            case "LEVELREWIND":
                animateId = requestAnimationFrame(levelRewind);
                break;
            case "FULLREWIND":
                animateId = requestAnimationFrame(fullRewind);
                break;
            case "ROOMTRANSIT":
                animateId = requestAnimationFrame(roomTransit);
                break;
            case "DEAD":
                btnRetry.style.display = "block";
                cancelAnimationFrame(animateId);
                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);
                ctx.font = ctx.font.replace(/\d+px/, "40px");
                ctx.fillStyle = "red";
                ctx.fillText("YOU ARE DEAD!", canvas.width / 2 - 200, canvas.height / 2 - 50, 1200);
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
    function levelRewind() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();
        rewindGame();
        gameHandler();
    }
    function fullRewind() {
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
        const playerStats = [];
        const environment = [];
        const enemies = [];
        const items = [];

        playerStats.push(
            {
                x: player.x,
                y: player.y,
                hasKey: player.hasKey,
                anim: player.img.src,
                spriteCount: player.spriteCount,
            }
        );

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
        gameRec.push([level, playerStats, environment, enemies, items]);
    }

    // REWIND
    function rewindGame() {
        let rewindSpeeder;
        if (state === "REWIND") {
            rewindSpeeder = 1;
        } else if (state === "LEVELREWIND") {
            rewindSpeeder = 5;
        } else if (state === "FULLREWIND") {
            rewindSpeeder = 5;
        }
        let index = gameRec.length - rewindSpeeder;
        if (index <= 0) index = 0;
        // Prevent rewinding to previous level
        if (gameRec[index][0] === level && (state === "REWIND" || state === "LEVELREWIND")) {    
            restoreFromGameRec(rewindSpeeder);

            // Delete Last Frame
            gameRec.splice(index, rewindSpeeder);
            if (index === 0) state = "NORMAL";
            
        } else if (state === "FULLREWIND") {
            restoreFromGameRec(rewindSpeeder);
            gameRec.splice(index, rewindSpeeder);
            if (index === 0) state = "NORMAL";
        } else {
            state = "NORMAL";
        }
    }
    
    // COPY LEVEL RECORD
    function globalRecordGame() {
        globalGameRec.push(gameRec);
    }

    function restoreFromGameRec(rewindSpeeder) {
        let index = gameRec.length - rewindSpeeder;

        if (index <= 0) index = 0;
        // Restore Player (Only some values for regular Rewind)
        player.hasKey = gameRec[index][1][0].hasKey;

        if (state === "LEVELREWIND" || state === "FULLREWIND") {
            player.x = gameRec[index][1][0].x;
            player.y = gameRec[index][1][0].y;
            player.img.src = gameRec[index][1][0].anim;
            player.spriteCount = gameRec[index][1][0].spriteCount;
        }

        // Restore Environment
        for (let i = 0; i < environmentTileArray.length; i++) {
            if (state === "FULLREWIND" && environmentTileArray[i].id > gameRec[index][0]) {
                environmentTileArray.splice(i, 1);
                continue;
            }
            environmentTileArray[i].x = gameRec[index][2][i].x;
            environmentTileArray[i].y = gameRec[index][2][i].y;
        }
        // Restore Enemies
        for (let i = 0; i < enemyArray.length; i++) {
            if (state === "FULLREWIND" && enemyArray[i].id > gameRec[index][0]) {
                enemyArray.splice(i, 1);
                continue;
            }
            console.log(enemyArray[i].id, gameRec[index][0])
            enemyArray[i].x = gameRec[index][3][i].x;
            enemyArray[i].y = gameRec[index][3][i].y;
            enemyArray[i].dirX = gameRec[index][3][i].dirX;
            enemyArray[i].dirY = gameRec[index][3][i].dirY;
            enemyArray[i].img.src = gameRec[index][3][i].anim;
            enemyArray[i].spriteCount = gameRec[index][3][i].spriteCount;
            enemyArray[i].alive = gameRec[index][3][i].alive;
        }
        // Restore Items
        for (let i = 0; i < itemArray.length; i++) {
            if (state === "FULLREWIND" && itemArray[i].id > gameRec[index][0]) {
                itemArray.splice(i, 1);
                continue;
            }
            itemArray[i].x = gameRec[index][4][i].x;
            itemArray[i].y = gameRec[index][4][i].y;
            itemArray[i].width = gameRec[index][4][i].width;
            itemArray[i].height = gameRec[index][4][i].height;
            itemArray[i].moveX = gameRec[index][4][i].moveX;
            itemArray[i].moveY = gameRec[index][4][i].moveY;
            itemArray[i].itemState = gameRec[index][4][i].itemState;
            itemArray[i].img.src = gameRec[index][4][i].anim;
        }
    }


    

    // Player Controls
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "d": // Left
            case "ArrowRight":
                player.facing = 1;
                player.moveRight = true;
            break;
            case "a": // Right
            case "ArrowLeft":
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
                console.log(gameRec);
            break;
        }
    });
    document.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "d":
            case "ArrowRight":
                player.facing = 1;
                player.moveRight = false;
            break;
            case "a":
            case "ArrowLeft":
                player.facing = -1;
                player.moveLeft = false;
            break;
        }
    });

    function blockPlayerStates() {
        return (state === "ROOMTRANSIT" || state === "LEVELREWIND" || state === "FULLREWIND");
    }
    // Update Player
    function drawPlayer() {
        // PHYSICS
        player.updateCollision();
        // --- Ground contact, enable jump
        if (!blockPlayerStates()) {
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
                if (!player.checkCollision(environmentTileArray, 10, 0, -3, 0)) {
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

        }
        // Update Arrow Use
        enableArrow();

        // MOVEMENT
        // --- Move Left
        if (player.moveLeft && player.x > 0 && !player.checkCollision(environmentTileArray, 0, 0, -1, 5) && !player.shoot) {
            if (!blockPlayerStates()) player.x -= player.xSpeed;
            animateSprite(player, player.img, player.animWalkLeft, player.spriteSpeed, player.x, player.y, player.width, player.height);
        // --- Move Right
        } else if (player.moveRight && player.x < canvas.width - player.width && !player.checkCollision(environmentTileArray, 0, 5, -1, 0) && !player.shoot) {
            if (!blockPlayerStates()) player.x += player.xSpeed;
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
            } else if (player.checkArrowCollision(itemArray)) {
                player.destroyArrow();
            } else if (player.arrowX > canvas.width + player.arrowWidth || player.arrowX + player.arrowWidth < 0) {
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
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();

        // Move movable environment and re-draw
        for (let i = 0; i < environmentTileArray.length; i++) {
            // Move movable pieces only if in NORMAL
            if ((environmentTileArray[i].movesX || environmentTileArray[i].movesY) && state === "NORMAL") {
                    environmentTileArray[i].movePiece();
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