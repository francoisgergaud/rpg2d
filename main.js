/**
 * the size of a grid element in pixels
 */
var gridBlockSize = 16;
var animationPeriod = 40;

/**
 * initialize the game
 * @param  {Canvas} canvas the canvas DOM Element used for rendering
 * @return {None} 
 */
function game(canvas){
	//setup the view-port and its display canvas
	var viewPortWidth = 40;
	var viewPortHeight = 30;
	canvas.width = gridBlockSize*viewPortWidth;
	canvas.height = gridBlockSize*viewPortHeight;
	var scene = SceneFactory().loadFromJson(scene1);
	var camera = new Camera({x:0,y:0,width: canvas.width, height: canvas.height}, scene);
	var engine = new Engine(scene, canvas, camera, animationPeriod);
	engine.start();
}