/**
 * the scene factory
 */
function SceneFactory() {

	/**
	 * load the scene from static content
	 * @param  {Object} jsonData data describin gthe scene (see data folder for examples)
	 * @return {Scene}  the created scene
	 */
	this.loadFromJson = function(jsonData){
		var environment = new Environment(
			jsonData.environment.spriteFilename, 
			jsonData.environment.backgroundSpriteData, 
			jsonData.environment.spriteSize
		);
		var playableCharacter = new Character(
			"playableCharacter",
			false,
			jsonData.playableCharacter.spriteFilename, 
			jsonData.playableCharacter.animationData,
			jsonData.playableCharacter.spriteSize
		);
		var animatedElements = {};
		jsonData.animatedElements.forEach(function(animatedElementDefinition){
			var animatedElementId = (Math.random() * 10);
			var animatedElement = new AnimatedElement(
				animatedElementId,
				false,
				animatedElementDefinition.spriteFilename, 
				animatedElementDefinition.animationData,
				animatedElementDefinition.spriteSize
			);
			animatedElement.processEvents = animatedElementDefinition.processEvents;
			animatedElements[animatedElementId] = animatedElement;
		});
		var scene =  new Scene(playableCharacter, animatedElements, environment);
		return scene;
	};

	/**
	 * register a player online and get the scene information
	 * @param {string} serverBaseURL  the server's base-URL
	 * @param {HTML canvas} environmentCanvas       canvas containing the tiles and sprites for the environment
	 * @param {HTML canvas} characterCanvas       canvas containing the sprites for the character
	 * @param {integer} characterId character-appearance identifier
	 * @param {Object} backgroundTileData position-data mapping background-tiles on the environmentCanvas
	 * @param {inetger} tileSize the tile-size (square tiles: the width=height=size)
	 * @param {Object} backgroundSpriteData position-data mapping environment-sprites on the environmentCanvas
	 * @param {EnvironmentFactory} environmentFactory the environment-factory
	 * @param {Object} charactersSpritesMapping position-data mapping characters on the characterCanvas
	 * @param {StompClientFactory} stompClientFactory the stomp-client factory
	 * @return {Promise} the promise to be resolve for callback trigger
	 */
	this.loadFromServer = function(serverBaseURL, environmentCanvas, characterCanvas, characterId, backgroundTileData, tileSize, 
		backgroundSpriteData, charactersSpritesMapping, characterSpriteWidth, characterSpriteHeight,
		animatedElementFactory, characterFactory, environmentFactory, stompClientFactory){
		// store the characters meta-information to be able to create new one when onlineScene.registerNewPlayer is called
		this._characterCanvas = characterCanvas;
		this.charactersSpritesMapping = charactersSpritesMapping;
		this.characterSpriteWidth = characterSpriteWidth;
		this.characterSpriteHeight = characterSpriteHeight;
		this.animatedElementFactory = animatedElementFactory;
		//build the promise to be return. This promise resolves when response is received from server and processed correctly
		var promise = new Promise(function(resolve, reject) {
			var scene = new OnlineScene();
			$.ajax({
				context: this,
				url: serverBaseURL+'/registerPlayer',
				data: JSON.stringify({id: 'jean-michel', characterId: characterId}),
				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType : 'json',
				characterId : characterId,
				error: function() {
				  reject("error while registering player");
				},
				success: function(data){
					var environment = environmentFactory.createEnvironment(
						environmentCanvas, 
						backgroundTileData, 
						tileSize, 
						backgroundSpriteData, 
						data.worldElements, 
						data.map
					);
					scene._environment = environment;
					//sprite-mapping is defined in the data/resources/sprite mapping
					var playableCharacter = characterFactory.createCharacter(
						data.playerId,
						true, 
						this._characterCanvas, 
						this.charactersSpritesMapping[characterId], 
						this.characterSpriteWidth, 
						this.characterSpriteHeight, 
						scene
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
						},
						this
					);
					scene._animatedElements = animatedElements;
					//TODO: create- factory for STOMP client
					stompClientFactory.createStompClient(serverBaseURL, scene, this);
					//scene.listenToServer(serverBaseURL, this);
				    resolve(scene);
				}
			});
		}.bind(this));
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
	   	character._currentState = animatedElementData.currentState;
	   	return character;
	};
}