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
	var online = true;
	canvas.width = gridBlockSize*viewPortWidth;
	canvas.height = gridBlockSize*viewPortHeight;
	var engine = new Engine(canvas, animationPeriod, online);
	//engine.start(); //now the start call is included in the engine constructor
}