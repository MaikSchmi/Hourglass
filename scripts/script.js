// Menu Controls
const btnStart = document.getElementById("btn-start");
const btnTimeTrial = document.getElementById("btn-time-trial");
const btnHighscores = document.getElementById("btn-highscores");
const btnHighscoresReturn = document.getElementById("btn-highscore-return-to-menu");
const btnCredits = document.getElementById("btn-credits");
const btnQuit = document.getElementById("btn-quit");

const btnRetry = document.getElementById("btn-retry");
const btnReturnToMenu = document.getElementById("btn-return-to-menu");

const btnMenuNameOK = document.getElementById("input-name-ok-button");
const btnMenuNameCancel = document.getElementById("input-name-cancel-button");
const inputName = document.getElementById("input-name");

// Display
const mainMenu = document.getElementById("title-screen-container");
const enterName = document.getElementById("player-name-prompt-popup");
const highscoreMenu = document.getElementById("highscore-screen-container");
const canvas = document.querySelector(".screen");
const ctx = canvas.getContext("2d");
let roomTransitAlpha;
let fadeOut = false;
let bgColor = "rgb(0, 195, 255)"

// Music
const titleAudio = new Audio("sfx/bg.mp3");
titleAudio.volume = 0.1;
const bgAudio = new Audio("sfx/song.wav");
bgAudio.volume = 0.01;

// Game Variables
let gameInProgress = false;
const gameRec = [];
const globalGameRec = [];
let state;
let animateId;
const imgTimeControl = new Image();
const imgTimeControlArr = ["img/time_control_normal.png", "img/time_control_stop.png", "img/time_control_rewind.png", "img/time_control_fast_rewind.png"]
imgTimeControl.src = imgTimeControlArr[0];
let gameCompleted = false;

let mode;
let gameTimer;
let timerIsPaused = true; 
let time;
let score;
let gamerName = "";

// Levels
let level;

let hasLevel1Init;
let hasLevel2Init;
let hasLevel3Init;
let hasLevel4Init;
let hasLevel5Init;
let hasLevel6Init;
let hasLevel7Init;
let hasLevel8Init;
let hasLevel9Init;
let hasLevel10Init;

// Physics
const grv = 3;
let grvAcc = 5;


