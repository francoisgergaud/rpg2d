/**
 * the environment: grid, sprite-canvas
 * @param {string} spritesFilename [description]
 * @param {array} tilesData coordinate mapping for the sprite-canvas in form of: 
 *                            [ {x: topPositionForSprite1, y: leftPositionForSprite1}, {x: topPositionForSprite2, y: leftPositionForSprite2}...]
 * @param {integer} tileSize the sprite´s size in pixels (only square sprites are managed for now)
 * @param {object} spriteData the sprite-data (mapping coordinates in the spritesFilename and position of the center)
 * @param {object} spritesInformation list of sprites to render
 */
function Environment(spritesFilename, tilesData, tileSize, spriteData, spritesInformation) {
	this.tilesData = tilesData;
	this.tileSize = tileSize;
	this.spriteData = spriteData;
	this.sprites = [];
	this.spriteCanvas = null;
	this.grid = [];
	this._spriteLoading = false;

	/**
	 * initialize the object with the required data
	 */
	this._initialize = function(){
		this._createRandomGrid();
		this._loadSprites(spritesFilename, spritesInformation);
	};

	/**
	 * random initialization of the environment´s grid
	 */
	this._createRandomGrid = function(){
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
	};

	/**
	 * load the sprite-canvas from a file
	 * @param  {string} filename  the file´s name from which the sprite-canvas will be initialized
	 * @param {array of object} spritesInformation information about the sprite to be created
	 * @return {None}
	 */
	this._loadSprites= function(filename, spritesInformation){
		this.spriteCanvas = document.createElement('canvas');
		var spriteCanvasContext = this.spriteCanvas.getContext('2d');
		var drawing = new Image();
		drawing.onload = function() {
			this.spriteCanvas.width = drawing.width;
			this.spriteCanvas.height = drawing.height;
	   		spriteCanvasContext.drawImage(drawing,0,0);
	   		//also initialized the background-canvas with the grid created and the sprites loaded
	   		this._spriteLoading = false;
	   		spritesInformation.forEach(
	   			function(spriteInformation){
	   				this.sprites.push(
	   					new WorldElement(
		   					spriteInformation.position, 
		   					this.spriteCanvas, 
		   					this.spriteData[spriteInformation.spriteId], 
		   					this.tileSize
		   				)
	   				);
	   			}.bind(this)
	   		);
		}.bind(this);
		this._spriteLoading = true;
		drawing.src = filename;
	};


	this._initialize();
}