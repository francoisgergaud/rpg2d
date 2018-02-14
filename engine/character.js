/**
 * TODO: inherit a playable character from this class. only the playable character can be online
 * a playable character. The view-port will be centered on it
 * @param id {string} character´s identifier
 * @param {boolean} online is it a playable character online
 * @param spritesCanvas {HTML cancas} the canvas containing the sprties
 * @param animationData {Array} : contains the sprite-data (TODO: add more details about the structure)
 * @param spriteWidth {Integer} the sprite's width
 * @param spriteHeight {Integer} the sprite's height
 * @param scene {object} the scene the character is part-of
 * @param $window {object} obect sending events
 */
function Character(id, online, spritesCanvas, animationData, spriteWidth, spriteHeight, scene, $window){

	AnimatedElement.call(this, id, spritesCanvas, animationData, spriteWidth, spriteHeight);
	this._online = online;
	this._scene = scene;
	
	/**
	 * map the keyboard arrows with the playable character actions
	 * @return {None}
	 */
	this._initialize = function(){
		$window.addEventListener(
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
				this.move(direction);
			}.bind(this)
		);
		$window.addEventListener(
			'keyup',
			function(e){
				this.stop();
			}.bind(this)
		);
		//add a listener for collision detection
		this.registerPreAnimateListener(
			function(x, y, xOffset, yOffset){
				var environment = this._scene._environment;
				var newXPosition = Math.floor((x+xOffset)/environment.tileSize);
				var newYPosition = Math.floor((y+yOffset)/environment.tileSize);
				if(environment.grid[newXPosition][newYPosition].spriteId  != null){
					this.stop();
				}
			}.bind(this)
		)
	}

	/**
	 * cmove an animated element into a direction
	 * @param  {integer} direction an integer representing the direction. 0: down, 1: right, 2: up, 3: left 
	 * @return {[None} 
	 */
	this.move = function(direction){
		this._currentState.direction=direction;
		this._currentState.moving = true;
		if(this._online){
			$.ajax({
				context: this,
				url: 'http://localhost:8080/movePlayer',
				data: JSON.stringify({id: this._id, currentState: this._currentState}),
				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType : 'text',
				error: function(data) {
				  console.log("error while moving player: " + data);
				},
				success: function(data) {
					console.log("player move sent successfully");
				}
			});
		}
	};

	/**
	 * stop the character
	 * @return {None}
	 */
	this.stop = function(){
		this._currentState.moving = false;
		if(this._online){
			$.ajax({
				context: this,
				url: 'http://localhost:8080/movePlayer',
				data: JSON.stringify({id: this._id, currentState: this._currentState}),
				method: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType : 'text',
				error: function(data) {
				  console.log("error while moving player: " + data);
				},
				success: function(data) {
					console.log("player move sent successfully");
				}
			});
		}
	};

	this._initialize();
	
}

//inherit the Character object from animatedElement object
Character.prototype = new AnimatedElement();

/**
 * The character factory. USed for lazy constructing. Improve the testability
 */
function CharacterFactory(){

	/**
	 * create a character
	 * @return {Character} the camera created
	 */
	this.createCharacter = function(id, online, spritesCanvas, animationData, spriteWidth, spriteHeight, scene){
		return new Character(id, online, spritesCanvas, animationData, spriteWidth, spriteHeight, scene);
	}
}