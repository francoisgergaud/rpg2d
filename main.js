/**
 * the size of a grid element in pixels
 */
var gridBlockSize = 20;
var refreshPeriod = 50;
var animationPeriod = 50;

function registerEventForPlayableCharacter(character){
	window.addEventListener(
		'keydown',
		function(e){
			switch(e.keyCode){
				case 40:
					//down
					character.changeDirection(0); 
					break;
				case 39: 
					//right
					character.changeDirection(1);
					break;
				case 38:
					//up
					character.changeDirection(2); 
					break;
				case 37: 
					//left
					character.changeDirection(3); 
					break;
			}
			character.currentState.moving = true;
		}
	);
	window.addEventListener(
		'keyup',
		function(e){
			character.currentState.moving = false;
		}
	);
}

function mainLoop(animatedElements, environment, displayCanvas){
	//update tha animated elements
	for(var animatedElement of animatedElements){
		animatedElement.animate();
	}
	//render the environment
	environment.render(displayCanvas);
	//display tha animated elements
	for(var animatedElement of animatedElements){
		animatedElement.render(displayCanvas);
	}
}

function game(canvas){
	var backgroundSpriteSize = 16;
	var viewPortWidth = 40;
	var viewPortHeight = 30;
	canvas.width = backgroundSpriteSize*viewPortWidth;
	canvas.height = backgroundSpriteSize*viewPortHeight;
	//the environment
	var environment = new Object(Environment);
	backgroundSpriteData = [
			{x:0,y:0},
			{x:1,y:0}
		];
	var viewPort = {x:0,y:0,width: canvas.width, height: canvas.height};
	environment.initializeProperties("./resources/tileset4.png", backgroundSpriteData, backgroundSpriteSize, viewPort);
	//the playable character
	var playableCharacter = new Object(Character);
	var animationData = [
   			[{x:6,y:0},{x:7,y:0},{x:8,y:0}],
   			[{x:6,y:2},{x:7,y:2},{x:8,y:2}],
   			[{x:6,y:3},{x:7,y:3},{x:8,y:3}],
   			[{x:6,y:1},{x:7,y:1},{x:8,y:1}]
   		];
	playableCharacter.initializeProperties("./resources/hetalia_sprites_by_carmenmcs.png", animationData, 32, environment);
	registerEventForPlayableCharacter(playableCharacter);
	var animatedElements = [playableCharacter];
	var animationTimer = window.setInterval(mainLoop, animationPeriod, animatedElements, environment, canvas);
}