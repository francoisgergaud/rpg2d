var Environment = {
	spriteCanvas: null,
	backgroundCanvas: null,
	grid : [],
	spritesData : null,
	spriteSize : 0,
	spriteLoading : false,

	initializeProperties: function(spritesFilename, spritesData, spriteSize){
		this.spritesData = spritesData;
		this.spriteSize = spriteSize;
		this.createBufferCanvas();
		this.createGrid();
		this.loadSprites(spritesFilename);
	},
	/**
	 * random initialization for now
	 */
	createGrid: function(){
		for(i = 0; i < 100; i++){
			this.grid.push([]);
			for(j= 0; j < 100; j++){
				randomSpriteId = (Math.random() * 10) > 7 ? 0:1;
				this.grid[i].push(
					{
						spriteId: randomSpriteId,
						isAccesible: true
					}
				);
			}
		}
	},

	loadSprites: function(filename){
		this.spriteCanvas = document.createElement('canvas');
		var spriteCanvasContext = this.spriteCanvas.getContext('2d');
		var drawing = new Image();
		drawing.onload = function() {
	   		spriteCanvasContext.drawImage(drawing,0,0);
	   		//also initialized the background-canvas with the grid created and the sprites loaded
	   		this.spriteLoading = false;
		}.bind(this);
		this.spriteLoading = true;
		drawing.src = filename;
		this.isBackgroungCanvasReady = false;
	},

	/**
	 * create the buffer canvas from the size of the original canvas used for display
	 */
	createBufferCanvas: function(){
		this.backgroundCanvas = document.createElement('canvas');
		this.backgroundCanvas.width = 60*this.spriteSize;
		this.backgroundCanvas.height = 60*this.spriteSize;
		//this.backgroundCanvas.getContext("2d").fillStyle = "rgb(255,255,255)";
		//this.backgroundCanvas.getContext("2d").fillRect (0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
	},

	render : function(displayCanvas){
		if(!this.spriteLoading){
			if(this.isBackgroungCanvasReady){
				//refresh the background
				displayCanvas.getContext('2d').drawImage(this.backgroundCanvas,0,0);
			}else{
				for(i = 0; i < 100; i++){
					for(j= 0; j < 100; j++){
						this.backgroundCanvas.getContext('2d').drawImage(
							this.spriteCanvas,
							this.spritesData[this.grid[i][j].spriteId].x*this.spriteSize, 
							this.spritesData[this.grid[i][j].spriteId].y*this.spriteSize,
							this.spriteSize,
							this.spriteSize, 
							i * this.spriteSize, 
							j * this.spriteSize, 
							this.spriteSize,
							this.spriteSize
						);
					}
				}
				this.isBackgroungCanvasReady = true;
			}
		}else{
			this.isBackgroungCanvasReady = false;
		}
	}
}