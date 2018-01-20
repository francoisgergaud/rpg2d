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
	promises.push(getCanvasContextFromUrl(characterSpritesFilename));
	promises.push(getCanvasContextFromUrl(backgroundTileFilename));
	Promise.all(promises).then(
		function(imagesCanvas){
			//setup the view-port and its display canvas
			var viewPortWidth = 40;
			var viewPortHeight = 30;
			var online = true;
			//get the canvas after resource load
			var charactersSpritesCanvas = imagesCanvas[0];
			var environmentTilesCanvas = imagesCanvas[1];
			// create the required factories for the engine initialization
			var sceneFactory = new SceneFactory();
			var cameraFactory = new CameraFactory();
			var environmentFactory = new EnvironmentFactory();
			var scrollingBufferFactory = new ScrollingBufferFactory();
			var animatedElementFactory = new AnimatedElementFactory();
			var characterFactory = new CharacterFactory();
			var stompClientFactory = new StompClientFactory();
			// define the playable-character's appareance randomly
			var characterId = Math.floor(Math.random() * 8);
			// create the game-engine
			var engine = new Engine(canvas, environmentTilesCanvas, charactersSpritesCanvas, animationPeriod, online, viewPortWidth, viewPortHeight, 
				gridBlockSize, sceneFactory, cameraFactory, scrollingBufferFactory, characterId, backgroundTileData, tileSize, backgroundSpriteData, 
				characterSpritesMapping, characterSpriteWidth, characterSpriteHeight,
				animatedElementFactory, characterFactory, environmentFactory, stompClientFactory);
		}
	)
}