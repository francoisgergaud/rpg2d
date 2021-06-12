/**
 * The window-manager: implement the interaction between the engine and the player window's component.
 * @param {object} hci the window's component (canvas, text-input, buttin etc...)
 * @param {Engine} engine the engine use to interact with this window-manager
 */
function WindowManager(hci, engine) {

	this.playerListSelect = hci.playerListSelect;
	this.chatInput = hci.chatInput;
	this.sendButton = hci.sendButton;
	this.messagesOutput = hci.messagesOutput;
	this.engine = engine;
	
	/**
	 * the initialization method
	 */
	var initialize = function(){
		// let chatMessageRegex = /(\[*\])/;
		// chatInputElement.onkeypress = function(e){
		// 	if(e.keyCode == 13){
		// 		var chatMessage = chatMessageRegex.exec(chatInputElement.text);
		// 	}
		// };
		// 
		this.sendButton.onclick = function(){
			var textTosend = this.chatInput.value;
			var to = [];
			for (var i=0; i<this.playerListSelect.length; i++){
				if (this.playerListSelect.options[i].selected){
					to.push(this.playerListSelect.options[i].value);
				}
			}
			// 
			var event = {name: 'sendMessage', data: {to: to, message: this.chatInput.value}};
			this.engine._scene.postEvent(event);
			this.chatInput.value = "";
		}.bind(this);
		// add the already connected player to the select GUI elements
		for (animatedElementId in this.engine._scene._animatedElements){
			this.addPlayer(this.engine._scene._animatedElements[animatedElementId]);
		}
	}.bind(this);	
	

	/**
	 * add a player to the list of players.
	 * @param {object} player the player to add (must have an identifier and a name)
	 */
	this.addPlayer = function(player){
		var opt = document.createElement('option');
		opt.value = player._id;
		opt.innerHTML = player.name;
	    this.playerListSelect.appendChild(opt);
	    this.messagesOutput.innerHTML += player.name + ' joined the game.<br/>';
	};

	/**
	 * remove a player from the list of player
	 * @param {string} playerId the player's identifier
	 */
	this.removePlayer = function(player){
		for (var i=0; i<this.playerListSelect.length; i++){
			if (this.playerListSelect.options[i].value == player._id ){
				this.playerListSelect.remove(i);
				break;
			}
		}
		this.messagesOutput.innerHTML += player.name + ' quit the game.<br/>';
	};

	/**
	 * display a message.
	 * @param {string} message the message to display
	 */
	this.displayMessage = function(message){
		this.messagesOutput.innerHTML += message + '<br/>';
	};

	initialize();
}

/**
 * The window manager factory.
 */
function WindowManagerFactory(){

	/**
	 * create a new window manager.
	 * @param {object} hci the window's component (canvas, text-input, buttin etc...)
	 * @param {Engine} engine the engine use to interact with this window-manager
	 * @return {WindowManager} the window-manager created
	 */
	this.createWindowManager = function(hci, engine){
		return new WindowManager(hci, engine);
	}
}