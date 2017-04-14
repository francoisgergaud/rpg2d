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
		this._backgroundCanvas.width = (this._environment.spriteSize*50);
		this._backgroundCanvas.height = (this._environment.spriteSize*50);
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
				this._displayCanvas.getContext('2d').drawImage(
					this._backgroundCanvas,
					this._viewPort.x,
					this._viewPort.y,
					this._viewPort.width,
					this._viewPort.height,
					0,
					0,
					this._viewPort.width,
					this._viewPort.height);
			}else{
				//initialize the background canvas from the grid
				for(i = 0; i < this._environment.grid.length; i++){
					for(j= 0; j < this._environment.grid[i].length; j++){
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
		if(x > this._viewPort.width/2 && x < (this._backgroundCanvas.width-this._viewPort.width/2)){
			this._viewPort.x+=xOffset;
		}
		if(y > this._viewPort.height/2 && y < (this._backgroundCanvas.height-this._viewPort.height/2)){
			this._viewPort.y+=yOffset;
		}
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