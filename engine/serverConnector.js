/**
 * the server-connector: manage all the connection to the server for the online mode
 */
function ServerConnector(serverBaseURL) {

	this._serverBaseURL = serverBaseURL;
	
	/**
	 * register a player online
	 * @param {function} successCallback function to be executed on success
	 */
	this.registerPlayer = function(successCallback){
		$.ajax({
			context: this,
			url: this._serverBaseURL+'/registerPlayer',
			data: JSON.stringify({id: 'jean-michel'}),
			method: 'POST',
			contentType: 'application/json; charset=utf-8',
			dataType : 'json',
			error: function() {
			  console.log("error while registering player");
			},
			success: successCallback
		});
	};
}