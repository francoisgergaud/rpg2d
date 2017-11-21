/**
 * a playable character. The view-port will be centered on it
 * @param id {string} character´s identifier
 * @param spritesFilename {String} the filename containing the sprties (PNG file)
 * @param animationData {Array} : contains the sprite-data (TODO: add more details about the structure)
 * @param sspriteSize {Integer} the sprite-size (only sprite with square shape are managed)
 */
function Character(id, spritesFilename, animationData, spriteSize){
	this._animationData = animationData;
	this._spriteCanvas = null;
	this._spriteSize = spriteSize;
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
	this._id = id;

	/**
	 * the listeners to be executed when animate method is executed
	 * @type {Array}
	 */
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
	   		_spriteCanvasContext.drawImage(drawing,0,0);
	   		this._spriteLoading = false;
		}.bind(this);
		this._spriteLoading = true;
		drawing.src = filename;
	};

	/**
	 * cmove an animated element into a direction
	 * @param  {integer} direction an integer representing the direction. 0: down, 1: right, 2: up, 3: left 
	 * @return {[None} 
	 */
	this.move = function(direction){
		this._currentState.direction=direction;
		this._currentState.moving = true;
	};

	/**
	 * stop the character
	 * @return {None}
	 */
	this.stop = function(){
		this._currentState.moving = false;
	};

	/**
	 * process the events for this character
	 * @return {None}
	 */
	this.animate = function(){
		this.processEvents();
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
				spriteCoordinate.x*this._spriteSize, 
				spriteCoordinate.y*this._spriteSize,
				this._spriteSize,
				this._spriteSize, 
				(this._currentState.position.x)-viewPort.x, 
				(this._currentState.position.y)-viewPort.y, 
				this._spriteSize,
				this._spriteSize
			);
		}
	};

	/**
	 * process the events and change the character state. Executed at the beginning of each animate call
	 * @return {None}
	 */
	this.processEvents = function(){

	}

	this._initialize();
}

//inherit the Character object from animatedElement object
Character.prototype = new AnimatedElement();