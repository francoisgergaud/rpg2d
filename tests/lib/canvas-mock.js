/**
 * canvas mocked feature: store the call parameters for further assertion.
 * Methods mocked:
 * - getContext('2d').drawImage
 */
function CanvasMock (){

	this._calls = [];
	var parent = this;

	this.getContext = function(contextName){
		if(contextName == '2d'){
			return {
				drawImage : function(originCanvas, originX, originY, originWidth, originHeight, 
					destinationX, destinationY, destinationWidth, destinationHeight){
					parent._calls.push(
						{
							originCanvas : originCanvas, 
							originX : originX, 
							originY : originY, 
							originWidth : originWidth, 
							originHeight : originHeight, 
							destinationX : destinationX, 
							destinationY : destinationY, 
							destinationWidth : destinationWidth,
							destinationHeight : destinationHeight
						}
					);
				}
			}
		}
	}

}