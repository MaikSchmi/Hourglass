// Player
const playerInventory = [];
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

    checkInteractableCollision(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (this.left < arr[i].right &&
                this.right > arr[i].left &&
                this.top < arr[i].bottom &&
                this.bottom > arr[i].top) {
                    this.interact(arr[i]);
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

    interact(obj) {
        if (obj.getName() === "key" && obj.getItemState() !== "PICKED") {
            playerInventory.push(obj)
            obj.deactivate();
        }
        if (obj.getName() === "roomTransit" && obj.getItemState() === "CLOSED") {
            for (let i = 0; i < playerInventory.length; i++) {
                if (playerInventory[i].name === "key") {
                    playerInventory.splice(i, 1);
                    obj.deactivate();
                }
            }
        } else if (obj.getName() === "roomTransit" && obj.getItemState() === "OPEN") {
            state = "ROOMTRANSIT";
        } else if (obj.getName() === "prompt") {
            obj.showPrompt();
        }
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
       this.x = -5000;
       this.alive = false;
    }
}

const itemArray = [];
class Item {
    constructor(id, itemState, name, x, y, width, height) {
        this.id = id;
        this.itemState = itemState;

        // Pass in vars
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Movement
        this.moveX = false;
        this.moveY = false;
        this.startX;
        this.startY;

        // Image
        this.img;
        this.keySprite = [];
        this.roomTransitSprite = [];
    }

    initialize() {
        this.img = new Image();
        this.keySprite.push("../img/Items/key_hanging.png", "../img/Items/key.png")
        this.roomTransitSprite.push("../img/Items/room_transit_closed.png", "../img/Items/room_transit_open.png");

        switch(this.name) {
            case "key":
                if (this.itemState === "HANGING")
                    this.img.src = this.keySprite[0];
                else if (this.itemState === "FALLING") {
                    this.img.src = this.keySprite[1];
                }
                break;
            case "roomTransit":
                if (this.itemState === "CLOSED") {
                    this.img.src = this.roomTransitSprite[0];
                } else {
                    this.img.src = this.roomTransitSprite[1];
                }
                break;
        }
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

    hit() {
        switch(this.name) {
            case "key":
                if (this.itemState === "HANGING") {
                    this.itemState = "FALLING";
                    this.moveY = true;
                    this.move();
                }
                break;
        }
    }

    move() {
        switch(this.name) {
            case "key":
                if (this.moveY && !this.checkCollision(environmentTileArray, 0, 0, 3, 0)) {
                    this.y += 2;
                } else if (this.checkCollision(environmentTileArray, 0, 0, 3, 0)) {
                    this.img.src = this.keySprite[1];
                    this.width = 64;
                    this.height = 32;
                }
        }
    }

    deactivate() {
        switch(this.name) {
            case "key":
                this.itemState = "PICKED";
                this.x = -5000;
                break;
            case "roomTransit":
                this.itemState = "OPEN"
                this.img.src = this.roomTransitSprite[1];
        }
    }

    getName() {
        return this.name;
    }

    getItemState() {
        return this.itemState;
    }

}

// Environment
const environmentTileArray = [];
class Environment {
    constructor(id, x, y, width, height, color, movesX, movesY, maxDistX, maxDistY, dirX, dirY, speed) {
        this.id = id;
        // Pass in vars
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.movesX = movesX;
        this.movesY = movesY;
        this.maxDistX = maxDistX;
        this.maxDistY = maxDistY;
        this.dirX = dirX;
        this.dirY = dirY;
        this.speed = speed;

        // Position
        this.startX = this.x;
        this.startY = this.y;

        // Collision
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
    }

    movePiece() {
        if (this.x > 0 && this.y > 0 && this.x + this.width < canvas.width && this.y + this.height < canvas.height) {
            // Horizontal movement
            if ((this.movesX && this.dirX === 1 && this.x < this.startX + this.maxDistX) || (this.movesX && this.dirX === -1 && this.x > this.startX - this.maxDistX)) {
                this.x += this.speed * this.dirX;
            }
            // Vertical movement
            if ((this.movesY && this.dirY === 1 && this.y < this.startY + this.maxDistY) || (this.movesY && this.dirY === -1 && this.y > this.startY - this.maxDistY)) {
                this.y += this.speed * this.dirY;
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
const promptArray = [];
class Prompt {
    constructor(text, promptX, promptY, promptWidth, promptHeight, triggerX, triggerY, triggerWidth, triggerHeight) {
        // Pass in vars
        this.text = text;
        this.promptX = promptX;
        this.promptY = promptY;
        this.promptWidth = promptWidth;
        this.promptHeight = promptHeight;
        this.triggerX = triggerX;
        this.triggerY = triggerY;
        this.triggerWidth = triggerWidth;
        this.triggerHeight = triggerHeight;
        this.name = "prompt";

        // Collision
        this.left = this.triggerX;
        this.right = this.triggerX + this.triggerWidth;
        this.top = this.triggerY;
        this.bottom = this.triggerY + this.triggerHeight;
    }

    updateCollision() {
        // Collision
        this.left = this.triggerX;
        this.right = this.triggerX + this.triggerWidth;
        this.top = this.triggerY;
        this.bottom = this.triggerY + this.triggerHeight;
    }

    showPrompt() {
        ctx.font = ctx.font.replace(/\d+px/, "22px");

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(this.promptX - 20, this.promptY - 20, this.promptWidth + 40, this.promptHeight + 40);
        ctx.fillStyle = "orange";
        ctx.fillRect(this.promptX - 10, this.promptY - 10, this.promptWidth + 20, this.promptHeight + 20);
        ctx.fillStyle = "black";
        ctx.fillRect(this.promptX, this.promptY, this.promptWidth, this.promptHeight);
        ctx.fillStyle = "orange";
        ctx.fillText(this.text, this.promptX + 50, this.promptY + 50)
        ctx.closePath();
    }

    getName() {
        return this.name;
    }

}