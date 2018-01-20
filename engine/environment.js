/**
 * the environment: grid, sprite-canvas
 * @param {HTML canvas} spritesCanvas the canvas containing the tiles and sprites
 * @param {array} tilesData coordinate mapping for the sprite-canvas in form of: 
 *                            [ {x: topPositionForSprite1, y: leftPositionForSprite1}, {x: topPositionForSprite2, y: leftPositionForSprite2}...]
 * @param {integer} tileSize the sprite´s size in pixels (only square sprites are managed for now)
 * @param {object} spriteData the sprite-data (mapping coordinates in the spritesFilename and position of the center)
 * @param {object} spritesInformation list of sprites to render
 * @param {Object[][]} grid the grid representing the environment
 */
function Environment(spritesCanvas, tilesData, tileSize, spriteData, spritesInformation, grid) {
	this.tilesData = tilesData;
	this.tileSize = tileSize;
	this.spriteData = spriteData;
	this.sprites = [];
	this.spriteCanvas = spritesCanvas;
	this.grid = grid;

	/**
	 * initialize the object with the required data
	 * TODO: remove for online mode
	 */
	this._initialize = function(spritesInformation){
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
	};

	this._initialize(spritesInformation);
}

/**
 * The environment factory. USed for lazy constructing. Improve the testability
 */
function EnvironmentFactory(){

	/**
	 * create an environment
	 * @return {Environment} the environment created
	 */
	this.createEnvironment = function(spritesCanvas, tilesData, tileSize, spriteData, spritesInformation, grid){
		return new Environment(spritesCanvas, tilesData, tileSize, spriteData, spritesInformation, grid);
	}
}