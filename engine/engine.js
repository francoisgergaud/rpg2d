/**
 * the engine. contains the the main loop with process the events and render the scene
 * @param {Scene} _scene the scene (contains animated-elements, environment...)
 * @param {HTML canvas} _displayCanvas    the canvas where the scene will be rendered
 * @param {Camera} camera         the view-port (to manage camera moves)
 * @param {integer} animationInterval   the timer in milliseconds use to triger the scene´s animated elements update
 */
function Engine (scene, displayCanvas, camera, animationInterval){
	this._scene = scene;
	this._displayCanvas = displayCanvas;
	this._camera = camera;
	this._backgroundBuffer = null;
	this._animationInterval = animationInterval;

	/**
	 * initialize the renderer after the basic-properties setup
	 * @return {None}
	 */
	this._initialize = function(){
		this._scene.getPlayableCharacter()._registerScene(this._scene);
		this._backgroundBuffer = new scrollingCanvasBuffer(this._scene.getEnvironment(), this._displayCanvas, this._camera);
	};

	/**
	 * the main loop: process the events and render the scene
	 * @return {None}
	 */
	this.mainLoop = function(){
		//update tha animated elements
		this._scene.getPlayableCharacter().animate();
		 window.requestAnimationFrame(this._render.bind(this));
	};

	/**
	 * render the scene
	 * @return {None}
	 */
	this._render = function(){
		//render the environment
		this._backgroundBuffer.render(this._camera.getViewPort(), this._displayCanvas);
		//render the animated elements
		this._scene.getPlayableCharacter().render(this._camera.getViewPort(), this._displayCanvas);
	}

	/**
	 * start the engine. It basically start a loop which animate and render the elements
	 * @return {None}
	 */
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
	this.getScene = function(){
		return this._scene;
	};

	this._initialize();
}