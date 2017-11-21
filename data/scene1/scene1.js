var scene1 =
{
	environment : {
		backgroundSpriteData : [
			{x:0,y:0},
			{x:1,y:0}
		],
		spriteFilename : "./data/resources/tileset4.png",
		spriteSize: 16
	},
	playableCharacter :
	{
		spriteFilename : "./data/resources/hetalia_sprites_by_carmenmcs.png",
		spriteSize: 32,
		animationData : [
   			[{x:6,y:0},{x:7,y:0},{x:8,y:0}],
   			[{x:6,y:2},{x:7,y:2},{x:8,y:2}],
   			[{x:6,y:3},{x:7,y:3},{x:8,y:3}],
   			[{x:6,y:1},{x:7,y:1},{x:8,y:1}]
   		]
	},
	animatedElements :[
		{
			spriteFilename : "./data/resources/hetalia_sprites_by_carmenmcs.png",
			spriteSize: 32,
			animationData : [
	   			[{x:3,y:0},{x:4,y:0},{x:5,y:0}],
	   			[{x:3,y:2},{x:4,y:2},{x:5,y:2}],
	   			[{x:3,y:3},{x:4,y:3},{x:5,y:3}],
	   			[{x:3,y:1},{x:4,y:1},{x:5,y:1}]
	   		],
	   		processEvents: function(){
	   			this._currentState.velocity = 2;
	   			this.move(0);
	   		}
		}
	]
}