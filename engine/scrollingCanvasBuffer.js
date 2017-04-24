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
		this._bufferCanvas.width = displayCanvas.width+this._environment.spriteSize;
		this._bufferCanvas.height = displayCanvas.height+this._environment.spriteSize;
		this.backgroundViewPort={
			x: 0,
			y: 0,
			width: (parseInt(displayCanvas.width/this._environment.spriteSize))+1,
			height: (parseInt(displayCanvas.height/this._environment.spriteSize))+1,
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
					this._environment.spritesData[this._environment.grid[i][j].spriteId].x*this._environment.spriteSize, 
					this._environment.spritesData[this._environment.grid[i][j].spriteId].y*this._environment.spriteSize,
					this._environment.spriteSize,
					this._environment.spriteSize, 
					i * this._environment.spriteSize, 
					j * this._environment.spriteSize, 
					this._environment.spriteSize,
					this._environment.spriteSize
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
			0-this._environment.spriteSize,
			0
		);
		//and add the missing right part
		var gridColumnIndex = this.backgroundViewPort.x+this.backgroundViewPort.width -1;
		console.log("fetch grid-column: "+gridColumnIndex);
		for(j=this.backgroundViewPort.y; j< (this.backgroundViewPort.height+this.backgroundViewPort.y); j++){
			//move background-canvas to left
			this._bufferCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.spritesData[this._environment.grid[gridColumnIndex][j].spriteId].x*this._environment.spriteSize, 
				this._environment.spritesData[this._environment.grid[gridColumnIndex][j].spriteId].y*this._environment.spriteSize,
				this._environment.spriteSize,
				this._environment.spriteSize, 
				(this.backgroundViewPort.width - 1) * this._environment.spriteSize, 
				(j-this.backgroundViewPort.y) * this._environment.spriteSize, 
				this._environment.spriteSize,
				this._environment.spriteSize
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
			this._environment.spriteSize,
			0
		);
		//and add the missing right part
		var gridColumnIndex = this.backgroundViewPort.x-1;
		console.log("fetch grid-column: "+gridColumnIndex);
		for(j=this.backgroundViewPort.y; j< (this.backgroundViewPort.height+this.backgroundViewPort.y); j++){
			//move background-canvas to left
			this._bufferCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.spritesData[this._environment.grid[gridColumnIndex][j].spriteId].x*this._environment.spriteSize, 
				this._environment.spritesData[this._environment.grid[gridColumnIndex][j].spriteId].y*this._environment.spriteSize,
				this._environment.spriteSize,
				this._environment.spriteSize, 
				0,
				(j-this.backgroundViewPort.y) * this._environment.spriteSize, 
				this._environment.spriteSize,
				this._environment.spriteSize
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
			0-this._environment.spriteSize
		);
		//and add the missing right part
		var gridLineIndex = this.backgroundViewPort.y+this.backgroundViewPort.height -1;
		console.log("fetch grid-line: "+gridLineIndex);
		for(i=this.backgroundViewPort.x; i< (this.backgroundViewPort.width+this.backgroundViewPort.x); i++){
			//move background-canvas to left
			this._bufferCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.spritesData[this._environment.grid[i][gridLineIndex].spriteId].x*this._environment.spriteSize, 
				this._environment.spritesData[this._environment.grid[i][gridLineIndex].spriteId].y*this._environment.spriteSize,
				this._environment.spriteSize,
				this._environment.spriteSize, 
				(i-this.backgroundViewPort.x) * this._environment.spriteSize, 
				(this.backgroundViewPort.height - 1) * this._environment.spriteSize, 
				this._environment.spriteSize,
				this._environment.spriteSize
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
			this._environment.spriteSize
		);
		//and add the missing right part
		var gridLineIndex = this.backgroundViewPort.y-1;
		console.log("fetch grid-line: "+gridLineIndex);
		for(i=this.backgroundViewPort.x; i< (this.backgroundViewPort.width+this.backgroundViewPort.x); i++){
			//move background-canvas to left
			this._bufferCanvas.getContext('2d').drawImage(
				this._environment.spriteCanvas,
				this._environment.spritesData[this._environment.grid[i][gridLineIndex].spriteId].x*this._environment.spriteSize, 
				this._environment.spritesData[this._environment.grid[i][gridLineIndex].spriteId].y*this._environment.spriteSize,
				this._environment.spriteSize,
				this._environment.spriteSize, 
				(i-this.backgroundViewPort.x)  * this._environment.spriteSize, 
				0, 
				this._environment.spriteSize,
				this._environment.spriteSize
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
				var xOffset = viewPort.x-(this.backgroundViewPort.x*this._environment.spriteSize);
				var yOffset = viewPort.y-(this.backgroundViewPort.y*this._environment.spriteSize);
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
		var xSpriteDistance = parseInt((viewPort.x+xOffset)/this._environment.spriteSize) - parseInt(viewPort.x/this._environment.spriteSize);
		if(xSpriteDistance == 1){
			//move background-canvas to right
			this.moveBackgroundCanvasToRight();
		}
		if(this.backgroundViewPort.x > 0 && xSpriteDistance == -1){
			//move background-canvas to right
			this.moveBackgroundCanvasToLeft();
		}
		var ySpriteDistance = parseInt((viewPort.y+yOffset)/this._environment.spriteSize) - parseInt(viewPort.y/this._environment.spriteSize);
		if(ySpriteDistance == 1){
			//move background-canvas to right
			this.moveBackgroundCanvasToBottom();
		}
		if(this.backgroundViewPort.y > 0 && ySpriteDistance == -1){
			//move background-canvas to right
			this.moveBackgroundCanvasToTop();
		}
	};

	this._createBufferCanvas(displayCanvas);
	camera.addListener(this);
}