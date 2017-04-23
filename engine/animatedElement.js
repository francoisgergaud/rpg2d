/**
 * an animated element. IT will be used as a based class to contain common fucntionalities shared between animated elements
 */
function AnimatedElement() {
	/** @type {Renderer} the renderer used to process the animated element */
	this._scene = null;

	/**
	 * the listeners to be executed when animate method is executed
	 * @type {Array}
	 */
	this._animateListeners = [];

	/**
	 * register the scene for this animated_element to be able to interact with other elements. This method is 
	 * called by the engine when processing/initializing the scene
	 * @param  scene {Scene} the scene to register
	 * @return {None}
	 */
	this._registerScene = function(scene){
		this._scene = scene;
	};

	/**
	 * @return {Scene} the scene used for this animated element
	 */
	this.getScene = function(){
		return this._scene;
	};

	/**
	 * add a listener for the animate method
	 * @param {object} listener listener to add to the list
	 */
	this.addAnimateListener = function(listener){
		this._animateListeners.push(listener);
	}
}