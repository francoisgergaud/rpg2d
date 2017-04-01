/**
 * the size of a grid element in pixels
 */
var gridBlockSize = 20;
var refreshPeriod = 50;
var animationPeriod = 50;

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
	animationData:{
		up:[],
		down:[],
		left:[],
		right:[]
	},
	animate: function(){
		if(this.currentState.moving){
			var sprites = null;
			if(this.currentState.direction == 0){
				this.currentState.frame = (this.currentState.frame+1)%this.animationData.down.length;
				this.currentState.position.y +=this.currentState.velocity;
				sprites = this.animationData.down;
			}else if(this.currentState.direction == 1){
				this.currentState.frame = (this.currentState.frame+1)%this.animationData.right.length;
				this.currentState.position.x +=this.currentState.velocity;
				sprites = this.animationData.right;
			}else if(this.currentState.direction == 2){
				this.currentState.frame = (this.currentState.frame+1)%this.animationData.up.length;
				this.currentState.position.y -=this.currentState.velocity;
				sprites = this.animationData.up;
			}else if(this.currentState.direction == 3){
				this.currentState.frame = (this.currentState.frame+1)%this.animationData.left.length;
				this.currentState.position.x -=this.currentState.velocity;
				sprites = this.animationData.left;
			}
			this.drawSprite(sprites[this.currentState.frame].x,sprites[this.currentState.frame].y);
		}
	},
	registerEvents: function(){
		var animationTimer = null;
		var character = this;
		window.addEventListener(
			'keydown',
			function(e){
				switch(e.keyCode){
					case 40: character.currentState.direction=0; break;
					case 39: character.currentState.direction=1; break;
					case 38: character.currentState.direction=2; break;
					case 37: character.currentState.direction=3; break;
				}
				character.currentState.moving = true;
			});
		window.addEventListener(
			'keyup',
			function(e){
				character.currentState.moving = false;
			});
		var animationTimer = window.setInterval(character.animate.bind(character), animationPeriod);
			
	},
	drawSprite : function(spriteRowNumber, spriteColumnNumber){
		var spriteSize = 32;
		this.destinationCanvas.getContext('2d').drawImage(
			this.backgroundCanvas,
			0,
			0
		);
		this.destinationCanvas.getContext('2d').drawImage(
			this.spriteCanvas,
			spriteRowNumber*spriteSize, 
			spriteColumnNumber*spriteSize,
			spriteSize,
			spriteSize, 
			this.currentState.position.x, 
			this.currentState.position.y, 
			spriteSize,
			spriteSize
		);
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

function loadSprites(spriteFilePath, destinationCanvas, backgroundCanvas){
	var spriteCanvas = document.createElement('canvas');
	var context=spriteCanvas.getContext('2d');
	drawing = new Image();
	drawing.onload = function() {
   		context.drawImage(drawing,0,0);
   		var firstCharacter = new Object(Character);
   		firstCharacter.spriteCanvas = spriteCanvas;
   		firstCharacter.backgroundCanvas = backgroundCanvas;
   		firstCharacter.destinationCanvas = destinationCanvas;
   		firstCharacter.animationData.down = [{x:6,y:0},{x:7,y:0},{x:8,y:0}];
   		firstCharacter.animationData.left =[{x:6,y:1},{x:7,y:1},{x:8,y:1}];
   		firstCharacter.animationData.right = [{x:6,y:2},{x:7,y:2},{x:8,y:2}];
   		firstCharacter.animationData.up = [{x:6,y:3},{x:7,y:3},{x:8,y:3}];
		firstCharacter.registerEvents();
	};
	drawing.src = spriteFilePath;

}


function game(canvas){
	var timer;
	canvas.width = 640;
	canvas.height = 480;
	var backgroundCanvas = createBufferCanvasFronDisplayCanvas(canvas);
	var spritesCanvas = loadSprites("./resources/hetalia_sprites_by_carmenmcs.png", canvas, backgroundCanvas);
}