/**
 * the environment's tiles canvas. Drawing the environment´s tiles is a costly operation (many 'drawImage' calls).
 * Hence, to save these calls, the  environment's tiles are drawn once in a buffer canvas (hidden from the user) and
 * the scene rendering 'drawImage' from this canvas to display to the display canvas (only one call to 'drawImage'
 * is done). Make the rendering faster than drawing the environment's tiles one by one on each scene's rendering.
 *
 * Scrolling: when the scene's view-port (i.e.: camera) moves, this buffer canvas is updated if required only with 
 * the missing part (may be the top, bottom, left or right part depending one the view-port move)
 * @param  {Environment} environment the environment containing the tiles' sprites and the tiles
 * @param  {Integer} originalCanvasWidth the original-canvas's width
 * @param  {Integer} originalCanvasHeight the original-canvas's heigth
 * @param  {Camera} camera the camera used by the scene
 * @param  {HTMLCanvas} bufferCanavas [the canvas element used to buffer the environment's tiles
 * @return {Promise} the promise resolves when the buffer-canvas is ready (all the environment's tileset have be drawn)
 */
function scrollingCanvasBuffer(environment, originalCanvasWidth, originalCanvasHeight, camera, bufferCanavas){
	this._environment = environment;
	this._bufferCanvas = bufferCanavas;

	/**
	 * create the buffer canvas for double-buffering purpose
	 * @return {None}
	 */
	this._initialize = function(originalCanvasWidth, originalCanvasHeight, camera){
		//resize of the HTML canvas. Size is the display-canvas + tile´s size (for the scrolling)
		this._bufferCanvas.width = originalCanvasWidth+this._environment.tileSize;
		this._bufferCanvas.height = originalCanvasHeight+this._environment.tileSize;
		//create a view-port which store the buffer-canvas's current position. This view-port's coordinates
		// change when scrolling
		this.backgroundViewPort={
			/*x: 0,
			y: 0,*/
			x: parseInt(camera._viewPort.x/this._environment.tileSize),
			y: parseInt(camera._viewPort.y/this._environment.tileSize),
			width: (parseInt(originalCanvasWidth/this._environment.tileSize))+1,
			height: (parseInt(originalCanvasHeight/this._environment.tileSize))+1,
		};
		//initial draw of each environment's tiles
		for(i = this.backgroundViewPort.x; i < this.backgroundViewPort.width; i++){
			for(j = this.backgroundViewPort.y; j < this.backgroundViewPort.height; j++){
				this._bufferCanvas.getContext('2d').drawImage(
					this._environment.spriteCanvas,
					this._environment.tilesData[this._environment.grid[i][j].tileId].x*this._environment.tileSize, 
					this._environment.tilesData[this._environment.grid[i][j].tileId].y*this._environment.tileSize,
					this._environment.tileSize,
					this._environment.tileSize, 
					i * this._environment.tileSize, 
					j * this._environment.tileSize, 
					this._environment.tileSize,
					this._environment.tileSize
				);
			}
		}
	};

	/**
	 * move the background canvas to the right. It translate the cuurent buffer-canvas to the left and add the missing
	 * tiles on the right
	 * @return {[type]} [description]
	 */
	this.moveBackgroundCanvasToRight = function(){
		//move background-canvas to left
		this._bufferCanvas.getContext('2d').drawImage(
			this._bufferCanvas,
			0-this._environment.tileSize,
			0
		);
		//and add the missing right part
		var gridColumnIndex = this.backgroundViewPort.x+this.backgroundViewPort.width -1;
		console.log("fetch grid-column: "+gridColumnIndex);
		for(j=this.backgroundViewPort.y; j< (this.backgroundViewPort.height+this.backgroundViewPort.y-1); j++){
			//move background-canvas to left
			this._bufferCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.tilesData[this._environment.grid[gridColumnIndex][j].tileId].x*this._environment.tileSize, 
				this._environment.tilesData[this._environment.grid[gridColumnIndex][j].tileId].y*this._environment.tileSize,
				this._environment.tileSize,
				this._environment.tileSize, 
				(this.backgroundViewPort.width - 1) * this._environment.tileSize, 
				(j-this.backgroundViewPort.y) * this._environment.tileSize, 
				this._environment.tileSize,
				this._environment.tileSize
			);
		}
		this.backgroundViewPort.x++;
	};

	/**
	 * move the background canvas to the left. It translate the cuurent buffer-canvas to the right and add the missing
	 * tiles on the left
	 * @return {None}
	 */
	this.moveBackgroundCanvasToLeft = function(){
		//move background-canvas to left
		this._bufferCanvas.getContext('2d').drawImage(
			this._bufferCanvas,
			this._environment.tileSize,
			0
		);
		//and add the missing right part
		var gridColumnIndex = this.backgroundViewPort.x-1;
		console.log("fetch grid-column: "+gridColumnIndex);
		for(j=this.backgroundViewPort.y; j< (this.backgroundViewPort.height+this.backgroundViewPort.y-1); j++){
			//move background-canvas to left
			this._bufferCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.tilesData[this._environment.grid[gridColumnIndex][j].tileId].x*this._environment.tileSize, 
				this._environment.tilesData[this._environment.grid[gridColumnIndex][j].tileId].y*this._environment.tileSize,
				this._environment.tileSize,
				this._environment.tileSize, 
				0,
				(j-this.backgroundViewPort.y) * this._environment.tileSize, 
				this._environment.tileSize,
				this._environment.tileSize
			);
		}
		this.backgroundViewPort.x--;
	};

	/**
	 * move the background canvas to the bottom. It translate the cuurent buffer-canvas to the top and add the missing
	 * tiles on the bottom
	 * @return {None}
	 */
	this.moveBackgroundCanvasToBottom = function(){
		//move background-canvas to left
		this._bufferCanvas.getContext('2d').drawImage(
			this._bufferCanvas,
			0,
			0-this._environment.tileSize
		);
		//and add the missing right part
		var gridLineIndex = this.backgroundViewPort.y+this.backgroundViewPort.height -1;
		console.log("fetch grid-line: "+gridLineIndex);
		for(i=this.backgroundViewPort.x; i< (this.backgroundViewPort.width+this.backgroundViewPort.x-1); i++){
			//move background-canvas to left
			this._bufferCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.tilesData[this._environment.grid[i][gridLineIndex].tileId].x*this._environment.tileSize, 
				this._environment.tilesData[this._environment.grid[i][gridLineIndex].tileId].y*this._environment.tileSize,
				this._environment.tileSize,
				this._environment.tileSize, 
				(i-this.backgroundViewPort.x) * this._environment.tileSize, 
				(this.backgroundViewPort.height - 1) * this._environment.tileSize, 
				this._environment.tileSize,
				this._environment.tileSize
			);
		}
		this.backgroundViewPort.y++;
	};

	/**
	 * move the background canvas to the top. It translate the cuurent buffer-canvas to the bottom and add the missing
	 * tiles on the top
	 * @return {None}
	 */
	this.moveBackgroundCanvasToTop = function(){
		//move background-canvas to left
		this._bufferCanvas.getContext('2d').drawImage(
			this._bufferCanvas,
			0,
			this._environment.tileSize
		);
		//and add the missing right part
		var gridLineIndex = this.backgroundViewPort.y-1;
		console.log("fetch grid-line: "+gridLineIndex);
		for(i=this.backgroundViewPort.x; i< (this.backgroundViewPort.width+this.backgroundViewPort.x-1); i++){
			//move background-canvas to left
			this._bufferCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.tilesData[this._environment.grid[i][gridLineIndex].tileId].x*this._environment.tileSize, 
				this._environment.tilesData[this._environment.grid[i][gridLineIndex].tileId].y*this._environment.tileSize,
				this._environment.tileSize,
				this._environment.tileSize, 
				(i-this.backgroundViewPort.x)  * this._environment.tileSize, 
				0, 
				this._environment.tileSize,
				this._environment.tileSize
			);
		}
		this.backgroundViewPort.y--;
	};

	/**
	 * render the environment.
	 * TODO: review when the environment will contains differents layers
	 * @return {None}
	 */
	this.render = function(viewPort, displayCanvas){
		//refresh the background
		var xOffset = viewPort.x-(this.backgroundViewPort.x*this._environment.tileSize);
		var yOffset = viewPort.y-(this.backgroundViewPort.y*this._environment.tileSize);
		displayCanvas.getContext('2d').drawImage(
			this._bufferCanvas,
			xOffset,
			yOffset,
			viewPort.width,
			viewPort.height,
			0,
			0,
			viewPort.width,
			viewPort.height
		);
	};

	/**
	 * move the viewPort from (x,y) to (x+xOffset,y+yOffset) if it does not overboard the background canvas
	 * @param  {object} viewPort the viewPort current state (before move)
	 * @param  {integer} xOffset distance in pixel to move the viewPort´s x-origin
	 * @param  {integer} yOffset distance in pixel to move the viewPort´s y-origin
	 * @return {None}
	 */
	this.moveViewPort = function(viewPort, xOffset, yOffset){
		var xSpriteDistance = parseInt((viewPort.x+xOffset)/this._environment.tileSize) - parseInt(viewPort.x/this._environment.tileSize);
		if(xSpriteDistance == 1){
			//move background-canvas to right
			this.moveBackgroundCanvasToRight();
		}
		else if(this.backgroundViewPort.x > 0 && xSpriteDistance == -1){
			//move background-canvas to right
			this.moveBackgroundCanvasToLeft();
		}else{
			var ySpriteDistance = parseInt((viewPort.y+yOffset)/this._environment.tileSize) - parseInt(viewPort.y/this._environment.tileSize);
			if(ySpriteDistance == 1){
				//move background-canvas to right
				this.moveBackgroundCanvasToBottom();
			}
			else if(this.backgroundViewPort.y > 0 && ySpriteDistance == -1){
				//move background-canvas to right
				this.moveBackgroundCanvasToTop();
			}
		}
	};

	//add a listener to the camera so when it moves this canvasBuffer may scroll
	camera.addListener(this);

	//the promise
	// var promise = new Promise(
	// 	function(resolve, reject) {
			this._initialize(originalCanvasWidth, originalCanvasHeight, camera);
	// 		resolve(this);
	// 	}.bind(this)
	// );
	// return promise;	
}

/**
 * the scrolling-buffer factory. Use for lazy initializing and improve testability
 */
function ScrollingBufferFactory(){
	
	/**
	 * create a scrolling-buffer
	 * @param  {Environment} environment       the environment to scroll on
	 * @param  {[Integer} originalCanvasWidth  the display-canvas' width
	 * @param  {Integer} originalCanvasHeight  the display-canvas' height
	 * @param  {Camera} camera                 the Camera (trigger the scrolling on move)
	 * @return {scrollingCanvasBuffer}         the scrolling-buffer created
	 */
	this.createScrollingBuffer = function(environment, originalCanvasWidth, originalCanvasHeight, camera){
		var hiddenCanvas = document.createElement('canvas');
		return new scrollingCanvasBuffer(environment, originalCanvasWidth, originalCanvasHeight, camera, hiddenCanvas);	
	}
}