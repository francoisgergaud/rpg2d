/**
 * the scene: contains the animated elements and the background
 */
function Scene(playableCharacter, environment) {

	this._playableCharacter = playableCharacter;
	this._environment = environment;

	/**
	 * return the scene´s playable character
	 * @type {Character}
	 */
	this.getPlayableCharacter = function(){
		return this._playableCharacter;
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
 */
function SceneFactory() {
	this.loadFromJson = function(jsonData){
		var environment = new Environment(
			jsonData.environment.spriteFilename, 
			jsonData.environment.backgroundSpriteData, 
			jsonData.environment.spriteSize
		);
		var playableCharacter = new Character(
			jsonData.playableCharacter.spriteFilename, 
			jsonData.playableCharacter.animationData,
			jsonData.playableCharacter.spriteSize
		);
		registerEventForPlayableCharacter(playableCharacter);
		return new Scene(playableCharacter, environment);
	}
	return this;
}

/**
 * map the keyboard arrows with the playable character actions
 * @param  {Character} character to set a playable
 * @return {None}
 */
function registerEventForPlayableCharacter(character){
	window.addEventListener(
		'keydown',
		function(e){
			character.stop();
			switch(e.keyCode){
				case 40:
					//down
					character.move(0); 
					break;
				case 39: 
					//right
					character.move(1);
					break;
				case 38:
					//up
					character.move(2); 
					break;
				case 37: 
					//left
					character.move(3); 
					break;
			}
		}
	);
	window.addEventListener(
		'keyup',
		function(e){
			character.stop();
		}
	);
}