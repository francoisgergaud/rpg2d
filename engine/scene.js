/**
 * the scene: contains the animated elements and the background
 */
function Scene(playableCharacter, animatedElements, environment) {

	this._playableCharacter = playableCharacter;
	this._animatedElements = animatedElements;
	this._environment = environment;
	
	/**
	 * return the scene´s playable character
	 * @type {Character}
	 */
	this.getPlayableCharacter = function(){
		return this._playableCharacter;
	};

	/**
	 * return the scene´s animated-elements
	 * @type {array}
	 */
	this.getAnimatedElements = function(){
		return this._animatedElements;
	};

	/**
	 * return the scene´s environment
	 * @type {Environment}
	 */
	this.getEnvironment = function(){
		return this._environment;
	};
}

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
		registerEventForPlayableCharacter(playableCharacter, online);
		var animatedElements = {};
		jsonData.animatedElements.forEach(function(animatedElementDefinition){
			var animatedElementId = (Math.random() * 10);
			var animatedElement = new Character(
				animatedElementId,
				false,
				animatedElementDefinition.spriteFilename, 
				animatedElementDefinition.animationData,
				animatedElementDefinition.spriteSize
			);
			animatedElement.processEvents = animatedElementDefinition.processEvents;
			animatedElements[animatedElementId] = animatedElement;
		});

		return new Scene(playableCharacter, animatedElements, environment);
	}
	return this;
}

/**
 * map the keyboard arrows with the playable character actions
 * @param  {Character} character to set a playable
 * @param { boolean} online determine if the user's actions must be sent to the server or not
 * @return {None}
 */
function registerEventForPlayableCharacter(character,online){
	window.addEventListener(
		'keydown',
		function(e){
			//character.stop();
			var direction = null;
			switch(e.keyCode){
				case 40:
					//down
					direction = 0; 
					break;
				case 39: 
					//right
					direction = 1;
					break;
				case 38:
					//up
					direction = 2; 
					break;
				case 37: 
					//left
					direction = 3; 
					break;
			}
			character.move(direction);
		}
	);
	window.addEventListener(
		'keyup',
		function(e){
			character.stop();
		}
	);
}