var Environment = {
	spriteCanvas: null,
	backgroundCanvas: null,
	grid : [],
	spritesData : null,
	spriteSize : 0,
	spriteLoading : false,
	viewPort: null,

	/**
	 * initialize the object with the required data
	 */
	initializeProperties: function(spritesFilename, spritesData, spriteSize, viewPort){
		this.spritesData = spritesData;
		this.spriteSize = spriteSize;
		this.viewPort = viewPort;
		this.createBufferCanvas();
		this.createRandomGrid();
		this.loadSprites(spritesFilename);
	},
	/**
	 * random initialization for now
	 */
	createRandomGrid: function(){
		for(i = 0; i < 50; i++){
			this.grid.push([]);
			for(j= 0; j < 50; j++){
				randomSpriteId = (Math.random() * 10) > 8 ? 1:0;
				this.grid[i].push(
					{
						spriteId: randomSpriteId
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
		this.backgroundCanvas.setAttribute("id", "backgroundCanvas");
		this.backgroundCanvas.width = (this.spriteSize*50);
		this.backgroundCanvas.height = (this.spriteSize*50);
	},

	render : function(displayCanvas){
		if(!this.spriteLoading){
			if(this.isBackgroungCanvasReady){
				//refresh the background
				displayCanvas.getContext('2d').drawImage(
					this.backgroundCanvas,
					this.viewPort.x,
					this.viewPort.y,
					this.viewPort.width,
					this.viewPort.height,
					0,
					0,
					this.viewPort.width,
					this.viewPort.height);
					/*displayCanvas.getContext('2d').drawImage(
					this.backgroundCanvas,
					0,
					0);*/
			}else{
				for(i = 0; i < this.grid.length; i++){
					for(j= 0; j < this.grid[i].length; j++){
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
				//document.body.appendChild(this.backgroundCanvas);
				this.isBackgroungCanvasReady = true;
			}
		}else{
			this.isBackgroungCanvasReady = false;
		}
	},
	/**
	 * scrolling implementation: center the map on the (x,y)
	 */
	moveViewPort: function(x, y, xOffset, yOffset){
		if(x < this.viewPort.width/2){
			console.log("player reached left limit for scrolling");
		}else if(x > (this.backgroundCanvas.width-this.viewPort.width/2)){
			console.log("player reached right limit for scrolling");
		}else{
			this.viewPort.x+=xOffset;
		}
		if(y < this.viewPort.height/2){
			console.log("player reached top limit for scrolling");
		}else if(y > (this.backgroundCanvas.height-this.viewPort.height/2)){
			console.log("player reached bottom limit for scrolling");
		}else{
			this.viewPort.y+=yOffset;
		}
	}
}