ToDo
- Object Class (for Key)


Game Structure

=== classes.js ===
Contains the classes that are being defined for the game.

Classes:
- Player
- Enemies ("Lzard")
- Items ("key", "roomtransit", "door")
- Environment (Walls, Floors, Elevators)
- Prompts (Tutorial Boxes, Story Texts)


=== script.js ===








=== OTHER ===

- BACKUP CODE

Precise Collision Array Backup

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