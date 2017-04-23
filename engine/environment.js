/**
 * the environment: grid, sprite-canvas
 * @param {string} spritesFilename [description]
 * @param {array} spritesData coordinate mapping for the sprite-canvas in form of: 
 *                            [ {x: topPositionForSprite1, y: leftPositionForSprite1}, {x: topPositionForSprite2, y: leftPositionForSprite2}...]
 * @param {integer} spriteSize the sprite´s size in pixels (only square sprites are managed for now)
 */
function Environment(spritesFilename, spritesData, spriteSize) {
	this.spritesData = spritesData;
	this.spriteSize = spriteSize;
	this.spriteCanvas = null;
	this.grid = [];
	this._spriteLoading = false;

	/**
	 * initialize the object with the required data
	 */
	this._initialize = function(){
		this._createRandomGrid();
		this._loadSprites(spritesFilename);
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
	 * @return {None}
	 */
	this._loadSprites= function(filename){
		this.spriteCanvas = document.createElement('canvas');
		var spriteCanvasContext = this.spriteCanvas.getContext('2d');
		var drawing = new Image();
		drawing.onload = function() {
	   		spriteCanvasContext.drawImage(drawing,0,0);
	   		//also initialized the background-canvas with the grid created and the sprites loaded
	   		this._spriteLoading = false;
		}.bind(this);
		this._spriteLoading = true;
		drawing.src = filename;
	};

	this._initialize();
}