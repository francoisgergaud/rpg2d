/**
 * the camera manage the view-port's moves. It can track an animated-elements to always center the view-port on it
 * @param {Object} viewPort the voew-port
 * @param {Scene} scene the scene the camera is attached to
 */
function Camera (viewPort, scene){

	this._viewPort = viewPort;
	this._listeners = [];
	this._scene = scene;
	
	/**
	 * register a listener. The listeners' moveViewPort(viewPort, xOffset, yOffset)' method is called 
	 * everytime the view-port moves
	 * @param {[type]} listener [description]
	 */
	this.addListener = function(listener){
		this._listeners.push(listener);
	}

	/**
	 * move the viewPort from (x,y) to (x+xOffset,y+yOffset) if it does not overboard the background canvas.
	 * It invokes the registered-listeners moveViewPort method
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
		//console.log("move viewPort to x: "+this._viewPort.x+", y:"+this._viewPort.y)
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
		animatedElement._setCamera(this);
	};

	/**
	 * the callback to be executed when an tracked animated element moves
	 * @param  {integer} xOffset the x-offset distance in pixels
	 * @param  {integer} yOffset the y-offset distance in pixels
	 * @return {None}
	 */
	this.animatedElementTrackedMove = function(x, y, xOffset, yOffset){
		var maxWidth = Math.floor(this._scene.getEnvironment().grid.length*this._scene.getEnvironment().tileSize);
		var maxHeight = Math.floor(this._scene.getEnvironment().grid[0].length*this._scene.getEnvironment().tileSize);
		var viewPortCenterX = this._viewPort.width/2 ;
		var viewPortCenterY = this._viewPort.height/2 ;
		//console.log("animatedElementTrackedMove. from x: "+x+", y:"+y+", viewPortCenterX: "+viewPortCenterY+", yOffset: "+yOffset);
		if((xOffset > 0 && (x+xOffset) > viewPortCenterX  && (x+xOffset) <= (maxWidth-viewPortCenterX))
			|| (xOffset < 0 && (x+xOffset) >= viewPortCenterX  && (x+xOffset) < (maxWidth-viewPortCenterX)) 
			|| (yOffset > 0 && (y+yOffset) > viewPortCenterY && (y+yOffset) <= (maxHeight-viewPortCenterY))
			|| (yOffset < 0 && (y+yOffset) >= viewPortCenterY && (y+yOffset) < (maxHeight-viewPortCenterY))){
			//console.log("move view port. x: "+x+", y:"+y+", xOffset: "+xOffset+", yOffset: "+yOffset);
			this.moveViewPort(xOffset, yOffset);
		}
	};

	this.track(scene.getPlayableCharacter());
}

/**
 * The camera factory. USed for lazy constructing. Improve the testability
 */
function CameraFactory(){

	/**
	 * create a camera
	 * @return {Camera} the camera created
	 */
	this.createCamera = function(viewPort, scene){
		return new Camera(viewPort, scene);
	}
}