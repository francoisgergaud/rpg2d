function OnlineScene(){

	Scene.call(this, null, null, null);
	

	this.listenToServer = function(serverBaseURL, sceneFactory){
		var socket = new SockJS(serverBaseURL+'/gameServer-websocket');
		stompClient = Stomp.over(socket);
	    stompClient.connect(
	    	{}, 
	    	function (frame) {
		    	stompClient.subscribe(
		    		'/topics/newPlayer', 
		    		function (data) {
		        		var parsedData = JSON.parse(data.body)
		        		var character = sceneFactory.createAnimatedElementFromServerData(parsedData);
				   		this._animatedElements[character._id] = character;
		        	}.bind(this)
		        );
		        stompClient.subscribe(
		        	'/topics/movePlayer', 
		        	function (data) {
		        		var parsedData = JSON.parse(data.body);
		        		var animatedElement = this._animatedElements[parsedData.id];
		        		//can be undefined if the animated-element is the current player
		        		if(animatedElement != undefined){
							animatedElement._currentState = parsedData.currentState;
		        		}
		        	}.bind(this)
		        );
		    }.bind(this)
		);
	};

	this.subscribe = function(stompClient, sceneFactory){
		stompClient.subscribe(
    		'/topics/newPlayer', 
    		function (data) {
        		var parsedData = JSON.parse(data.body)
        		var character = sceneFactory.createAnimatedElementFromServerData(parsedData);
		   		this._animatedElements[character._id] = character;
        	}.bind(this)
        );
        stompClient.subscribe(
        	'/topics/movePlayer', 
        	function (data) {
        		var parsedData = JSON.parse(data.body);
        		var animatedElement = this._animatedElements[parsedData.id];
        		//can be undefined if the animated-element is the current player
        		if(animatedElement != undefined){
					animatedElement._currentState = parsedData.currentState;
        		}
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
	this.createStompClient = function(serverBaseURL, onlineScene, sceneFactory){
		var socket = new SockJS(serverBaseURL+'/gameServer-websocket');
		stompClient = Stomp.over(socket);
	    stompClient.connect(
	    	{},
	    	function () {
		    	onlineScene.subscribe(stompClient, sceneFactory);
		    	console.log("stomp-client initialized correctly");
		    }, 
		    function(){
		    	console.log("error while subscribing stomp-client to server using web-socket");
		    }
		 );
	    return stompClient;
	}
}