var Character = {
	spriteCanvas: null,
	spriteSize: 0,
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
	environment: null,

	initializeProperties: function(spritesFilename, animationData, spriteSize, environment){
		this.animationData = animationData;
		this.spriteSize = spriteSize;
		this.loadSprites(spritesFilename);
		this.environment = environment;
	},

	loadSprites: function(filename){
		this.spriteCanvas = document.createElement('canvas');
		var spriteCanvasContext = this.spriteCanvas.getContext('2d');
		var drawing = new Image();
		drawing.onload = function() {
	   		spriteCanvasContext.drawImage(drawing,0,0);
	   		this.spriteLoading = false;
		}.bind(this);
		this.spriteLoading = true;
		drawing.src = filename;
	},

	changeDirection: function(direction){
		this.currentState.direction=direction; 
	},

	animate: function(){
		if(this.currentState.moving){
			var sprites = null;
			var xOffset = 0;
			var yOffset = 0;
			switch(this.currentState.direction){
				case 0 :
					yOffset = this.currentState.velocity;
					break;
				case 1:
					xOffset = this.currentState.velocity;
					break;
				case 2:
					yOffset = 0 - this.currentState.velocity;
					break;
				case 3:
					xOffset = 0 - this.currentState.velocity;
					break;
			}
			this.environment.moveViewPort(this.currentState.position.x, this.currentState.position.y, xOffset, yOffset);
			this.currentState.position.x +=xOffset;
			this.currentState.position.y +=yOffset;
			this.currentState.frame = (this.currentState.frame+1)%this.animationData[this.currentState.direction].length;
		}
	},

	render : function(destinationCanvas){
		if(!this.spriteLoading){
			spriteCoordinate = this.animationData[this.currentState.direction][this.currentState.frame];
			destinationCanvas.getContext('2d').drawImage(
				this.spriteCanvas,
				spriteCoordinate.x*this.spriteSize, 
				spriteCoordinate.y*this.spriteSize,
				this.spriteSize,
				this.spriteSize, 
				(this.currentState.position.x)-this.environment.viewPort.x, 
				(this.currentState.position.y)-this.environment.viewPort.y, 
				this.spriteSize,
				this.spriteSize
			);
		}
	}
}