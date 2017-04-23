function Camera (viewPort, scene){

	this._viewPort = viewPort;
	this._listeners = [];
	this._scene = scene;
	

	this.addListener = function(listener){
		this._listeners.push(listener);
	}

	/**
	 * move the viewPort from (x,y) to (x+xOffset,y+yOffset) if it does not overboard the background canvas
	 * @param  {integer} x       x origin-position for the top-left corner
	 * @param  {integer} y       y origin-position for the top-let corner
	 * @param  {integer} xOffset distance in pixel to move the x-origin
	 * @param  {integer} yOffset distance in pixel to move the y-origin
	 * @return {None}
	 */
	this.moveViewPort = function(xOffset, yOffset){
		for(var listener of this._listeners){
			listener.moveViewPort(this._viewPort, xOffset, yOffset);
		}
		this._viewPort.x+=xOffset;
		this._viewPort.y+=yOffset;
	};

	/**
	 * getter for the viewPort property
	 * @return {ViwPort} the camera´s viewPort
	 */
	this.getViewPort = function(){
		return this._viewPort;
	};

	/**
	 * track (follow) and animated element
	 * @param  {object} animatedElement the animated-element to track
	 * @return {None}
	 */
	this.track = function(animatedElement){
		animatedElement.addAnimateListener(this.animatedElementTrackedMove.bind(this));
	};

	/**
	 * the callback to be executed when an tracked animated element moves
	 * @param  {integer} xOffset the x-offset distance in pixels
	 * @param  {integer} yOffset the y-offset distance in pixels
	 * @return {None}
	 */
	this.animatedElementTrackedMove = function(x, y, xOffset, yOffset){
		var maxWidth = this._scene.getEnvironment().grid.length*this._scene.getEnvironment().spriteSize;
		var maxHeight = this._scene.getEnvironment().grid[0].length*this._scene.getEnvironment().spriteSize;
		var viewPortCenterX = this._viewPort.width/2 ;
		var viewPortCenterY = this._viewPort.height/2 ;
		if((xOffset != 0 && x > viewPortCenterX  && x < (maxWidth-viewPortCenterX)) 
			|| (yOffset != 0 && y > viewPortCenterY && y < (maxHeight-viewPortCenterY))){
			this.moveViewPort(xOffset, yOffset);
		}
	};

	this.track(scene.getPlayableCharacter());

}