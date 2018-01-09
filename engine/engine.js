/**
 * the engine. contains the the main loop with process the events and render the scene
 * @param {HTML canvas} _displayCanvas    the canvas where the scene will be rendered
 * @param {HTML canvas} environmentCanvas       canvas containing the tiles and sprites for the environment
 * @param {HTML canvas} characterCanvas       canvas containing the sprites for the character
 * @param {integer} animationInterval   the timer in milliseconds use to triger the scene´s animated elements update
 * @param {boolean} online :  use the multiplayer (client-server) mode
 * @param {integer} gridWidth the displayed-grid's width (number of grid element)
 * @param {integer} gridHeight displayed-grid's height (number of grid element)
 * @param {inetger} gridBlockSize size of a grid element
 * @param {SceneFactory} sceneFactory the scene-factory
 * @param {CameraFactory} cameraFactory the camera-factory
 *  @param {ScrollingBufferFactory} scrollingBufferFactory the scrolling-buffer-factory
 */
function Engine (displayCanvas, environmentCanvas, characterCanvas, animationInterval, online, gridWidth, gridHeight, gridBlockSize, 
	sceneFactory, cameraFactory, scrollingBufferFactory){
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
		//resize the display canvas using the grid's size and the grid's individual-bloc size
		var viewPortWidth = gridWidth*gridBlockSize;
		var viewPortHeight = gridHeight*gridBlockSize;
		displayCanvas.width = viewPortWidth;
		displayCanvas.height = viewPortHeight;
		//create the camera and its view-port
		if(! this._online){
			this._scene = sceneFactory.loadFromJson(scene2);
			//create the camera and its view-port
			this._camera = cameraFactory.createCamera({x:0,y:0,width: viewPortWidth, height: viewPortHeight}, this._scene);
			//create the scrolling-buffer
			this._backgroundBuffer = scrollingBufferFactory.createScrollingBuffer(this._scene.getEnvironment(), this._displayCanvas.width, this._displayCanvas.height, this._camera);
			// start the main-loop
			this.start();
		}else{
			//chaining promises
			//1 - load the scene from the server
			sceneFactory.loadFromServer('http://localhost:8080', environmentCanvas, characterCanvas).then(
				function(scene){
					this._scene = scene
					//create the camera and its view-port
					this._camera = cameraFactory.createCamera({x:0,y:0,width: viewPortWidth, height: viewPortHeight}, this._scene);
					//create the scrolling-buffer
					this._backgroundBuffer = scrollingBufferFactory.createScrollingBuffer(this._scene.getEnvironment(), this._displayCanvas.width, this._displayCanvas.height, this._camera);
					// start the main-loop
					this.start();
				}.bind(this)
			);
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
			this._scene.getAnimatedElements()
		);
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
		//depth rendering
		var elementsToRender = [];
		elementsToRender.push(this._scene.getPlayableCharacter());
		Object.keys(this._scene.getAnimatedElements()).forEach(
			function(id, index) {
				elementsToRender.push(this._scene.getAnimatedElements()[id]);
			}, 
		this);
		this._scene.getEnvironment().sprites.forEach(
			function(sprite) {
				elementsToRender.push(sprite);
			}, 
		this);
		elementsToRender.sort(
			function(a, b){
				return a._currentState.position.y - b._currentState.position.y;
			}
		);
		elementsToRender.forEach(
			function(elementToRender) {
				elementToRender.render(this._camera.getViewPort(), this._displayCanvas);
			}, 
			this);
	};

	/**
	 * start the engine. It basically start a loop which animate and render the elements
	 * @return {None}
	 */
	this.start = function(){
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