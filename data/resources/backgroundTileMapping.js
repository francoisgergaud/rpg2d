var backgroundTileFilename = "./data/resources/tileset4_transparency.png";
var backgroundTileData = [{x:0,y:0},{x:1,y:0}];
var tileSize = 16;

//the starting point is the coordinate to start to draw the sprite from the current position on the rendered map
//spriteDataPosition are the position (top-left and bottom-right corner) in the sprtie-data file
var backgroundSpriteData = [
{
	//tree sprite
	startingPoint: {x:-1, y:-3}, 
	spriteDataPosition: {
		topLeft: {x:1,y:4}, 
		width: 2,
		height: 3
	}
},
{	//house sprite
	startingPoint: {x:-2, y:-5}, 
	spriteDataPosition: {
		topLeft: {x:16,y:5}, 
		width: 4,
		height: 5
	}
}
];