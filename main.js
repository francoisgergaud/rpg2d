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
					character.currentState.direction=0; 
					break;
				case 39: 
					//right
					character.currentState.direction=1;
					break;
				case 38:
					//up
					character.currentState.direction=2; 
					break;
				case 37: 
					//left
					character.currentState.direction=3; 
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
	var timer;
	canvas.width = 640;
	canvas.height = 480;
	var playableCharacter = new Object(Character);
	var animationData = [
   			[{x:6,y:0},{x:7,y:0},{x:8,y:0}],
   			[{x:6,y:2},{x:7,y:2},{x:8,y:2}],
   			[{x:6,y:3},{x:7,y:3},{x:8,y:3}],
   			[{x:6,y:1},{x:7,y:1},{x:8,y:1}]
   		];
	playableCharacter.initializeProperties("./resources/hetalia_sprites_by_carmenmcs.png", animationData, 32);
	registerEventForPlayableCharacter(playableCharacter);
	var environment = new Object(Environment);
	backgroundSpriteData = [
			{x:0,y:0},
			{x:1,y:0}
		];
	environment.initializeProperties("./resources/tileset4.png", backgroundSpriteData, 16);

	var animatedElements = [playableCharacter];
	var animationTimer = window.setInterval(mainLoop, animationPeriod, animatedElements, environment, canvas);
}