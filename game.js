// ********** CANVAS *************

var score = 0;
var CANVAS_WIDTH =  700;
var CANVAS_HEIGHT =  400;
var canvasElement = $(`<canvas class="canvasElement" width = ${CANVAS_WIDTH} height = ${CANVAS_HEIGHT}></canvas>`);
var canvas = canvasElement.get(0).getContext('2d');
canvasElement.appendTo('body');

var grd = canvas.createLinearGradient(0,0,800,0);
grd.addColorStop(0,"#FAF8F8");
grd.addColorStop(1,"#17EAD9");



// *********** GAME LOOP ************

var FPS = 30;

// Disable spacebar default page scroll
$(document).keydown(function(e) {
    if (e.which == 32) {
        return false;
    }
});

// Game Loop
var game = setInterval(function() {
	// function update();
	draw();
	update();
}, 1000/FPS);



// ************ PLAYER OBJECT *************

// Declare hero (player) Object
var hero = {	
	active: true,
	color: "yellow",
	width: 32,
	height: 32,
	x: 350,
	y: 300,
	draw: function(){
		canvas.fillStyle = this.color;
		canvas.fillRect (this.x, this.y, this.width, this.height);
	},
	update: function(){
		// Key down functionality
	},
	shoot: function(){
		 missilesActive.push(missile({
            speed: 5,

          }));
	}, 
	die: function(){
		clearInterval(game);
	}
};
	


// ************ ENEMIES *******************

// Array to hold enemies on canvas
var enemiesActive = [];

// Generates instances of enemy object
function enemy(I) {
	I.color = "rgba(255,255,255, 0.3);";
	I.active = true;
	I.age = Math.floor(Math.random() * 80);
	I.yVelocity =  3 * Math.sin(I.age * Math.PI / 64);
	I.x = Math.floor(Math.random() * CANVAS_WIDTH);
	I.y = 0;
	I.width = 32;
	I.height = 32;
	I.inbound = function() {
		if(I.x < CANVAS_WIDTH && I.x > 0 && I.y > 0 && I.y < CANVAS_HEIGHT) {
			return true;
		}
	};
	I.sprite = Sprite("enemy");
	I.draw = function() {
		canvas.fillStyle = I.color;
		canvas.fillRect (I.x, I.y, I.width, I.height);
		this.sprite.draw(canvas, this.x, this.y);
	};
	I.update = function() {
		I.y += I.yVelocity;
		I.active = I.active && I.inbound;
	};
	I.die = function() {
		I.active = false;
	}
	return(I);
};
	
	

// ************ POWERUPS *******************

// Array to hold powerups on canvas
var powerUpActive = [];

// Generates instances of powerup object
function powerUp(I) {
	I.color = "rgba(255,255,255, 0.3);";
	I.active = true;
	I.yVelocity =  9;
	I.x = Math.floor(Math.random() * CANVAS_WIDTH);
	I.y = 0;
	I.width = 32;
	I.height = 32;
	I.inbound = function() {
		if(I.x < CANVAS_WIDTH && I.x > 0 && I.y > 0 && I.y < CANVAS_HEIGHT) {
			return true;
		}
	};
	I.sprite = Sprite("simon");
	I.draw = function() {
		canvas.fillStyle = I.color;
		canvas.fillRect (I.x, I.y, I.width, I.height);
		this.sprite.draw(canvas, this.x, this.y);
	};
	I.update = function() {
		I.y += I.yVelocity;
		I.active = I.active && I.inbound;
	};
	I.die = function() {
		I.active = false;
	}
	return(I);
};
	


// *********** MISSILES *****************

// Array to hold missiles on canvas
var missilesActive = [];

// Generates instances of missile object
function missile(I) {
	I.color= "red";
	I.active= true;
	I.yVelocity= 5;
	I.x= hero.x + hero.width/3;
	I.y= hero.y;
	I.width= 4;
	I.height= 4;
	I.inbound = function() {
		if(I.x < CANVAS_WIDTH && I.x > 0 && I.y > 0 && I.y < CANVAS_HEIGHT) {
			return true;
		}
	};
	I.draw = function() {
		canvas.fillStyle = I.color;
		canvas.fillRect (I.x, I.y, I.width, I.height);
	};
	I.update = function() {
		I.y -= I.yVelocity;
		I.active = I.active && I.inbound;
	};
	I.die = function() {
		I.active = false;
	};
	return(I);
};



// ************ COLLISIONS **************

// Determines whether two objects on canvas have collided
function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}


function handleCollision() {
	// Checks active enemies for collisions with missiles and hero. Deactives on collision.
	enemiesActive.forEach(function(enemy){
		missilesActive.forEach(function(missile){
			if (collides(enemy, missile)) {
			enemy.die();
			missile.die();
			score += 50000;
			updateScore();
		}
		});
		if (collides(enemy, hero)) {
			hero.die();
			$('div').addClass('hinge');
			$('div').css('-webkit-animation-duration', '2s');
			$('div').css('-webkit-animation-delay', '0.1s');
			$('canvas').addClass('shake');
			$('canvas').css('-webkit-animation-duration', '0.5s');
			grd.addColorStop(0,"#FAF8F8");
			grd.addColorStop(1,"#FE4E6E");
		}
	});

	// Checks hero for collision with powerUp. Adds points on collision.
	powerUpActive.forEach(function(powerUp){
		if (collides(powerUp, hero)) {
			powerUp.die();
			score = score + 100000000000;
			updateScore();	
		}
	});
}; // End handleCollisions

// Updates score to screen
function updateScore(){
	$('.score p').text(score);
}

// Main update function to run in game Loop
function update() {

	// Player Movement
	if (keydown.space) {
		hero.shoot();
	}
	if (keydown.left ) {
		hero.x -= 5;
	}
	if (keydown.right) {
		hero.x += 5;
	}
	if (keydown.up) {
		hero.y -= 5;
	}
	if (keydown.down) {
		hero.y += 5;
	}

	hero.x = hero.x.clamp(0, CANVAS_WIDTH - hero.width);
	hero.y = hero.y.clamp(0, CANVAS_HEIGHT - hero.width);

	// Check for collisions, update active states, rewrite arrays with active objects
	hero.update();
	handleCollision();
	enemiesActive.forEach(function(enemy){
		enemy.update();
	});
	missilesActive.forEach(function(missiles){
		missiles.update(); 
	});
	powerUpActive.forEach(function(powerUp){
		powerUp.update(); 
	});
	missilesActive = missilesActive.filter(function(missile){
		return missile.active;
	});
	enemiesActive = enemiesActive.filter(function(enemies){
		return enemies.active;
	});
	powerUpActive = powerUpActive.filter(function(powerUp){
		return powerUp.active;
	});

	// Randomly generate enemies and powerUps
	if (Math.random() < 0.04) {
		enemiesActive.push(enemy({}));
	}
	if (Math.random() < 0.01) {
		powerUpActive.push(powerUp({}));
	}

} // End Update()

// Main Draw function
function draw() {

	// Clear Canvas, redraw hero, enemies, powerups from updated arrays
	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	canvas.fillStyle = grd;
	canvas.fillRect (0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	hero.draw();
	enemiesActive.forEach(function(enemy){
		enemy.draw();
	});
	missilesActive.forEach(function(missile){
		missile.draw();
	});
	powerUpActive.forEach(function(powerUp){
		powerUp.draw();
	});
	hero.sprite = Sprite("player");
	hero.draw = function() {
	  this.sprite.draw(canvas, this.x, this.y);
	};
	handleCollision.draw = function() {
	  this.sprite.draw(canvas, this.x, this.y);
	};

} //End Draw()






