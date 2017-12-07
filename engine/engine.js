/**
 * the engine. contains the the main loop with process the events and render the scene
 * @param {Scene} _scene the scene (contains animated-elements, environment...)
 * @param {HTML canvas} _displayCanvas    the canvas where the scene will be rendered
 * @param {Camera} camera         the view-port (to manage camera moves)
 * @param {integer} animationInterval   the timer in milliseconds use to triger the scene´s animated elements update
 * @param {boolean} online :  use the multiplayer (client-server) mode 
 */
function Engine (displayCanvas, animationInterval, online){
	this._displayCanvas = displayCanvas;
	this._animationInterval = animationInterval;
	this._online = online
	this._camera = null;
	this._backgroundBuffer = null;	

	/**
	 * initialize the renderer after the basic-properties setup
	 * @return {None}
	 */
	this._initialize = function(){
		if(! this._online){
			this._scene = SceneFactory().loadFromJson(scene2);
			this.start();
		}else{
			this._scene = SceneFactory().loadFromServer('http://localhost:8080', this.start.bind(this));
		}
	};

	/**
	 * the main loop: process the events and render the scene
	 * @return {None}
	 */
	this.mainLoop = function(){
		//update tha animated elements
		this._scene.getPlayableCharacter().animate();
		Object.keys(this._scene.getAnimatedElements()).forEach(
			function(id, index) {
				this[id].animate();
			}, 
			this._scene.getAnimatedElements());
		/*this._scene.getAnimatedElements().forEach(function(animatedElement){
			animatedElement.animate();
		});*/
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
		Object.keys(this._scene.getAnimatedElements()).forEach(
			function(id, index) {
				this._scene.getAnimatedElements()[id].render(this._camera.getViewPort(), this._displayCanvas);
			}, 
			this);
		/*this._scene.getAnimatedElements().forEach(
			function(animatedElement){
			animatedElement.render(this._camera.getViewPort(), this._displayCanvas);
		}.bind(this));*/
	};

	/**
	 * start the engine. It basically start a loop which animate and render the elements
	 * @return {None}
	 */
	this.start = function(){
		this._camera = new Camera({x:0,y:0,width: canvas.width, height: canvas.height}, this._scene);
		this._backgroundBuffer = new scrollingCanvasBuffer(this._scene.getEnvironment(), this._displayCanvas, this._camera);
		this.animationTimer = window.setInterval(this.mainLoop.bind(this), this._animationInterval);
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