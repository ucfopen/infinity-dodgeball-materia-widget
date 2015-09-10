Namespace('Dodgeball').Store = (function() {
	var AppDispatcher = Namespace('Dodgeball').Dispatcher;
	var Constants = Namespace('Dodgeball').Constants;

	var instructionsShown = true;

	var Store = (function() {
		var changeCallbacks = [];

		return {
			emitChange: function() {
				for (var i = 0; i < changeCallbacks.length; i++) {
					changeCallbacks[i]();
				}
			},
			addChangeListener: function(callback) {
				changeCallbacks.push(callback);
			},
			removeChangeListener: function(callback) {
				changeCallbacks.splice(changeCallbacks.indexOf(callback), 1);
			},
			getInstructionsShown: function() {
				return instructionsShown;
			},
		};
	})();

	// Register callback to handle all updates
	AppDispatcher.register(function(action) {
		switch(action.actionType) {
			case Constants.INSTRUCTIONS_DISMISSED:
				instructionsShown = false;
			Store.emitChange();
			break;
			default:
				// no op
		}
	});

	return Store;
})();
