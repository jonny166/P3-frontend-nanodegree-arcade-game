// Enemies our player must avoid
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = getSpeed(); 
    this.row = Math.ceil((Math.random() * 3)) + 1;
    this.x = 0; //default
    this.y = 0; //default
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt * 100);
    this.y = (this.row - 1) * ctx.canvas.row_height - 10;
    if (this.x > ctx.canvas.width){
	this.x = 0; //return to starting position
	this.speed = getSpeed(); //pick a new speed for the enemy
    }
    
    //Let's see if we have collided with the player
    if (player.row === this.row){
	console.log(this.row + "is the row we are on");
	if (Math.abs(player.x - this.x) < 10){
	    player.row = 5;
	    player.col = 3;
	}
    }

}

function getSpeed() {
    return (Math.random() * 4) + 1 //random number between 1 and 5
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    //console.log("canvas " + ctx.canvas.col_width + " " + ctx.canvas.row_height);
    //console.log("enemy " + this.x + " " + this.y);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-princess-girl.png';
    this.row = 5;
    this.col = 3;
    this.x = 0; //default
    this.y = 0; //default
}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


Player.prototype.update = function(dt) {
    this.x = (this.col - 1) * ctx.canvas.col_width;
    this.y = (this.row - 1) * ctx.canvas.row_height - 10;
    if (this.row === 1){
	//You won!
	this.row = 5; //return to starting position
	this.col = 3;
    }
}


Player.prototype.handleInput = function(input){
    if (input === 'left'){
	this.col = Math.max(this.col - 1, 1);
    }
    if (input === 'right'){
	this.col = Math.min(this.col + 1, ctx.canvas.numCols);
    }
    if (input === 'up'){
	this.row = Math.max(this.row - 1, 1);
    }
    if (input === 'down'){
	this.row = Math.min(this.row + 1, ctx.canvas.numRows);
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
