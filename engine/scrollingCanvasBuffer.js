function scrollingCanvasBuffer(environment, displayCanvas, camera){
	this._isBackgroungCanvasReady = false;
	this._bufferCanvas = null;
	this._environment = environment;

	/**
	 * create the buffer canvas for double-buffering purpose
	 * @return {None}
	 */
	this._createBufferCanvas = function(displayCanvas){
		this._bufferCanvas = document.createElement('canvas');
		//this._bufferCanvas.setAttribute("id", "_bufferCanvas");
		this._bufferCanvas.width = displayCanvas.width+this._environment.tileSize;
		this._bufferCanvas.height = displayCanvas.height+this._environment.tileSize;
		this.backgroundViewPort={
			x: 0,
			y: 0,
			width: (parseInt(displayCanvas.width/this._environment.tileSize))+1,
			height: (parseInt(displayCanvas.height/this._environment.tileSize))+1,
		};
	};

	/**
	 * move the background canvas to the right 
	 * @return {[type]} [description]
	 */
	this.initializeBackgroundCanvas = function(){
		for(i = 0; i < this.backgroundViewPort.width; i++){
			for(j= 0; j < this.backgroundViewPort.height; j++){
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
	 * move the background canvas to the right 
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
	 * move the background canvas to the left 
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
	 * move the background canvas to the bottom 
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
	 * move the background canvas to the top 
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
		if(!this._environment.spriteLoading){
			if(this._isBackgroungCanvasReady){
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
			}else{
				this.initializeBackgroundCanvas();
				//document.body.appendChild(this._bufferCanvas);
				this._isBackgroungCanvasReady = true;
			}
		}else{
			this._isBackgroungCanvasReady = false;
		}
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

	this._createBufferCanvas(displayCanvas);
	camera.addListener(this);
}