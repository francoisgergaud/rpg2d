function getCanvasContextFromUrl(url){
	var promise = new Promise(function(resolve, reject) {
		var image = new Image();
		image.onload = function() {
			var canvas = document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
	   		var context = canvas.getContext('2d');
			context.drawImage(image,0,0);
			resolve(canvas);
		};
		image.src = url;
	});
	return promise;
}

