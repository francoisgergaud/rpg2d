/**
 * the engine. contains the the main loop with process the events and render the scene
 * @param {Scene} _scene the scene (contains animated-elements, environment...)
 * @param {HTML canvas} _displayCanvas    the canvas where the scene will be rendered
 * @param {Camera} camera         the view-port (to manage camera moves)
 * @param {integer} animationInterval   the timer in milliseconds use to triger the scene´s animated elements update
 * @param {boolean} online :  use the multiplayer (client-server) mode 
 */
function Engine (scene, displayCanvas, camera, animationInterval, online){
	this._scene = scene;
	this._displayCanvas = displayCanvas;
	this._camera = camera;
	this._backgroundBuffer = null;
	this._animationInterval = animationInterval;
	this._online = online

	/**
	 * create an animatedElement object from server´s character data
	 * @param  {[object} animatedElementData the animated-element´s data
	 * @return {AnimatedElement} the animated element creted from the data
	 */
	function createAnimatedElementFromServerData(animatedElementData){
		var animatedElementId = animatedElementData.id;
        var character = new Character(
        	animatedElementId,
        	false,
        	"./data/resources/hetalia_sprites_by_carmenmcs.png",
			[
	   			[{x:3,y:0},{x:4,y:0},{x:5,y:0}],
	   			[{x:3,y:2},{x:4,y:2},{x:5,y:2}],
	   			[{x:3,y:3},{x:4,y:3},{x:5,y:3}],
	   			[{x:3,y:1},{x:4,y:1},{x:5,y:1}]
	   		],
	   		32
	   	);
	   	character._currentState = animatedElementData.currentState;
	   	return character;
	}

	/**
	 * initialize the renderer after the basic-properties setup
	 * @return {None}
	 */
	this._initialize = function(){
		if(! this._online){
			this._scene.getPlayableCharacter()._registerScene(this._scene);
			this._backgroundBuffer = new scrollingCanvasBuffer(this._scene.getEnvironment(), this._displayCanvas, this._camera);
			this.start();
		}else{
			$.ajax({
				context: this,
				url: 'http://localhost:8080/registerPlayer',
				data: JSON.stringify({id: 'jean-michel'}),
				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType : 'json',
				error: function() {
				  console.log("error while registering player");
				},
				success: function(data) {
					this._scene.getEnvironment().grid = data.map;
					this._scene.getPlayableCharacter()._id = data.playerId;
					Object.keys(data.animatedElements).forEach(
						function(id, index) {
							//the player is also part of the animated-elements returned. We must skip it
							if(id != data.playerId){
								var character = createAnimatedElementFromServerData(data.animatedElements[id]);
								this._scene._animatedElements[character._id] = character;
							}
						},
						this);
					//this._scene._animatedElements = data.animatedElements;
					this._backgroundBuffer = new scrollingCanvasBuffer(this._scene.getEnvironment(), this._displayCanvas, this._camera);
					var socket = new SockJS('http://localhost:8080/gameServer-websocket');
				    stompClient = Stomp.over(socket);
				    stompClient.connect({}, function (frame) {
				    	console.log('Connected: ' + frame);
				        stompClient.subscribe('/topics/newPlayer', function (data) {
				        	var parsedData = JSON.parse(data.body)
				        	var character = createAnimatedElementFromServerData(parsedData);
						   	this._scene._animatedElements[character._id] = character;
				        }.bind(this));
				        stompClient.subscribe('/topics/movePlayer', function (data) {
				        	var parsedData = JSON.parse(data.body);
				        	var animatedElement = this._scene._animatedElements[parsedData.id];
				        	if(animatedElement != undefined){
				        		/*if(parsedData.moving){
									this._scene._animatedElements[i].move(parsedData.direction);
								}else{
									this._scene._animatedElements[i].stop();
								}*/
								animatedElement._currentState = parsedData.currentState;
				        	}
				        }.bind(this));
				    }.bind(this));
				    this.start();
				}.bind(this)
			});
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