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
	 * @param {function} successCallback function to be executed on success
	 */
	this.loadFromServer = function(serverBaseURL, environmentCanvas, characterCanvas, callback){
		var promise = new Promise(function(resolve, reject) {
			var scene = new OnlineScene();
			var characterId = Math.floor(Math.random() * 8);
			$.ajax({
				context: this,
				url: serverBaseURL+'/registerPlayer',
				data: JSON.stringify({id: 'jean-michel', characterId: characterId}),
				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType : 'json',
				characterId : characterId,
				error: function() {
				  console.log("error while registering player");
				},
				success: function(data){
					var environment = new Environment(environmentCanvas, backgroundTileData, tileSize, backgroundSpriteData, data.worldElements);
					environment.grid = data.map;
					scene._environment = environment;
					//sprite-mapping is defined in the data/resources/sprite mapping
					animationData = characterSpritesMapping[characterId];
					var playableCharacter = new Character(
						"playableCharacter",
						true,
						characterCanvas, 
						animationData,
						characterSpriteWidth,
						characterSpriteHeight,
						scene
					);
					scene._playableCharacter = playableCharacter;
					playableCharacter._id = data.playerId;
					var animatedElements = {};
					Object.keys(data.animatedElements).forEach(
						function(id, index) {
							//the player is also part of the animated-elements returned. We must skip it
							if(id != data.playerId){
								var character = this.createAnimatedElementFromServerData(data.animatedElements[id],characterCanvas);
								animatedElements[character._id] = character;
							}
						},
						this
					);
					scene._animatedElements = animatedElements;
					scene.listenToServer(serverBaseURL, this);
				    resolve(scene);
				}
			});
		}.bind(this));
		return promise;
	};
	
	/**
	 * helper (stateless) function to create an animatedElement object from server´s character data
	 * @param  {[object} animatedElementData the animated-element´s data
	 * @param {HTML canvas} characterCanvas [the characters'sprite canvas
	 * @return {AnimatedElement} the animated element creted from the data
	 */
	this.createAnimatedElementFromServerData = function(animatedElementData, characterCanvas){
		var animatedElementId = animatedElementData.id;
        var character = new AnimatedElement(
        	animatedElementId,
        	characterCanvas,
			characterSpritesMapping[animatedElementData.characterId],
	   		characterSpriteWidth,
	   		characterSpriteHeight
	   	);
	   	character._currentState = animatedElementData.currentState;
	   	return character;
	};
}