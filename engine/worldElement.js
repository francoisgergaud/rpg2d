/**
 * a world-element.
 * @param position {object} the position of the element on the map
 * @param spritesFilename {String} the filename containing the sprties (PNG file)
 * @param spriteData {object} : the sprite 's data (coming from the backgroundSpriteMapping)
 * @param {integer} tileSize one square tile's size on the spritesCanvas (spriteData are expressent in tileSize unit)
 */
function WorldElement(position, spriteCanvas, spriteData, tileSize) {

	//we keep the current-state from animatedElement. We do it to preserve the object structure and compare them easily
	//when rendering (depth test). To some point, we may put in common the 'render' method and 'currentState' attribute
	//between these 2 classes 
	this._currentState = {
		position: {
			//the current position in pixel
			x: position.x * tileSize,
			y: position.y * tileSize
		}
	}
	this._girdPosition = position;
	this._spriteCanvas = spriteCanvas;
	this._spriteData = spriteData;
	this._tileSize = tileSize;
	this._spriteLeft = this._currentState.position.x + (this._spriteData.startingPoint.x*this._tileSize);
	this._spriteTop = this._currentState.position.y + (this._spriteData.startingPoint.y*this._tileSize);
	this._spriteWidth = (this._spriteData.spriteDataPosition.width*this._tileSize);
	this._spriteHeight = (this._spriteData.spriteDataPosition.height*this._tileSize);
	this._spriteRight = this._spriteLeft + this._spriteWidth;
	this._spriteBottom = this._spriteTop + this._spriteHeight;
		

	/**
	 * render the character on the renderer´s display canvas
	 * TODO: review it: should we access the viewPort from here... can it be managed directly in the renederer
	 * @return {None}
	 */
	this.render = function(viewPort, displayCanvas){
		if(this._spriteRight > viewPort.x && this._spriteLeft < (viewPort.x+viewPort.width)
			&& this._spriteBottom > viewPort.y && this._spriteTop < (viewPort.y+viewPort.height)){
			displayCanvas.getContext('2d').drawImage(
				this._spriteCanvas,
				this._spriteData.spriteDataPosition.topLeft.x * this._tileSize, 
				this._spriteData.spriteDataPosition.topLeft.y * this._tileSize,
				this._spriteWidth,
				this._spriteHeight, 
				this._spriteLeft - viewPort.x, 
				this._spriteTop - viewPort.y, 
				this._spriteWidth,
				this._spriteHeight
			);
		}
	};

	/**
	 * render a sprite
	 * @param  {object} viewPort the camera position
	 * @param  {object} sprite the sprite to render
	 * @param {HTML canvas} displayCanvas the HTML canvas element
	 * @return {None}
	 */
	/*this.renderSprite = function(viewPort, sprite, displayCanvas){
		var spriteLeft = (sprite.position.x + spriteData.startingPoint.x)*this.tileSize;
		var spriteTop = (sprite.position.y + spriteData.startingPoint.y)*this.tileSize;
		var spriteWidth = (spriteData.spriteDataPosition.width*this.tileSize);
		var spriteHeight = (spriteData.spriteDataPosition.height*this.tileSize);
		var spriteRight = spriteLeft + spriteWidth;
		var spriteBottom = spriteTop + spriteHeight;
		//if(spriteRight < viewPort.x || spriteLeft > (viewPort.x+viewPort.width)
		//	|| spriteBottom < viewPort.y ||  spriteTop > (viewPort.y+viewPort.height))
		if(spriteRight > viewPort.x && spriteLeft < (viewPort.x+viewPort.width)
			&& spriteBottom > viewPort.y && spriteTop < (viewPort.y+viewPort.height)){
			displayCanvas.getContext('2d').drawImage(
				this.spriteCanvas,
				spriteData.spriteDataPosition.topLeft.x * this.tileSize, 
				spriteData.spriteDataPosition.topLeft.y * this.tileSize,
				spriteWidth,
				spriteHeight, 
				spriteLeft-viewPort.x, 
				spriteTop-viewPort.y, 
				spriteWidth,
				spriteHeight
			);
		}
	}*/
}