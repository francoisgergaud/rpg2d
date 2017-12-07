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