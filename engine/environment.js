/**
 * the environment: grid, sprite-canvas
 * @param {HTML canvas} spritesCanvas the canvas containing the tiles and sprites
 * @param {array} tilesData coordinate mapping for the sprite-canvas in form of: 
 *                            [ {x: topPositionForSprite1, y: leftPositionForSprite1}, {x: topPositionForSprite2, y: leftPositionForSprite2}...]
 * @param {integer} tileSize the sprite´s size in pixels (only square sprites are managed for now)
 * @param {object} spriteData the sprite-data (mapping coordinates in the spritesFilename and position of the center)
 * @param {object} spritesInformation list of sprites to render
 */
function Environment(spritesCanvas, tilesData, tileSize, spriteData, spritesInformation) {
	this.tilesData = tilesData;
	this.tileSize = tileSize;
	this.spriteData = spriteData;
	this.sprites = [];
	this.spriteCanvas = spritesCanvas;
	this.grid = [];

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