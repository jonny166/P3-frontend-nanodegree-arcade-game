// Enemies our player must avoid
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt * 100);
    this.y = (this.row - 1) * ctx.canvas.row_height - 10;

    if (this.x > ctx.canvas.width){
	//gone off the screen, start over
	this.reset();
    }
    
    //Let's see if we have collided with the player
    if (player.row === this.row){
	if (Math.abs(player.x - this.x) < 10){
	    console.log("nom nom nom");
	    player.reset();
	    player.lives--;
	    if (player.lives === 0) {
		console.log("You are dead!");
		player.score = 0;
		player.lives = 3;
	    }
	}
    }
};

//Generate a new random row and speed for this enemy
Enemy.prototype.reset = function() {
    this.speed = (Math.random() * 4) + 1; //random nbr b/w 1 and 5
    this.row = Math.ceil((Math.random() * 3)) + 1; //random nbr b/w 2 and 4
    this.x = 0;
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprites = ['images/char-princess-girl.png',
		    'images/char-pink-girl.png',
		    'images/char-cat-girl.png',
		    'images/char-horn-girl.png',
		    'images/char-boy.png',];
    this.spriteIndex = 0;
    this.reset();
    this.score = 0;
    this.lives = 3;
};

Player.prototype.swapSprite = function() {
    this.spriteIndex = (this.spriteIndex + 1) % this.sprites.length;
    console.log("new sprite index " + this.spriteIndex);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprites[this.spriteIndex]), this.x, this.y);
};


Player.prototype.update = function(dt) {
    this.x = (this.col - 1) * ctx.canvas.col_width;
    this.y = (this.row - 1) * ctx.canvas.row_height - 10;
    if (this.row === 1){
	console.log("A winner is you!");
	this.reset();
	this.score += 2;
    }
    else {
	this.checkForGem();
    }
};

// Put player in start position
Player.prototype.reset = function() {
    this.col = Math.ceil(ctx.canvas.numCols / 2);
    this.row = ctx.canvas.numRows;
};


// check if player is on same square as a gem
Player.prototype.checkForGem = function() {
    var player = this;
    gems.forEach(function(gem){
	if ((gem.row === player.row) && (gem.col === player.col)){
	    player.score += 1;
	    gem.reset();
	    console.log ("ooh shiny!");
	    }
    });
};


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
};

Player.prototype.handleClick = function(input){
    console.log("click  " + input.x + " :" + input.y);
    console.log("player " + (this.x + ctx.canvas.col_width/2) + " :" + (this.y + ctx.canvas.row_height));
    if (Math.abs(input.x - (this.x + ctx.canvas.col_width/2)) < 50 &&
	Math.abs(input.y - (this.y + ctx.canvas.row_height)) < 50) {
	console.log("You clicked me!");
	this.swapSprite();
    }
};


var Gem = function() {
    this.reset(); 
}

Gem.prototype.reset = function() {
    var color = Math.ceil((Math.random() * 3)); //random nbr b/w 1 and 3
    var colorMap = {1: 'images/Gem Green.png',
		    2: 'images/Gem Blue.png',
		    3: 'images/Gem Orange.png',
		    }
    this.sprite = colorMap[color];
    this.row = Math.ceil((Math.random() * 3)) + 1; //random nbr b/w 2 and 4 
    this.col = Math.ceil((Math.random() * ctx.canvas.numCols)); //random nbr b/w 0 and numCols
    this.x = (this.col - 1) * ctx.canvas.col_width + (ctx.canvas.col_width / 6);
    this.y = (this.row - 1) * ctx.canvas.row_height + (ctx.canvas.row_height / 2);
    this.height = ctx.canvas.row_height;
    this.width =ctx.canvas.col_width * .6;
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};


var Score = function() {
    ctx.font="30px Verdana";
    ctx.fillStyle = 'darkblue';
    this.lifeSprite = 'images/Heart.png';
    this.lifeWidth = 20;
    this.lifeHeight = 30;
};

Score.prototype.render = function() {
    ctx.fillText("Score: " + player.score,10,
		 ctx.canvas.row_height * (ctx.canvas.numRows));
    for (i = 0; i < player.lives; i++) {
	ctx.drawImage(Resources.get(this.lifeSprite), 25 * i + 10, 
		      ctx.canvas.row_height * (ctx.canvas.numRows),
		     this.lifeWidth, this.lifeHeight);
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();
var gems = [new Gem(), new Gem()];
var score = new Score();

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

// this listens for mouse clicks to change the character
document.addEventListener('click', function(e) {
    player.handleClick(ctx.canvas.relMouseCoords(e));
});




