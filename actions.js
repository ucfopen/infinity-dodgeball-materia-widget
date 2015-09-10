Namespace('Dodgeball').Actions = (function() {
	var AppDispatcher = Namespace('Dodgeball').Dispatcher;
	var Constants = Namespace('Dodgeball').Constants;
	return {
		dismissInstructions: function() {
			AppDispatcher.dispatch({
				actionType: Constants.INSTRUCTIONS_DISMISSED,
			});
		},
	};
})();
