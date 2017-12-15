/**
 * TODO: is it really the right way to create and invoke a static method?
 * @param {boolean} online is the scene online
 */
function SceneFactory(online) {
	this.loadFromJson = function(jsonData, online){
		var environment = new Environment(
			jsonData.environment.spriteFilename, 
			jsonData.environment.backgroundSpriteData, 
			jsonData.environment.spriteSize
		);
		var playableCharacter = new Character(
			"playableCharacter",
			online,
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
	 * @param {function} successCallback function to be executed on success
	 */
	this.loadFromServer = function(serverBaseURL, callback){
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
				var environment = new Environment(backgroundTileFilename, backgroundTileData, tileSize, backgroundSpriteData, data.worldElements);
				environment.grid = data.map;
				scene._environment = environment;
				//sprite-mapping is defined in the data/resources/sprite mapping
				animationData = characterSpritesMapping[characterId];
				var playableCharacter = new Character(
					"playableCharacter",
					true,
					characterSpritesFilename, 
					animationData,
					characterSpriteWidth,
					characterSpriteHeight
				);
				scene._playableCharacter = playableCharacter;
				playableCharacter._id = data.playerId;
				var animatedElements = {};
				Object.keys(data.animatedElements).forEach(
					function(id, index) {
						//the player is also part of the animated-elements returned. We must skip it
						if(id != data.playerId){
							var character = this.createAnimatedElementFromServerData(data.animatedElements[id]);
							animatedElements[character._id] = character;
						}
					},
				this);
				scene._animatedElements = animatedElements;
				scene.listenToServer(serverBaseURL, this);
			    callback();
			}
		});
		return scene;
	};
	
	/**
	 * helper (stateless) function to create an animatedElement object from server´s character data
	 * @param  {[object} animatedElementData the animated-element´s data
	 * @return {AnimatedElement} the animated element creted from the data
	 */
	this.createAnimatedElementFromServerData = function(animatedElementData){
		var animatedElementId = animatedElementData.id;
        var character = new AnimatedElement(
        	animatedElementId,
        	characterSpritesFilename,
			characterSpritesMapping[animatedElementData.characterId],
	   		characterSpriteWidth,
	   		characterSpriteHeight
	   	);
	   	character._currentState = animatedElementData.currentState;
	   	return character;
	}


	return this;
}