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

	initializeProperties: function(spritesFilename, animationData, spriteSize){
		this.animationData = animationData;
		this.spriteSize = spriteSize;
		this.loadSprites(spritesFilename);
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
				this.currentState.position.x, 
				this.currentState.position.y, 
				this.spriteSize,
				this.spriteSize
			);
		}
	}
}