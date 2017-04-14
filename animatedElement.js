/**
 * an animated element. IT will be used as a based class to contain common fucntionalities shared between animated elements
 */
function AnimatedElement() {
	/** @type {Renderer} the renderer used to process the animated element */
	this._renderer = null;

	/**
	 * register the renderer
	 * @param  renderer {Renderer} the renderer to register
	 * @return {None}
	 */
	this.registerRenderer = function(renderer){
		this._renderer = renderer;
	};

	/**
	 * @return {Renderer} the renderer used for this animated element
	 */
	this.getRenderer = function(){
		return this._renderer;
	};
}