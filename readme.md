ToDo
- Check to include controller controls
- Create "Select Level" Screen (if enough time)

===
- Possible to get player stuck with no recording after pausing on frame 0
- Restarting after death often does not bring player back to beginning due to gameRec being cut off, have to remember beginning pos
- globalRec recordings cut off, find fix
===

Game Structure

=== classes.js ===
Contains the classes that are being defined for the game.

Classes:
- Player
- Enemies ("Lzard", "Spikes", "Boss")
- Items ("key", "roomtransit", "door")
- Environment (Walls, Floors, Elevators)
- Prompts (Tutorial Boxes, Story Texts)


=== script.js ===


A couple of questions:
- Include buttons in canvas?
- Sprite flickering?






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