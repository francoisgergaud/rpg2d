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
		$.ajax({
			context: this,
			url: serverBaseURL+'/registerPlayer',
			data: JSON.stringify({id: 'jean-michel'}),
			method: 'POST',
			contentType: 'application/json; charset=utf-8',
			dataType : 'json',
			error: function() {
			  console.log("error while registering player");
			},
			success: function(data){
				var backgroundSpriteData = [{x:0,y:0},{x:1,y:0}];
				var spriteFilename = "./data/resources/tileset4.png";
				var spriteSize = 16;
				var environment = new Environment(spriteFilename, backgroundSpriteData, spriteSize);
				environment.grid = data.map;
				scene._environment = environment;
				spriteFilename = "./data/resources/hetalia_sprites_by_carmenmcs.png";
				spriteSize =  32;
				animationData = [
		   			[{x:6,y:0},{x:7,y:0},{x:8,y:0}],
		   			[{x:6,y:2},{x:7,y:2},{x:8,y:2}],
		   			[{x:6,y:3},{x:7,y:3},{x:8,y:3}],
		   			[{x:6,y:1},{x:7,y:1},{x:8,y:1}]
		   		];
				var playableCharacter = new Character(
					"playableCharacter",
					true,
					spriteFilename, 
					animationData,
					spriteSize
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
        	"./data/resources/hetalia_sprites_by_carmenmcs.png",
			[
	   			[{x:3,y:0},{x:4,y:0},{x:5,y:0}],
	   			[{x:3,y:2},{x:4,y:2},{x:5,y:2}],
	   			[{x:3,y:3},{x:4,y:3},{x:5,y:3}],
	   			[{x:3,y:1},{x:4,y:1},{x:5,y:1}]
	   		],
	   		32
	   	);
	   	character._currentState = animatedElementData.currentState;
	   	return character;
	}


	return this;
}