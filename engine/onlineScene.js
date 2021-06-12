/**
 * online-scene: manage scene by listening a server using web-socket and STOMP client
 * @param {SceneFactory} sceneFactory the scene factory used to build this scene (a reference is need to invoke the 
 * createAnimatedElementFromServerData method from the scene-factory)
 * @param {object} hci the GUI elements
 * 
 */
function OnlineScene(sceneFactory, hci){

	/**
	 * the scene-factory use to build this scene
	 * TODO: a reference is need to invoke the createAnimatedElementFromServerData method from the scene-factory.
	 * Not sure it is the right-place to be
	 */
	this._sceneFactory = sceneFactory;
	this._hci = hci;

	//invoke the parent constructor
	Scene.call(this, null, null, null);

	/**
	 * triggered when the server send a new-player event. Add the player to the list of animated-elements
	 * @param  {Object} data JSON data sent by the server
	 * @return {None}
	 */
	this.registerNewPlayer = function(data){
		var character = this._sceneFactory.createAnimatedElementFromServerData(data);
		this._animatedElements[character._id] = character;
		this.windowManager.addPlayer(character);
	};

	/**
	 * triggered when the server send a remove-player event. Remove the player from the list of animated-elements
	 * @param  {Object} data JSON data sent by the server
	 * @return {None}
	 */
	this.unregisterPlayer = function(characterId){
		var player = this._animatedElements[characterId];
		delete this._animatedElements[characterId];
		this.windowManager.removePlayer(player);
	};

	/**
	 * triggered when an animated-element is moved from the server
	 * @param  {object} data information about the animated-elemnent and the movement information
	 * @return {None}
	 */
	this.moveAnimatedElement = function(data){
		var animatedElement = this._animatedElements[data.id];
		//can be undefined if the animated-element is the current player
		if(animatedElement != undefined){
			animatedElement._currentState = data.currentState;
		}
	};

	/**
	 * subscribe to the server's topic and initialize the callback mapping
	 * @param  {STOMP client} stompClient the client used to listen to the server
	 * @return {None}
	 */
	this.subscribe = function(stompClient){
		this.stompClient=stompClient;
		stompClient.subscribe(
    		'/topic/newPlayer', 
    		function (data) {
        		this.registerNewPlayer(JSON.parse(data.body));
        	}.bind(this)
        );
        stompClient.subscribe(
    		'/topic/unregisterPlayer', 
    		function (data) {
        		this.unregisterPlayer(data.body);
        	}.bind(this)
        );
        stompClient.subscribe(
    		'/topic/movePlayer', 
    		function (data) {
        		this.moveAnimatedElement(JSON.parse(data.body));
        	}.bind(this)
        );
        stompClient.subscribe(
        	"/user/queue/movePlayer",
        	function (data) {
        		console.log(data);
        	}.bind(this)
        );
        stompClient.subscribe(
        	"/user/queue/chat",
        	function (data) {
        		this.windowManager.displayMessage(data.body);
        	}.bind(this)
        );
	}

	/**
	 * called when an local-event occurs in the scene
	 * @param  {Object} event the local event
	 */
	this.postEvent = function(event){
		var url = null;
		switch(event.name){
			case 'movePlayer':  {
				url="/app/movePlayer";
				break;
			}
			case 'sendMessage':  {
				url="/app/chat";
				break;
			}
		}
		if(url != null){
			this.stompClient.send(url, {}, JSON.stringify(event.data));
		}else{
			console.log('Local-event could not be identified.');
		}	
	}
}
//inherit the OnlineScene object from Scene object
OnlineScene.prototype = new Scene();

/**
 * the STOMP client factory
 */
function StompClientFactory(){

	/**
	 * create a STOMP client
	 * @param  {string} url the URL to create a websocket on
	 */
	this.createStompClient = function(url){
	    return Stomp.over(new SockJS(url));
	}
}