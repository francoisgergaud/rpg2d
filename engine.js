/**
 * the engine. contains the the main loop with process the events and render the scene
 * @param {[type]} _animatedElements animated-elements which are part of the scene
 * @param {[type]} _environment      environment for the scene
 * @param {[type]} _displayCanvas    the canvas where the scene will be rendered
 * @param {[type]} camera         the view-port (to manage camera moves)
 */
function Engine (animatedElements, environment, displayCanvas, camera, animationInterval){
	this._animatedElements = animatedElements;
	this._environment = environment;
	this._displayCanvas = displayCanvas;
	this._camera = camera;
	this._backgroundBuffer = null;
	this._animationInterval = animationInterval;

	/**
	 * initialize the renderer after the basic-properties setup
	 * @return {None}
	 */
	this._initialize = function(){
		for(var animatedElement of this._animatedElements){
			animatedElement.registerRenderer(this);
		}
		this._backgroundBuffer = new scrollingCanvasBuffer(this._environment, this._displayCanvas, this._camera);
	};

	/**
	 * the main loop: process the events and render the scene
	 * @return {None}
	 */
	this.mainLoop = function(){
		//update tha animated elements
		for(var animatedElement of this._animatedElements){
			animatedElement.animate();
		}
		//render the environment
		this._backgroundBuffer.render(this._camera.getViewPort(), this._displayCanvas);
		//render the animated elements
		for(var animatedElement of this._animatedElements){
			animatedElement.render(this._camera.getViewPort(), this._displayCanvas);
		}
	};

	this.start = function(){
		this.animationTimer = window.setInterval(this.mainLoop.bind(this), this._animationInterval);
	}

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
	this.getCamera = function(){
		return this._camera;
	};

	/**
	 * getter for the environment
	 * @return {object} the environment: {x: integer,y: integer, width: integer, height: integer;}
	 */
	this.getEnvironment = function(){
		return this._environment;
	};

	this._initialize();
}