/**
 * an animated element. It will be used as a based class to contain common fucntionalities shared between animated elements
 * @param id {string} character´s identifier
 * @param spritesFilename {String} the filename containing the sprties (PNG file)
 * @param animationData {Array} : contains the sprite-data (TODO: add more details about the structure)
 * @param spriteWidth {Integer} the sprite's width in pixel
 * @param spriteHeight {Integer} the sprite's height in pixel
 */
function AnimatedElement(id, spritesFilename, animationData, spriteWidth, spriteHeight) {

	this._id = id;
	this._animationData = animationData;
	this._spriteCanvas = null;
	this._spriteWidth = spriteWidth;
	this._spriteHeight = spriteHeight;
	this._currentState = {
		position: {
			x:0,
			y:0
		},
		direction: 0,
		frame:0,
		velocity: 5,
		moving: false
	};

	this._spriteLoading = false;
	

	/**
	 * the listeners to be executed when animate method is executed
	 * @type {Array}
	 */
	//TODO: review the protoype inheritance. The same prototype object is used if not overriden in the child
	//classes... it works more like a static element...
	this._animateListeners = [];

	/**
	 * initialization method. Is called after the basic-properties initialization
	 * @return {[type]} [description]
	 */
	this._initialize = function(){
		this._loadSprites(spritesFilename);
	};

	/**
	 * load the sprtie-canvas from a file
	 * @param  {string} filename file's name from which the sprite-canvas will be initialized
	 * @return {None} 
	 */
	this._loadSprites= function(filename){
		this._spriteCanvas = document.createElement('canvas');
		var _spriteCanvasContext = this._spriteCanvas.getContext('2d');
		var drawing = new Image();
		drawing.onload = function() {
			this._spriteCanvas.width = drawing.width;
			this._spriteCanvas.height = drawing.height;
	   		_spriteCanvasContext.drawImage(drawing,0,0);
	   		this._spriteLoading = false;
		}.bind(this);
		this._spriteLoading = true;
		drawing.src = filename;
	};

	/**
	 * process the events for this character
	 * @return {None}
	 */
	this.animate = function(){
		if(this._currentState.moving){
			var sprites = null;
			var xOffset = 0;
			var yOffset = 0;
			switch(this._currentState.direction){
				case 0 :
					yOffset = this._currentState.velocity;
					break;
				case 1:
					xOffset = this._currentState.velocity;
					break;
				case 2:
					yOffset = 0 - this._currentState.velocity;
					break;
				case 3:
					xOffset = 0 - this._currentState.velocity;
					break;
			}
			for(var animateListener of this._animateListeners){
				animateListener(this._currentState.position.x, this._currentState.position.y, xOffset, yOffset);
			}
			this._currentState.position.x +=xOffset;
			this._currentState.position.y +=yOffset;
			this._currentState.frame = (this._currentState.frame+1)%this._animationData[this._currentState.direction].length;	
		}
	};

	/**
	 * render the character on the renderer´s display canvas
	 * TODO: review it: should we access the viewPort from here... can it be managed directly in the renederer
	 * @return {None}
	 */
	this.render = function(viewPort, displayCanvas){
		if(!this._spriteLoading){
			var spriteCoordinate = this._animationData[this._currentState.direction][this._currentState.frame];
			displayCanvas.getContext('2d').drawImage(
				this._spriteCanvas,
				spriteCoordinate.x*this._spriteWidth, 
				spriteCoordinate.y*this._spriteHeight,
				this._spriteWidth,
				this._spriteHeight, 
				(this._currentState.position.x)-viewPort.x, 
				(this._currentState.position.y)-viewPort.y, 
				this._spriteWidth,
				this._spriteHeight
			);
		}
	};

	/**
	 * add a listener for the animate method
	 * @param {object} listener listener to add to the list
	 */
	this.addAnimateListener = function(listener){
		this._animateListeners.push(listener);
	}

	this._initialize();
}