// Main Game Load
window.onload = () => {
    highscoreMenu.style.display = "none"
    canvas.style.display = "none";
    btnRetry.style.display = "none";
    btnReturnToMenu.style.display = "none";
    titleAudio.play();
    titleAudio.loop = true;

    // Menu Controls
    btnStart.addEventListener("mousedown", e => {
        btnClickEffect(btnStart);
    });
    btnStart.addEventListener("mouseup", e => {
        btnClickEffect(btnStart);
        mode = "NORMAL";
        enterName.style.display = "block";
    });

    btnTimeTrial.addEventListener("mousedown", e => {
        btnClickEffect(btnTimeTrial);
    });
    btnTimeTrial.addEventListener("mouseup", e => {
        btnClickEffect(btnTimeTrial);
        mode = "TIMETRIAL";
        enterName.style.display = "block";
    });

    btnHighscores.addEventListener("mousedown", e => {
        btnClickEffect(btnHighscores);
    });
    btnHighscores.addEventListener("mouseup", e => {
        btnClickEffect(btnHighscores);
        highscoreMenu.style.display = "flex";
        mainMenu.style.display = "none";
    });

    btnHighscoresReturn.addEventListener("mousedown", e => {
        btnClickEffect(btnHighscoresReturn);
    });
    btnHighscoresReturn.addEventListener("mouseup", e => {
        btnClickEffect(btnHighscoresReturn);
        highscoreMenu.style.display = "none";
        mainMenu.style.display = "flex";

    });


    btnCredits.addEventListener("mousedown", e => {
        btnClickEffect(btnCredits);
    });
    btnCredits.addEventListener("mouseup", e => {
        btnClickEffect(btnCredits);
    });

    btnQuit.addEventListener("mousedown", e => {
        btnClickEffect(btnQuit);
    });
    btnQuit.addEventListener("mouseup", e => {
        btnClickEffect(btnQuit);
        alert("Just close the browser tab?");
    });

    btnRetry.addEventListener("mousedown", e => {
        btnClickEffect(btnRetry);
    });
    btnRetry.addEventListener("mouseup", e => {
        btnClickEffect(btnRetry);
        state = "LEVELREWIND";
        if (timerIsPaused) timerIsPaused = false;
        btnRetry.style.display = "none";
        btnReturnToMenu.style.display = "none";
        checkState();
    });
    
    btnReturnToMenu.addEventListener("mousedown", e => {
        btnClickEffect(btnReturnToMenu);
    });
    btnReturnToMenu.addEventListener("mouseup", e => {
        btnClickEffect(btnReturnToMenu);
        state = "ENDGAME";
        btnRetry.style.display = "none";
        btnReturnToMenu.style.display = "none";
        resetInitGameValues();
        checkState();
    });


    btnMenuNameOK.addEventListener("mousedown", e => {
        btnClickEffect(btnMenuNameOK);
    });
    btnMenuNameOK.addEventListener("mouseup", e => {
        btnClickEffect(btnMenuNameOK);
        startGame();
        gamerName = inputName.value;
        state = "ROOMTRANSIT";
        mainMenu.style.display = "none";
        enterName.style.display = "none";
        canvas.style.display = "flex";
    });

    btnMenuNameCancel.addEventListener("mousedown", e => {
        btnClickEffect(btnMenuNameCancel);
    });
    btnMenuNameCancel.addEventListener("mouseup", e => {
        btnClickEffect(btnMenuNameCancel);
        enterName.style.display = "none";
    });

    function btnClickEffect(btn) {
        if (btn.classList.contains("pressed")) {
            btn.classList.remove("pressed");
        } else {
            btn.classList.add("pressed");
        }
    }

    let player;

    // Start
    function startGame() {
        state = "NORMAL";
        resetInitGameValues(); 
        player = new Player(10, canvas.height - 128, 64, 64, 3, 2, 10, -1);
        player.initialize();
        gameInProgress = true;
        titleAudio.pause();
        bgAudio.play()
        bgAudio.loop = true;
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
            case 1: if (!hasLevel1Init) level1Init(); break;
            case 2: if (!hasLevel2Init) level2Init(); break;
            case 3: if (!hasLevel3Init) level3Init(); break;
            case 4: if (!hasLevel4Init) level4Init(); break;
            case 5: if (!hasLevel5Init) level5Init(); break;
            case 6: if (!hasLevel6Init) level6Init(); break;
            case 7: if (!hasLevel7Init) level7Init(); break;
            case 8: if (!hasLevel8Init) level8Init(); break;
            case 9: if (!hasLevel9Init) level9Init(); break;
            case 10: if (!hasLevel10Init) level10Init(); break;
            default: level = 1; break;
        }
    }
    // LEVEL 1
    function level1Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 195, 255)"
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
        promptArray.push(new Prompt(`Use A and D or the Arrow keys to move.`, 100, 100, 500, 100, player.x, player.y, 64, 64));
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
        bgColor = "rgb(0, 175, 255)"
        // Move Player
        player.x = 10;
        player.y = canvas.height - 128;
        player.facing = 1;
        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 64, "darkgreen", false, false, 0, 0, 0, 0, 0)); // Bottom Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 16, "green", false, false, 0, 0, 0, 0, 0)); // Bottom Floor

        environmentTileArray.push(new Environment(level, canvas.width / 2 - 110 - 128, canvas.height - 138, 64, 74, "orange", false, false, 0, 0, 0, 0, 0)); // Jump Block
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 47 - 128, canvas.height - 202, 64, 138, "orange", false, false, 0, 0, 0, 0, 0)); // Jump Block
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 14 - 128, canvas.height - 266, 84, 202, "orange", false, false, 0, 0, 0, 0, 0)); // Jump Block
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 78 - 128, canvas.height - 266, 362, 64, "orange", false, false, 0, 0, 0, 0, 0)); // Jump Block
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 100 - 128, canvas.height - 128, 64, 64, "brown", false, false, 0, 0, 0, 0, 0)); // Jump Block
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 37 - 128, canvas.height - 192, 64, 128, "brown", false, false, 0, 0, 0, 0, 0)); // Jump Block
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 24 - 128, canvas.height - 256, 64, 192, "brown", false, false, 0, 0, 0, 0, 0)); // Jump Block

        environmentTileArray.push(new Environment(level, canvas.width / 2 + 78 - 128, canvas.height - 256, 352, 44, "brown", false, false, 0, 0, 0, 0, 0)); // Jump Block
        // Items
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y, 64, 64)); // Player start
        itemArray.push(new Item(level, "HANGING", "key", 710, player.y - 72, 32, 64)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 78, player.y, 64, 64)); // Level end
        // Prompts
        promptArray.push(new Prompt(`Press Spacebar to jump.`, 500, 100, 330, 100, 300, player.y, 64, 64));
        promptArray.push(new Prompt(`Press E while jumping if the key is too high!`, 710, 100, 550, 100, 710, player.y, 128, 64));

        // Initialize Objects
        initializeAll();
        hasLevel2Init = true;
    }

    // LEVEL 3
    function level3Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 155, 255)"
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
        bgColor = "rgb(0, 135, 255)"
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
        itemArray.push(new Item(level, "HANGING", "key", 400, player.y - 182, 32, 64)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 96, player.y - 176, 64, 64)); // Level end
        
        // Prompts
        promptArray.push(new Prompt(`You may have to get creative to reach this key ...`, 400, 250, 560, 100, 300, player.y, 256, 64));

        // Initialize Objects
        initializeAll();
        hasLevel4Init = true;
    }

    // LEVEL 5
    function level5Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 115, 255)"

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
        promptArray.push(new Prompt(`Don't worry, hit the "1" key once to Stop time and again to Rewind time.`, 400, 250, 800, 100, canvas.width / 2, player.y, 192, 64));
        promptArray.push(new Prompt(`Now hit the "3" key to Resume time as normal again.`, 400, 250, 700, 100, canvas.width / 2 + 64, player.y - 64, 256, 64));

        // Initialize Objects
        initializeAll();
        hasLevel5Init = true;
    }

    // LEVEL 6
    function level6Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 95, 200)"
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

        // Prompts
        promptArray.push(new Prompt(`Rewinding time resets items.`, canvas.width / 2 - 200, canvas.height / 4 + 32, 400, 100, player.x, player.y, 256, 64));
        promptArray.push(new Prompt(`Collect items in normal time flow.`, canvas.width / 2 - 200, canvas.height / 4 + 32, 400, 100, 439, 120, 256, 64));
        promptArray.push(new Prompt(`Kill enemies in normal time flow...`, canvas.width / 2 - 200, canvas.height / 4 + 32, 400, 100, 439, 445, 256, 64));
        promptArray.push(new Prompt(`...or when time is stopped!`, canvas.width / 2 - 200, canvas.height / 4 + 32, 400, 100, 829, 445, 256, 64));

        // Initialize Objects
        initializeAll();
        hasLevel6Init = true;
    }

    // LEVEL 7
    function level7Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 75, 175)"
        // Move Player
        player.x = 32 + player.width;
        player.y = canvas.height - 128;
        player.facing = 1;

        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, 256, 128, "orange", false, false, 0, 0, 0, 0, 0)); // Old Floor Bottom
        environmentTileArray.push(new Environment(level, 0, canvas.height - 54, 246, 128, "brown", false, false, 0, 0, 0, 0, 0)); // Old Floor Bottom
        environmentTileArray.push(new Environment(level, 0, canvas.height - 330, 266, 148, "orange", false, false, 0, 0, 0, 0, 0)); // Old Floor 1st Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 320, 256, 128, "brown", false, false, 0, 0, 0, 0, 0)); // Old Floor 1st Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 630, 266, 148, "orange", false, false, 0, 0, 0, 0, 0)); // Old Floor 2nd Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 620, 256, 128, "brown", false, false, 0, 0, 0, 0, 0)); // Old Floor 2nd Floor
        environmentTileArray.push(new Environment(level, 0, 0, 266, 22, "orange", false, false, 0, 0, 0, 0, 0)); // Old Floor Ceiling
        environmentTileArray.push(new Environment(level, 0, 0, 256, 12, "brown", false, false, 0, 0, 0, 0, 0)); // Old Floor Ceiling
        environmentTileArray.push(new Environment(level, 246, canvas.height - 64, canvas.width, 128, "gold", false, false, 0, 0, 0, 0, 0)); // New Floor BOTTOM
        environmentTileArray.push(new Environment(level, 256, canvas.height - 54, canvas.width, 230, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // New Floor BOTTOM
        environmentTileArray.push(new Environment(level, 256, canvas.height - 330, 640, 148, "gold", false, false, 0, 0, 0, 0, 0)); // New Floor 1ST FLOOR
        environmentTileArray.push(new Environment(level, 266, canvas.height - 320, 620, 128, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // New Floor 1ST FLOOR
        environmentTileArray.push(new Environment(level, canvas.width - 120, canvas.height - 330, 640, 148, "gold", false, false, 0, 0, 0, 0, 0)); // New Floor 1ST FLOOR RIGHT
        environmentTileArray.push(new Environment(level, canvas.width - 110, canvas.height - 320, 620, 128, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // New Floor 1ST FLOOR RIGHT
        environmentTileArray.push(new Environment(level, 600, canvas.height - 630, 1200, 148, "gold", false, false, 0, 0, 0, 0, 0)); // New Floor 2ND FLOOR
        environmentTileArray.push(new Environment(level, 610, canvas.height - 620, 1200, 128, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // New Floor 2ND FLOOR
        environmentTileArray.push(new Environment(level, 246, 0, 1200, 22, "gold", false, false, 0, 0, 0, 0, 0)); // New Floor CEILING
        environmentTileArray.push(new Environment(level, 256, 0, 1200, 12, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // New Floor CEILING
        environmentTileArray.push(new Environment(level, 0, 0, 54, canvas.height, "brown", false, false, 0, 0, 0, 0, 0)); // Old Floor Left Wall
        environmentTileArray.push(new Environment(level, canvas.width - 54, 0, 54, canvas.height, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // Old Floor Left Wall
        environmentTileArray.push(new Environment(level, 265, canvas.height / 2, 168, 64, "gold", false, true, 0, 240, 0, -1, 1)); // Elevator LEFT TOP
        environmentTileArray.push(new Environment(level, 275, canvas.height / 2 + 10, 148, 44, "rgb(159, 159, 1)", false, true, 0, 240, 0, -1, 1)); // Elevator LEFT TOP
        environmentTileArray.push(new Environment(level, 433, canvas.height / 2 - 240, 168, 64, "gold", false, true, 0, 240, 0, 1, 1)); // Elevator RIGHT TOP
        environmentTileArray.push(new Environment(level, 443, canvas.height / 2 - 230, 148, 44, "rgb(159, 159, 1)", false, true, 0, 240, 0, 1, 1)); // Elevator RIGHT TOP
        environmentTileArray.push(new Environment(level, canvas.width / 1.5 - 2, canvas.height / 2 + 60, 168, 64, "gold", false, true, 0, 264, 0, 1, 1)); // Elevator LEFT BOTTOM
        environmentTileArray.push(new Environment(level, canvas.width / 1.5 + 8, canvas.height / 2 + 70, 148, 44, "rgb(159, 159, 1)", false, true, 0, 264, 0, 1, 1)); // Elevator LEFT BOTTOM
        environmentTileArray.push(new Environment(level, canvas.width / 1.5 + 166, canvas.height / 2 + 324, 168, 64, "gold", false, true, 0, 264, 0, -1, 1)); // Elevator RIGHT BOTTOM
        environmentTileArray.push(new Environment(level, canvas.width / 1.5 + 176, canvas.height / 2 + 334, 148, 44, "rgb(159, 159, 1)", false, true, 0, 264, 0, -1, 1)); // Elevator RIGHT BOTTOM
        
        // Enemies
        enemyArray.push(new Enemy(level, "Lzard", 1000, canvas.height - 180, 156, 128, 2, 2, -1, true, false, 90, 0, 1, 0)); // BOTTOM
        enemyArray.push(new Enemy(level, "Lzard", 690, canvas.height - 180, 156, 128, 2, 2, 1, true, false, 150, 0, 1, 0)); // BOTTOM
        enemyArray.push(new Enemy(level, "Lzard", 410, canvas.height - 180, 156, 128, 2, 2, -1, true, false, 750, 0, 1, 0)); // BOTTOM
        enemyArray.push(new Enemy(level, "Lzard", 240, canvas.height - 440, 156, 128, 2, 2, -1, true, false, 180, 0, 1, 0)); // 1ST FLOOR
        enemyArray.push(new Enemy(level, "Lzard", 430, canvas.height - 440, 156, 128, 2, 2, 1, true, false, 350, 0, 1, 0)); // 1ST FLOOR
        enemyArray.push(new Enemy(level, "Lzard", 317, canvas.height - 440, 156, 128, 2, 2, -1, true, false, 250, 0, 1, 0)); // 1ST FLOOR
        enemyArray.push(new Enemy(level, "Lzard", 900, 32, 156, 128, 2, 2, -1, true, false, 250, 0, 1, 0)); // 2ND FLOOR
        
        // Items
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y, 64, 64)); // Player start
        itemArray.push(new Item(level, "HANGING", "key", canvas.width -128, 24, 32, 64)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", player.x + 196, player.y, 64, 64)); // Level end
        

        // Initialize Objects
        initializeAll();
        hasLevel7Init = true;
    }

    // LEVEL 8
    function level8Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 55, 125)"
        // Move Player
        player.x = 10;
        player.y = canvas.height - 140;
        player.facing = 1;

        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, 202, 128, "gold", false, false, 0, 0, 0, 0, 0)); // New Floor BOTTOM LEFT
        environmentTileArray.push(new Environment(level, 0, canvas.height - 54, 192, 128, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // New Floor BOTTOM LEFT
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 24, canvas.height - 64, canvas.width, 230, "gold", false, false, 0, 0, 0, 0, 0)); // New Floor BOTTOM RIGHT
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 14, canvas.height - 54, canvas.width, 230, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // New Floor BOTTOM RIGHT
        environmentTileArray.push(new Environment(level, 202, canvas.height - 64, 168, 63, "gold", true, false, 280, 0, 1, 0, 1)); // Elevator LEFT BOTTOM
        environmentTileArray.push(new Environment(level, 212, canvas.height - 54, 148, 44, "rgb(159, 159, 1)", true, false, 280, 0, 1, 0, 1)); // Elevator LEFT BOTTOM
        environmentTileArray.push(new Environment(level, 192, canvas.height / 2 + 54, 128, 64, "gold", false, false, 0, 0, 0, 0, 0)); // New Floor ISLAND LEFT
        environmentTileArray.push(new Environment(level, 202, canvas.height / 2 + 64, 108, 44, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // New Floor ISLAND LEFT
        environmentTileArray.push(new Environment(level, 392, canvas.height / 2 + 54, 398, 64, "gold", false, false, 0, 0, 0, 0, 0)); // New Floor ISLAND LEFT
        environmentTileArray.push(new Environment(level, 402, canvas.height / 2 + 64, 378, 44, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // New Floor ISLAND LEFT
        
        environmentTileArray.push(new Environment(level, canvas.width / 1.5, canvas.height / 2 + 54, 128, 64, "gold", false, true, 0, 271, 0, 1, 1)); // New Floor Elevator Right
        environmentTileArray.push(new Environment(level, canvas.width / 1.5 + 10, canvas.height / 2 + 64, 108, 44, "rgb(159, 159, 1)", false, true, 0, 271, 0, 1, 1)); // New Floor Elevator Right
        environmentTileArray.push(new Environment(level, canvas.width - 260, canvas.height / 2 + 321, 198, 64, "gold", false, true, 0, 518, 0, -1, 1)); // New Floor Elevator Right
        environmentTileArray.push(new Environment(level, canvas.width - 260 + 10, canvas.height / 2 + 331, 178, 44, "rgb(159, 159, 1)", false, true, 0, 518, 0, -1, 1)); // New Floor Elevator Right

        
        // Enemies
        enemyArray.push(new Enemy(level, "Lzard", 760, canvas.height - 180, 156, 128, 2, 2, 1, true, false, 150, 0, 1, 0)); // BOTTOM
        enemyArray.push(new Enemy(level, "Lzard", canvas.width / 2 - 130, canvas.height / 2 - 64, 156, 128, 2, 2, 1, true, false, 150, 0, 1, 0)); // Top
        enemyArray.push(new Enemy(level, "Spikes", 138 + 64, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 128, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 192, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 256, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 320, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 384, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 448, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        
        // Items
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y + 12, 64, 64)); // Player start
        itemArray.push(new Item(level, "HANGING", "key", 128, 24, 32, 64)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 196, 128, 64, 64)); // Level end

        // Initialize Objects
        initializeAll();

        // Let key fall
        for (let i = 0; i < itemArray.length; i++) {
            if (itemArray[i].id === level && itemArray[i].name === "key") {
                itemArray[i].hit();
                break;
            }
        }
        hasLevel8Init = true;
    }

    // LEVEL 9
    function level9Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 35, 100)" //- REMINDER
        // Move Player
        player.x = 10;
        player.y = canvas.height - 140;
        player.facing = 1;
        
        // Environment
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, 138, 128, "gold", false, false, 0, 0, 0, 0, 0)); // Floor
        environmentTileArray.push(new Environment(level, 0, canvas.height - 54, 128, 230, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // Floor 
        environmentTileArray.push(new Environment(level, canvas.width - 138, 256, 138, canvas.height - 256, "gold", false, false, 0, 0, 0, 0, 0)); // Floor
        environmentTileArray.push(new Environment(level, canvas.width - 128, 266, 138, canvas.height - 256, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // Floor 
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 158, 0, 316, 106, "gold", false, false, 0, 0, 0, 0, 0)); // Key Hanging Piece
        environmentTileArray.push(new Environment(level, canvas.width / 2 - 148, 0, 296, 96, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // Key Hanging Piece
        
        environmentTileArray.push(new Environment(level, 235, canvas.height - 128, 168, 64, "gold", false, true, 0, 396, 0, -1, 1)); // Elevator 1 Piece
        environmentTileArray.push(new Environment(level, 245, canvas.height - 118, 148, 44, "rgb(159, 159, 1)", false, true, 0, 396, 0, -1, 1)); // Elevator 1 Piece

        environmentTileArray.push(new Environment(level, 340, canvas.height / 2, 198, 64, "gold", true, false, 396, 396, 1, 0, 1)); // Elevator Bridge 
        environmentTileArray.push(new Environment(level, 350, canvas.height / 2 + 10, 178, 44, "rgb(159, 159, 1)", true, false, 396, 396, 1, 0, 1)); // Elevator Bridge

        environmentTileArray.push(new Environment(level, canvas.width / 2 + 267, 116, 168, 64, "gold", false, true, 0, 396, 0, 1, 1)); // Elevator 2 Piece
        environmentTileArray.push(new Environment(level, canvas.width / 2 + 277, 126, 148, 44, "rgb(159, 159, 1)", false, true, 0, 396, 0, 1, 1)); // Elevator 2 Piece
        // Enemies
        enemyArray.push(new Enemy(level, "Spikes", 138, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 64, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 128, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 192, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 256, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 320, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 384, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 448, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 512, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 576, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 640, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 704, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 768, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 832, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 896, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 960, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        enemyArray.push(new Enemy(level, "Spikes", 138 + 1024, canvas.height - 48, 64, 48, 0, 0, 1, false, false, 0, 0, 0, 0));
        // Items
        itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y + 12, 64, 64)); // Player start
        itemArray.push(new Item(level, "HANGING", "key", canvas.width / 2, 106, 32, 64)); // Key
        itemArray.push(new Item(level, "CLOSED", "roomTransit", canvas.width - 96, 192, 64, 64)); // Level end

        // Initialize Objects
        initializeAll();
        hasLevel9Init = true;
    }
    // LEVEL 10
    function level10Init() {
        moveAllForNextLevel();
        bgColor = "rgb(0, 0, 0)" //- REMINDER
        // Move Player
        player.x = 10;
        player.y = canvas.height /2
        player.facing = 1;
        
        // Environment
        // --- Hourglass
        environmentTileArray.push(new Environment(level, 0, canvas.height - 64, canvas.width, 64, "gold", false, false, 0, 0, 0, 0, 0)); // 0
        environmentTileArray.push(new Environment(level, 0, canvas.height - 54, canvas.width, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // 0 
        environmentTileArray.push(new Environment(level, 54, canvas.height - 128, canvas.width - 108, 64, "gold", false, false, 0, 0, 0, 0, 0)); // 1
        environmentTileArray.push(new Environment(level, 64, canvas.height - 118, canvas.width - 128, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // 1
        environmentTileArray.push(new Environment(level, 118, canvas.height - 192, canvas.width - 236, 64, "gold", false, false, 0, 0, 0, 0, 0)); // 2
        environmentTileArray.push(new Environment(level, 128, canvas.height - 182, canvas.width - 256, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // 2
        environmentTileArray.push(new Environment(level, 246, canvas.height - 256, canvas.width - 492, 64, "gold", false, false, 0, 0, 0, 0, 0)); // 3
        environmentTileArray.push(new Environment(level, 256, canvas.height - 246, canvas.width - 512, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // 3
        environmentTileArray.push(new Environment(level, 374, canvas.height - 320, canvas.width - 748, 64, "gold", false, false, 0, 0, 0, 0, 0)); // 4
        environmentTileArray.push(new Environment(level, 384, canvas.height - 310, canvas.width - 768, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // 4
        environmentTileArray.push(new Environment(level, 374, 256, canvas.width - 748, 64, "gold", false, false, 0, 0, 0, 0, 0)); // -4
        environmentTileArray.push(new Environment(level, 384, 256, canvas.width - 768, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // -4
        environmentTileArray.push(new Environment(level, 246, 192, canvas.width - 492, 64, "gold", false, false, 0, 0, 0, 0, 0)); // -3
        environmentTileArray.push(new Environment(level, 256, 192, canvas.width - 512, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // -3
        environmentTileArray.push(new Environment(level, 118, 128, canvas.width - 236, 64, "gold", false, false, 0, 0, 0, 0, 0)); // -2
        environmentTileArray.push(new Environment(level, 128, 128, canvas.width - 256, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // -2
        environmentTileArray.push(new Environment(level, 54, 64, canvas.width - 108, 64, "gold", false, false, 0, 0, 0, 0, 0)); // -1
        environmentTileArray.push(new Environment(level, 64, 64, canvas.width - 128, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // -1
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width, 64, "gold", false, false, 0, 0, 0, 0, 0)); // 0
        environmentTileArray.push(new Environment(level, 0, 0, canvas.width, 54, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // 0
        // --- Bridges
        environmentTileArray.push(new Environment(level, 0, canvas.height / 2 + 74, 128, 64, "gold", false, false, 0, 0, 0, 0, 0)); // Left
        environmentTileArray.push(new Environment(level, 0, canvas.height / 2 + 84, 118, 44, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // Left
        environmentTileArray.push(new Environment(level, canvas.width - 128, canvas.height / 2 + 74, 128, 64, "gold", false, false, 0, 0, 0, 0, 0)); // Right
        environmentTileArray.push(new Environment(level, canvas.width - 118, canvas.height / 2 + 84, 118, 44, "rgb(159, 159, 1)", false, false, 0, 0, 0, 0, 0)); // Right

        // Boss
        enemyArray.push(new Enemy(level, "Boss", canvas.width / 2, canvas.height / 2, player.height, player.width, player.xSpeed, player.ySpeed, player.facing * -1, false, false, 0, 0, 0, 0));


        // Items
       itemArray.push(new Item(level, "NONE", "roomTransit", player.x, player.y + 12, 64, 64)); // Player start
       itemArray.push(new Item(level, "NORMAL", "hourglass", canvas.width - 58, canvas.height / 2, 56, 64)); // Player start

        // Initialize Objects
        initializeAll();
        hasLevel10Init = true;
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
                if (gameCompleted && gameRec.length < 10) {
                    cancelAnimationFrame(animateId);
                    canvas.style.display = "none";
                    mainMenu.style.display = "flex";
                    bgAudio.pause();
                    titleAudio.play()
                    titleAudio.loop = true;
                    resetInitGameValues();
                }
                break;
            case "ROOMTRANSIT":
                animateId = requestAnimationFrame(roomTransit);
                break;
            case "DEAD":
                cancelAnimationFrame(animateId);

                btnRetry.style.display = "block";
                btnReturnToMenu.style.display = "block";

                timerIsPaused = true;

                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);
                ctx.font = ctx.font.replace(/\d+px/, "40px");
                ctx.fillStyle = "red";
                ctx.fillText("YOU ARE DEAD!", canvas.width / 2 - 200, canvas.height / 2 - 50, 1200);
                ctx.closePath();
                break;
            case "GAMEFINISHED":
                score = time;
                gameCompleted = true;
                clearInterval(gameTimer);
                addHighscore(score, gamerName);
                state = "FULLREWIND";
                checkState()
                break;
            case "ENDGAME":
                cancelAnimationFrame(animateId);
                mainMenu.style.display = "flex";
                canvas.style.display = "none";
                break;
            default:
                break;
        }
    }        
    // STATE NORMAL
    function stateNormal() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();
        recordGame("ALL");
        gameHandler();
    }
    // STATE STOP
    function stateStop() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();
        globalRecordGame();
        gameHandler();
    }
    // STATE REWIND
    function stateRewind() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();
        globalRecordGame();
        rewindGame();
        gameHandler();
    }
    function levelRewind() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();
        globalRecordGame();
        rewindGame();
        gameHandler();
    }
    function fullRewind() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        enableEnemies();
        globalRecordGame();
        rewindGame();
        gameHandler();
    }
    function roomTransit() {
        drawBackgroundAndEnvironment()
        drawItems();
        drawPlayer();
        globalRecordGame();
        enableEnemies();

        // Draw Room Fade
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 0, 0, ${roomTransitAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
    
        // Fade and switch level
        if (fadeOut) {
            roomTransitAlpha += 0.01;
            timerIsPaused = true;
            if (roomTransitAlpha >= 1) {
                fadeOut = false;
                level++;
                checkLevel();
            }
        } else {
            roomTransitAlpha -= 0.01;
            if (roomTransitAlpha <= 0) {
                state = "NORMAL";
                fadeOut = true;
                timerIsPaused = false;
            }
        }
        checkState();
    }





    // RECORD
    function recordGame(scope) {
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
                time: time,
                bg: bgColor,
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
        if (scope === "GLOBAL") {
            globalGameRec.push([level, playerStats, environment, enemies, items]);
        } else {
            gameRec.push([level, playerStats, environment, enemies, items]);    
            globalGameRec.push([level, playerStats, environment, enemies, items]);
        }

    }

    // REWIND
    function rewindGame() {
        if (state === "DEAD") return;

        let rewindSpeeder;
        if (state === "REWIND") {
            rewindSpeeder = 1;
        } else if (state === "LEVELREWIND") {
            rewindSpeeder = 7;
        } else if (state === "FULLREWIND") {
            rewindSpeeder = 9;
        }
        let index = gameRec.length - rewindSpeeder;
        if (index < 0) index = 0;

        // Prevent rewinding to previous level
        if (state === "REWIND" || state === "LEVELREWIND") {    
            if (gameRec[index][0] === level && gameRec[index - 1][0] === level){
                restoreFromGameRec(rewindSpeeder);
                gameRec.splice(index, rewindSpeeder);
                if (index <= 0) state = "NORMAL";
            } else {
                state = "NORMAL";
            } 
        } else if (gameRec[index][0] !== level && (state === "REWIND" || state === "LEVELREWIND")) {
            state = "NORMAL";
        }
        
        if (state === "FULLREWIND") {
            restoreFromGameRec(rewindSpeeder);
            gameRec.splice(index, rewindSpeeder);
            if (index === 0) {
                state = "NORMAL";
            }
        }
    }
    
    // COPY LEVEL RECORD
    function globalRecordGame() {
        recordGame("GLOBAL");
    }

    // REWIND
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
            bgColor = gameRec[index][1][0].bg;
        }

        if (state === "FULLREWIND") {
            time = gameRec[index][1][0].time;
        }

        // Restore Environment
        for (let i = 0; i < environmentTileArray.length; i++) {
            if (state === "FULLREWIND" && environmentTileArray[i].id > gameRec[index][0]) {
                environmentTileArray.splice(i, environmentTileArray.length - 1);
                continue;
            }

            if (i > gameRec[index][2].length - 1) continue;

            environmentTileArray[i].x = gameRec[index][2][i].x;
            environmentTileArray[i].y = gameRec[index][2][i].y;
        }

        // Restore Enemies
        for (let i = 0; i < enemyArray.length; i++) {
            if (state === "FULLREWIND" && enemyArray[i].id > gameRec[index][0]) {
                enemyArray.splice(i, enemyArray.length - 1);
                continue;
            }
            
            if (i > gameRec[index][3].length - 1) continue;

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
                itemArray.splice(i, itemArray.length - 1);
                continue;
            }

            if (i > gameRec[index][4].length - 1) continue;

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

    // Draw Time Control
    function drawTimeControl() {
        if (state === "NORMAL") {
            imgTimeControl.src = imgTimeControlArr[0];
        } else if (state === "STOP") {
            imgTimeControl.src = imgTimeControlArr[1];
        } else if (state === "REWIND") {
            imgTimeControl.src = imgTimeControlArr[2];
        } else if (state === "LEVELREWIND" || state === "FULLREWIND") {
            imgTimeControl.src = imgTimeControlArr[3];
        }
        ctx.drawImage(imgTimeControl, canvas.width / 2 - imgTimeControl.width, 0, 256, 128);
    }

    

    // Player Controls
    document.addEventListener("keydown", (e) => {
        if (gameInProgress) {
            switch (e.key) {
                // PLAYER
                case "d": // Left
                case "D":
                case "ArrowRight":
                    player.facing = 1;
                    player.moveRight = true;
                break;
                case "a": // Right
                case "A":
                case "ArrowLeft":
                    player.facing = -1;
                    player.moveLeft = true;
                break;
                case " ": // Jump
                    if (player.canJump) player.jump = true;
                break;
                case "e": // Interact
                case "E":
                    player.checkInteractableCollision(itemArray, 0, 0, 0, 0);
                break;
                case "f": // Shoot
                case "F":
                    if (player.canShoot && !player.shoot && !player.arrowFlying) player.shoot = true;
                break;
                case "p": // DEBUG
                    level++;
                break;
                // TIME
                case "1":
                case "!":
                    if (state === "NORMAL") {
                        state = "STOP";
                        checkState();
                    } else if (state === "STOP") {
                        state = "REWIND";
                        checkState();
                    }
                break;
                case "3":
                case "§":
                    if (state === "REWIND") {
                        state = "STOP"
                        checkState();
                    } else if (state === "STOP") {
                        state = "NORMAL"
                        checkState();
                    }
                break;
            }
        }
    });
    document.addEventListener("keyup", (e) => {
        if (gameInProgress) {
            switch (e.key) {
                case "d":
                case "D":
                case "ArrowRight":
                    player.facing = 1;
                    player.moveRight = false;
                break;
                case "a":
                case "A":
                case "ArrowLeft":
                    player.facing = -1;
                    player.moveLeft = false;
                break;
            }
        }
    });

    function blockPlayerStates() {
        return (state === "ROOMTRANSIT" || state === "LEVELREWIND" || state === "FULLREWIND");
    }
    // Update Player
    function drawPlayer() {
        // PHYSICS
        player.updateCollision();
        if (mode === "TIMETRIAL") displayTimer();
        drawTimeControl();

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
                setTimeout(() => player.jump = false, 150);
            }

            // ENEMY
            if (player.checkCollision(enemyArray, 0, -16, 0, -32)) {
                player.die();
                checkState();
            }
            
            // Check for prompts
            player.checkInteractableCollision(promptArray, 0, 0, 0, 0)

            // Update Arrow Use
            enableArrow();
        }

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
            enemyArray[i].updateCollision();
            if (enemy === "Lzard") {
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
            } else if (enemy === "Spikes") {
                ctx.drawImage(enemyArray[i].img, enemyArray[i].x, enemyArray[i].y, enemyArray[i].width, enemyArray[i].height);
            } else if (enemy === "Boss") {
                // Animation
                let sprite = enemyArray[i].bossIdleLeft;

                enemyArray[i].x = canvas.width - player.x - player.width;
                enemyArray[i].y = player.y;
                enemyArray[i].facing = player.facing * -1;

                if (enemyArray[i].facing === -1) {
                    sprite = enemyArray[i].bossIdleLeft;
                } else if (enemyArray[i].facing === 1) {
                    sprite = enemyArray[i].bossIdle
                }
                    animateSprite(
                    enemyArray[i], 
                    enemyArray[i].img, 
                    sprite,
                    player.spriteSpeed,
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

    // TIMER
    function startTimer() {
        if (!timerIsPaused) time++;
    }
    function displayTimer() {
        ctx.beginPath();
        ctx.font = ctx.font.replace(/\d+px/, "30px");
        ctx.fillStyle = "white";
        ctx.fillText(`Time: ${convertTime()}`, 32, 32)
        ctx.closePath();
    }
    function convertTime() {
        let mins = Math.floor(time/6000);
        let secs = Math.floor(time/100) % 60;
        let csecs = time % 100;
        
        if (mins < 10) mins = "0" + mins;
        if (secs < 10) secs = "0" + secs;

        return `${mins}.${secs}.${csecs}`
    }

    function resetInitGameValues() {
        gameCompleted = false;
        score = 0;
        time = 0;
        timerIsPaused = true;
        level = 1;
        roomTransitAlpha = 1;
        fadeOut = false;
        gameTimer = setInterval(startTimer, 10);

        hasLevel0Init = false;
        hasLevel1Init = false;
        hasLevel2Init = false;
        hasLevel3Init = false;
        hasLevel4Init = false;
        hasLevel5Init = false;
        hasLevel6Init = false;
        hasLevel7Init = false;
        hasLevel8Init = false;
        hasLevel9Init = false;
        hasLevel10Init = false;

        if (player) player = undefined;
        gameInProgress = false;
    }

    function addHighscore(score, name) {
        const highscoreList = [...document.querySelectorAll("#highscore-container li")];
        const scoreArr = [];
        const playername = name;
        const newScore = score;
        
        scoreArr.push([newScore.toString(), "-", playername]);
        
        for (let i = 0; i < highscoreList.length; i++) {
            scoreArr.push(highscoreList[i].innerHTML.split(" "));
            scoreArr[i][0] = parseInt(scoreArr[i][0])
        }

        scoreArr.sort((a, b) => a[0] - b[0]);
        scoreArr.pop();

        for (let i = 0; i < scoreArr.length; i++) {
            let modScore = scoreArr[i][0].toString();
            if (modScore === "NaN") break;
            while (modScore.length < 7) modScore = "0" + modScore;
            if (modScore.length > 7) modScore = "99999";
            highscoreList[i].innerHTML = `${modScore} - ${scoreArr[i][2].split(" ")}`;
        }
    }
};