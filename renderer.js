/**
 * the engine. contains the the main loop with process the events and render the scene
 * @param {[type]} _animatedElements animated-elements which are part of the scene
 * @param {[type]} _environment      environment for the scene
 * @param {[type]} _displayCanvas    the canvas where the scene will be rendered
 * @param {[type]} _viewPort         the view-port (to manage camera moves)
 */
function Renderer (animatedElements, environment, displayCanvas, viewPort){
	this._animatedElements = animatedElements;
	this._environment = environment;
	this._displayCanvas = displayCanvas;
	this._viewPort = viewPort;
	this._isBackgroungCanvasReady = false;
	this._backgroundCanvas = null;

	/**
	 * initialize the renderer after the basic-properties setup
	 * @return {None}
	 */
	this._initialize = function(){
		for(var animatedElement of this._animatedElements){
			animatedElement.registerRenderer(this);
		}
		this._createBufferCanvas();
	};

	/**
	 * create the buffer canvas for double-buffering purpose
	 * @return {None}
	 */
	this._createBufferCanvas = function(){
		this._backgroundCanvas = document.createElement('canvas');
		//this._backgroundCanvas.setAttribute("id", "_backgroundCanvas");
		this._backgroundCanvas.width = this._displayCanvas.width+this._environment.spriteSize;
		this._backgroundCanvas.height = this._displayCanvas.height+this._environment.spriteSize;
		this.backgroundViewPort={
			x: 0,
			y: 0,
			width: (parseInt(this._displayCanvas.width/this._environment.spriteSize))+1,
			height: (parseInt(this._displayCanvas.height/this._environment.spriteSize))+1,
		};
	};

	/**
	 * render the environment.
	 * TODO: review when the environment will contains differents layers
	 * @return {None}
	 */
	this._render_environment = function(){
		if(!this._environment.spriteLoading){
			if(this._isBackgroungCanvasReady){
				//refresh the background
				var xOffset = this._viewPort.x-(this.backgroundViewPort.x*this._environment.spriteSize);
				var yOffset = this._viewPort.y-(this.backgroundViewPort.y*this._environment.spriteSize);
				this._displayCanvas.getContext('2d').drawImage(
					this._backgroundCanvas,
					xOffset,
					yOffset,
					this._viewPort.width,
					this._viewPort.height,
					0,
					0,
					this._viewPort.width,
					this._viewPort.height
				);
			}else{
				this.initializeBackgroundCanvas();
				//document.body.appendChild(this._backgroundCanvas);
				this._isBackgroungCanvasReady = true;
			}
		}else{
			this._isBackgroungCanvasReady = false;
		}
	};

	/**
	 * the main loop: process the events and render the scene
	 * @return {None}
	 */
	this.main = function(){
		//update tha animated elements
		for(var animatedElement of this._animatedElements){
			animatedElement.animate();
		}
		this._render();
	};

	/**
	 * render the scene
	 * @return {None}
	 */
	this._render = function(){
		//render the environment
		this._render_environment();
		//display tha animated elements
		for(var animatedElement of this._animatedElements){
			animatedElement.render();
		}
	};

	/**
	 * move the viewPort from (x,y) to (x+xOffset,y+yOffset) if it does not overboard the background canvas
	 * @param  {integer} x       x origin-position for the top-left corner
	 * @param  {integer} y       y origin-position for the top-let corner
	 * @param  {integer} xOffset distance in pixel to move the x-origin
	 * @param  {integer} yOffset distance in pixel to move the y-origin
	 * @return {None}
	 */
	this.moveViewPort = function(x, y, xOffset, yOffset){
		var maxWidth = this._environment.grid.length*this._environment.spriteSize;
		var maxHeight = this._environment.grid[0].length*this._environment.spriteSize;
		var viewPortCenterX = this._viewPort.width/2 ;
		var viewPortCenterY = this._viewPort.height/2 ;
		if(x > viewPortCenterX  && x < (maxWidth-viewPortCenterX)){
			var xSprtieDistance = parseInt((this._viewPort.x+xOffset)/this._environment.spriteSize) - parseInt(this._viewPort.x/this._environment.spriteSize);
			if(xSprtieDistance == 1){
				//move background-canvas to right
				this.moveBackgroundCanvasToRight();
			}
			if(xSprtieDistance == -1){
				//move background-canvas to right
				this.moveBackgroundCanvasToLeft();
			}
			this._viewPort.x+=xOffset;
		}
		if(y > viewPortCenterY && y < (maxHeight-viewPortCenterY)){
			var ySprtieDistance = parseInt((this._viewPort.y+yOffset)/this._environment.spriteSize) - parseInt(this._viewPort.y/this._environment.spriteSize);
			if(ySprtieDistance == 1){
				//move background-canvas to right
				this.moveBackgroundCanvasToBottom();
			}
			if(ySprtieDistance == -1){
				//move background-canvas to right
				this.moveBackgroundCanvasToTop();
			}
			this._viewPort.y+=yOffset;
		}
	};

	/**
	 * move the background canvas to the right 
	 * @return {[type]} [description]
	 */
	this.initializeBackgroundCanvas = function(){
		for(i = 0; i < this.backgroundViewPort.width; i++){
			for(j= 0; j < this.backgroundViewPort.height; j++){
				this._backgroundCanvas.getContext('2d').drawImage(
					this._environment.spriteCanvas,
					this._environment.spritesData[this._environment.grid[i][j].spriteId].x*this._environment.spriteSize, 
					this._environment.spritesData[this._environment.grid[i][j].spriteId].y*this._environment.spriteSize,
					this._environment.spriteSize,
					this._environment.spriteSize, 
					i * this._environment.spriteSize, 
					j * this._environment.spriteSize, 
					this._environment.spriteSize,
					this._environment.spriteSize
				);
			}
		}
	};

	/**
	 * move the background canvas to the right 
	 * @return {[type]} [description]
	 */
	this.moveBackgroundCanvasToRight = function(){
		//move background-canvas to left
		this._backgroundCanvas.getContext('2d').drawImage(
			this._backgroundCanvas,
			0-this._environment.spriteSize,
			0
		);
		//and add the missing right part
		var gridColumnIndex = this.backgroundViewPort.x+this.backgroundViewPort.width -1;
		for(j=0; j< this._environment.grid[gridColumnIndex].length; j++){
			//move background-canvas to left
			this._backgroundCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.spritesData[this._environment.grid[gridColumnIndex][j].spriteId].x*this._environment.spriteSize, 
				this._environment.spritesData[this._environment.grid[gridColumnIndex][j].spriteId].y*this._environment.spriteSize,
				this._environment.spriteSize,
				this._environment.spriteSize, 
				(this.backgroundViewPort.width - 1) * this._environment.spriteSize, 
				j * this._environment.spriteSize, 
				this._environment.spriteSize,
				this._environment.spriteSize
			);
		}
		this.backgroundViewPort.x++;
	};

	/**
	 * move the background canvas to the left 
	 * @return {None}
	 */
	this.moveBackgroundCanvasToLeft = function(){
		//move background-canvas to left
		this._backgroundCanvas.getContext('2d').drawImage(
			this._backgroundCanvas,
			this._environment.spriteSize,
			0
		);
		//and add the missing right part
		var gridColumnIndex = this.backgroundViewPort.x;
		for(j=0; j< this._environment.grid[gridColumnIndex].length; j++){
			//move background-canvas to left
			this._backgroundCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.spritesData[this._environment.grid[gridColumnIndex][j].spriteId].x*this._environment.spriteSize, 
				this._environment.spritesData[this._environment.grid[gridColumnIndex][j].spriteId].y*this._environment.spriteSize,
				this._environment.spriteSize,
				this._environment.spriteSize, 
				0,
				j * this._environment.spriteSize, 
				this._environment.spriteSize,
				this._environment.spriteSize
			);
		}
		this.backgroundViewPort.x--;
	};

	/**
	 * move the background canvas to the bottom 
	 * @return {None}
	 */
	this.moveBackgroundCanvasToBottom = function(){
		//move background-canvas to left
		this._backgroundCanvas.getContext('2d').drawImage(
			this._backgroundCanvas,
			0,
			0-this._environment.spriteSize
		);
		//and add the missing right part
		var gridLineIndex = this.backgroundViewPort.y+this.backgroundViewPort.height -1;
		for(i=0; i< this._environment.grid.length; i++){
			//move background-canvas to left
			this._backgroundCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.spritesData[this._environment.grid[i][gridLineIndex].spriteId].x*this._environment.spriteSize, 
				this._environment.spritesData[this._environment.grid[i][gridLineIndex].spriteId].y*this._environment.spriteSize,
				this._environment.spriteSize,
				this._environment.spriteSize, 
				i * this._environment.spriteSize, 
				(this.backgroundViewPort.height - 1) * this._environment.spriteSize, 
				this._environment.spriteSize,
				this._environment.spriteSize
			);
		}
		this.backgroundViewPort.y++;
	};

	/**
	 * move the background canvas to the top 
	 * @return {None}
	 */
	this.moveBackgroundCanvasToTop = function(){
		//move background-canvas to left
		this._backgroundCanvas.getContext('2d').drawImage(
			this._backgroundCanvas,
			0,
			this._environment.spriteSize
		);
		//and add the missing right part
		var gridLineIndex = this.backgroundViewPort.y-1;
		for(i=0; i< this._environment.grid.length; i++){
			//move background-canvas to left
			this._backgroundCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.spritesData[this._environment.grid[i][gridLineIndex].spriteId].x*this._environment.spriteSize, 
				this._environment.spritesData[this._environment.grid[i][gridLineIndex].spriteId].y*this._environment.spriteSize,
				this._environment.spriteSize,
				this._environment.spriteSize, 
				i * this._environment.spriteSize, 
				0, 
				this._environment.spriteSize,
				this._environment.spriteSize
			);
		}
		this.backgroundViewPort.y--;
	};

	/**
	 * getter for the display-canvas
	 * TODO: store directly the 2D context? (we don´t need to modify the DOM element itself, we only access to its 2d context)
	 * @return {DomElement} the display-canvas DOMElement
	 */
	this.getDisplayCanvas = function(){
		return this._displayCanvas;
	};

	/**
	 * getter for the viewPort
	 * @return {object} the viewPort: {x: integer,y: integer, width: integer, height: integer;
	 */
	this.getViewPort = function(){
		return this._viewPort;
	};

	this._initialize();
}