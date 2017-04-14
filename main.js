/**
 * the size of a grid element in pixels
 */
var gridBlockSize = 20;
var refreshPeriod = 50;
var animationPeriod = 50;

/**
 * map the keyboard arrows with the playable character actions
 * @param  {Character} character to set a playable
 * @return {None}
 */
function registerEventForPlayableCharacter(character){
	window.addEventListener(
		'keydown',
		function(e){
			switch(e.keyCode){
				case 40:
					//down
					character.move(0); 
					break;
				case 39: 
					//right
					character.move(1);
					break;
				case 38:
					//up
					character.move(2); 
					break;
				case 37: 
					//left
					character.move(3); 
					break;
			}
		}
	);
	window.addEventListener(
		'keyup',
		function(e){
			character.stop();
		}
	);
}

/**
 * initialize the game
 * @param  {Canvas} canvas the canvas DOM Element used for rendering
 * @return {None} 
 */
function game(canvas){
	var backgroundSpriteSize = 16;
	var viewPortWidth = 40;
	var viewPortHeight = 30;
	canvas.width = backgroundSpriteSize*viewPortWidth;
	canvas.height = backgroundSpriteSize*viewPortHeight;
	//the environment
	backgroundSpriteData = [
			{x:0,y:0},
			{x:1,y:0}
		];
	var viewPort = {x:0,y:0,width: canvas.width, height: canvas.height};
	var environment = new Environment("./resources/tileset4.png", backgroundSpriteData, backgroundSpriteSize);
	//the playable character
	var animationData = [
   			[{x:6,y:0},{x:7,y:0},{x:8,y:0}],
   			[{x:6,y:2},{x:7,y:2},{x:8,y:2}],
   			[{x:6,y:3},{x:7,y:3},{x:8,y:3}],
   			[{x:6,y:1},{x:7,y:1},{x:8,y:1}]
   		];
	var playableCharacter = new Character("./resources/hetalia_sprites_by_carmenmcs.png", animationData, 32);
	registerEventForPlayableCharacter(playableCharacter);
	var animatedElements = [playableCharacter];
	var renderer = new Renderer(animatedElements, environment, canvas, viewPort);
	var animationTimer = window.setInterval(renderer.main.bind(renderer), animationPeriod);
}