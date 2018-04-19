/**
 * the scene factory
 */
function SceneFactory() {

	/**
	 * register a player online and get the scene information
	 * @param {string} serverBaseURL  the server's base-URL
	 * @param {object} resources resources for the scene
	 * @param {object} sceneConfiguration configuration for the scene
	 * @param {object} factories factories (DI)
	 * @param {object} hci the GUI elements
	 */
	this.loadFromServer = function(serverBaseURL, resources, sceneConfiguration, factories, hci){
		// store the characters meta-information to be able to create new one when onlineScene.registerNewPlayer is called
		this.charactersSpritesMapping = resources.characterSpritesMapping;
		this.characterSpriteWidth = resources.characterSpriteWidth;
		this.characterSpriteHeight = resources.characterSpriteHeight;
		this.animatedElementFactory = factories.animatedElementFactory;
		this._characterCanvas = resources.charactersCanvas;
		var characterId = sceneConfiguration.characterId;
		//build the promise to be return. This promise resolves when response is received from server and processed correctly
		var promise = new Promise(
			function(resolve, reject) {
				var scene = new OnlineScene(this, hci);
				var stompClient = factories.stompClientFactory.createStompClient(serverBaseURL+'/gameServer');
				stompClient.connect(
			    	{},
			    	function(){
				    	stompClient.subscribe(
					    	'/user/queue/registerPlayer', 
					    	function(frame){
						    	data=JSON.parse(frame.body);
						        var environment = factories.environmentFactory.createEnvironment(
									resources.environmentCanvas, 
									resources.backgroundTilesData, 
									resources.tileSize, 
									resources.backgroundSpritesData, 
									data.worldElements, 
									data.map
								);
								scene._environment = environment;
								//sprite-mapping is defined in the data/resources/sprite mapping
								var playableCharacter = factories.characterFactory.createCharacter(
									data.playerId,
									resources.charactersCanvas, 
									resources.characterSpritesMapping[characterId], 
									resources.characterSpriteWidth, 
									resources.characterSpriteHeight, 
									scene,
									window
								);
								scene._playableCharacter = playableCharacter;
								var animatedElements = {};
								Object.keys(data.animatedElements).forEach(
									function(id, index) {
										//the player is also part of the animated-elements returned. We must skip it
										if(id != data.playerId){
											var character = this.createAnimatedElementFromServerData(data.animatedElements[id]);
											animatedElements[character._id] = character;
										}
									}.bind(this),
									this
								);
								scene._animatedElements = animatedElements;
								scene.subscribe(stompClient);
								resolve(scene);
						     }.bind(this)
						);
						stompClient.send("/app/registerPlayer", {}, JSON.stringify({id: sceneConfiguration.username, characterId: characterId}));
					}.bind(this)
				);
			}.bind(this), 
		    function(){
		    	reject("error while registering player: stomp-client not initialized correctly");
		    }
		);
		return promise;
	};
	
	/**
	 * helper (stateless) function to create an animatedElement object from server´s character data
	 * @param  {[object} animatedElementData the animated-element´s data
	 * @return {AnimatedElement} the animated element creted from the data
	 */
	this.createAnimatedElementFromServerData = function(animatedElementData){
		var character = this.animatedElementFactory.createAnimatedElement(
			animatedElementData.id,
			this._characterCanvas, 
			this.charactersSpritesMapping[animatedElementData.characterId],
			this.characterSpriteWidth,
	   		this.characterSpriteHeight
	   	);
	   	character.name = animatedElementData.name;
	   	character._currentState = animatedElementData.currentState;
	   	return character;
	};
}