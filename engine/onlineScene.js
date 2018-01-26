/**
 * online-scene: manage scene by listening a server using web-socket and STOMP client
 * @param {SceneFactory} sceneFactory the scene factory used to build this scene (a reference is need to invoke the 
 * createAnimatedElementFromServerData method from the scene-factory)
 */
function OnlineScene(sceneFactory){

	/**
	 * the scene-factory use to build this scene
	 * TODO: a reference is need to invoke the createAnimatedElementFromServerData method from the scene-factory.
	 * Not sure it is the right-place to be
	 */
	this._sceneFactory = sceneFactory;

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
		stompClient.subscribe(
    		'/topics/newPlayer', 
    		function (data) {
        		this.registerNewPlayer(JSON.parse(data.body));
        	}.bind(this)
        );
        stompClient.subscribe(
    		'/topics/movePlayer', 
    		function (data) {
        		this.moveAnimatedElement(JSON.parse(data.body));
        	}.bind(this)
        );
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
	 * @param  {string} serverBaseURL the server base URL
	 * @param  {[OnlineScene} onlineScene   the online scene onvoking the subsription
	 * @param {SceneFactory} sceneFactory the scene factory
	 * @return {STOMP client} the STOMP client created
	 */
	this.createStompClient = function(serverBaseURL, onlineScene){
		var socket = new SockJS(serverBaseURL+'/gameServer-websocket');
		stompClient = Stomp.over(socket);
	    stompClient.connect(
	    	{},
	    	function () {
		    	onlineScene.subscribe(stompClient);
		    	console.log("stomp-client initialized correctly");
		    }, 
		    function(){
		    	console.log("error while subscribing stomp-client to server using web-socket");
		    }
		 );
	    return stompClient;
	}
}