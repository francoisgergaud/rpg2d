/**
 * the engine. contains the the main loop with process the events and render the scene
 @param {object} sceneConfiguration: an object witht the following properties:
 	- gridWidth: the displayed-grid's width (number of grid element)
 	- gridHeight: displayed-grid's height (number of grid element)
 	- characterId: the character's appearance's identifier
 	- animationPeriod: the timer in milliseconds use to triger the scene´s animated elements update
 	- gridBlockSize: size of a grid element
 @param {object} factories: an object witht the following properties:
	- sceneFactory: the scene-factory
	- cameraFactory: the camera-factory
	- environmentFactory: environmentFactory the environment factory
	- scrollingBufferFactory: the scrolling-buffer-factory
	- animatedElementFactory: the animated-element factory
	- characterFactory: characterFactory the character factory
	- stompClientFactory: stompClientFactory the stomp-client factory
 @param {object} resources: an object witht the following properties:
	- charactersCanvas: canvas containing the sprites for the character
	- environmentCanvas: canvas containing the tiles and sprites for the environment
	- backgroundTilesData: position-data mapping background-tiles on the environmentCanvas
	- tileSize: the tile-size (square tiles: the width=height=size)
	- backgroundSpritesData: position-data mapping environment-sprites on the environmentCanvas
	- characterSpritesMapping: position-data mapping character-sprites on the characterCanvas
	- characterSpriteWidth: character sprite's width
	- characterSpriteHeight: character sprite's height
 @param {object} hci: an object witht the following properties:
	- canvas: the canvas where the scene will be rendered
	- messageOutput: the HTML DIV where message will be output
	- engineInitializationSuccessCallback: a function without parameter being called when initialization successful and before engine starting
 */
function Engine (factories, sceneConfiguration, resources, hci){
	this._displayCanvas = hci.canvas;
	this._messageComponent = hci.messageComponent;
	this._animationInterval = sceneConfiguration.animationPeriod;

	/**
	 * initialize the renderer after the basic-properties setup
	 * @return {None}
	 */
	this._initialize = function(){
		//resize the display canvas using the grid's size and the grid's individual-bloc size
		var viewPortWidth = sceneConfiguration.gridWidth*sceneConfiguration.gridBlockSize;
		var viewPortHeight = sceneConfiguration.gridHeight*sceneConfiguration.gridBlockSize;
		this._displayCanvas.width = viewPortWidth;
		this._displayCanvas.height = viewPortHeight;
		//load the scene from the server
		factories.sceneFactory.loadFromServer('http://localhost:8080', resources, sceneConfiguration, factories)
		.then(
			function(scene){
				this._scene = scene
				//create the camera and its view-port
				this._camera = factories.cameraFactory.createCamera({x:0,y:0,width: viewPortWidth, height: viewPortHeight}, this._scene);
				//create the scrolling-buffer
				this._backgroundBuffer = factories.scrollingBufferFactory.createScrollingBuffer(this._scene._environment, this._displayCanvas.width, this._displayCanvas.height, this._camera);
				// invoke any callback provided	
				hci.engineInitializationSuccessCallback();
				// start the main-loop
				this.start();
			}.bind(this),
			function(message){
				hci.messageOutput.innerHTML = message;
			}
		);
	};

	/**
	 * the main loop: process the events and render the scene
	 * @return {None}
	 */
	this.mainLoop = function(){
		//update tha animated elements
		this._scene._playableCharacter.animate();
		Object.keys(this._scene._animatedElements).forEach(
			function(id, index) {
				this[id].animate();
			}, 
			this._scene._animatedElements
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
		//sort the scene's sprite by y coordinate to give a depth
		var elementsToRender = [];
		elementsToRender.push(this._scene._playableCharacter);
		Object.keys(this._scene._animatedElements).forEach(
			function(id, index) {
				elementsToRender.push(this._scene._animatedElements[id]);
			}, 
		this);
		this._scene._environment.sprites.forEach(
			function(sprite) {
				elementsToRender.push(sprite);
			}, 
		this);
		elementsToRender.sort(
			function(a, b){
				return a._currentState.position.y - b._currentState.position.y;
			}
		);
		//render the animated elements
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