/**
 * the size of a grid element in pixels
 */
var gridBlockSize = 20;
var refreshPeriod = 50;
var animationPeriod = 50;

/**
 * the character class
 */
var Character = {
	spriteCanvas: null,
	destinationCanvas: null,
	backgroundCanvas: null,
	currentState:{
		position: {
			x:0,
			y:0
		},
		direction: 0,
		frame:0,
		velocity: 5,
		moving: false
	},
	animationData:[],
	spriteLoading: false,

	initializeCharacterProperties: function(destinationCanvas, backgroundCanvas, spritesFilename){
		this.backgroundCanvas = backgroundCanvas;
	   	this.destinationCanvas = destinationCanvas;
   		var animationData = [
   			[{x:6,y:0},{x:7,y:0},{x:8,y:0}],
   			[{x:6,y:2},{x:7,y:2},{x:8,y:2}],
   			[{x:6,y:3},{x:7,y:3},{x:8,y:3}],
   			[{x:6,y:1},{x:7,y:1},{x:8,y:1}]
   		];
		this.loadSprites(spritesFilename, animationData);
		this.animationData = animationData;
	},

	loadSprites: function(filename){
		this.spriteCanvas = document.createElement('canvas');
		var spriteCanvasContext = this.spriteCanvas.getContext('2d');
		drawing = new Image();
		drawing.onload = function() {
	   		spriteCanvasContext.drawImage(drawing,0,0);
	   		this.spriteLoading = false;
		}.bind(this);
		this.spriteLoading = true;
		drawing.src = filename;
	},

	animate: function(){
		if(this.currentState.moving){
			var sprites = null;
			switch(this.currentState.direction){
				case 0 :
					this.currentState.position.y +=this.currentState.velocity;
					break;
				case 1:
					this.currentState.position.x +=this.currentState.velocity;
					break;
				case 2:
					this.currentState.position.y -=this.currentState.velocity;
					break;
				case 3:
					this.currentState.position.x -=this.currentState.velocity;
					break;
			}
			//TODO review the sprites array not initializeds
			this.currentState.frame = (this.currentState.frame+1)%this.animationData[this.currentState.direction].length;
			this.drawSprite();
		}
	},

	drawSprite : function(){
		if(!this.spriteLoading){
			var spriteSize = 32;
			this.destinationCanvas.getContext('2d').drawImage(
				this.backgroundCanvas,
				0,
				0
			);
			spriteCoordinate = this.animationData[this.currentState.direction][this.currentState.frame];
			this.destinationCanvas.getContext('2d').drawImage(
				this.spriteCanvas,
				spriteCoordinate.x*spriteSize, 
				spriteCoordinate.y*spriteSize,
				spriteSize,
				spriteSize, 
				this.currentState.position.x, 
				this.currentState.position.y, 
				spriteSize,
				spriteSize
			);
		}
	}
}

/**
 * create the buffer canvas from the size of the original canvas used for display
 */
function createBufferCanvasFronDisplayCanvas(displayCanvas){
	var backgroundCanvas = document.createElement('canvas');
	backgroundCanvas.width = displayCanvas.width;
	backgroundCanvas.height = displayCanvas.height;
	backgroundCanvas.getContext("2d").fillStyle = "rgb(255,255,255)";
	backgroundCanvas.getContext("2d").fillRect (0,0,backgroundCanvas.width,backgroundCanvas.height );
	return backgroundCanvas;
}

function registerEventForPlayableCharacter(character){
	var animationTimer = null;
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

function game(canvas){
	var timer;
	canvas.width = 640;
	canvas.height = 480;
	var backgroundCanvas = createBufferCanvasFronDisplayCanvas(canvas);
	var playableCharacter = new Object(Character);
	playableCharacter.initializeCharacterProperties(canvas, backgroundCanvas, "./resources/hetalia_sprites_by_carmenmcs.png");
	registerEventForPlayableCharacter(playableCharacter);
	var animationTimer = window.setInterval(playableCharacter.animate.bind(playableCharacter), animationPeriod);
}