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
function gameBootstrap(canvas){
	var promises = [];
	promises.push(getCanvasContextFromUrl("./data/resources/dragonBallZSprites.png"));
	promises.push(getCanvasContextFromUrl("./data/resources/tileset4_transparency.png"));
	Promise.all(promises).then(
		function(imagesCanvas){
			//setup the view-port and its display canvas
			var viewPortWidth = 40;
			var viewPortHeight = 30;
			var online = true;
			
			var charactersSpritesCanvas = imagesCanvas[0];
			var environmentTilesCanvas = imagesCanvas[1];
			var sceneFactory = new SceneFactory();
			var cameraFactory = new CameraFactory();
			var scrollingBufferFactory = new ScrollingBufferFactory();
			var engine = new Engine(canvas, environmentTilesCanvas, charactersSpritesCanvas, animationPeriod, online, viewPortWidth, viewPortHeight, 
				gridBlockSize, sceneFactory, cameraFactory, scrollingBufferFactory);
		}
	)
}