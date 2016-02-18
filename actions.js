Namespace('Dodgeball').Actions = (function() {
	var AppDispatcher = Namespace('Dodgeball').Dispatcher;
	var Constants = Namespace('Dodgeball').Constants;
	return {
		dismissInstructions: function() {
			AppDispatcher.dispatch({
				actionType: Constants.INSTRUCTIONS_DISMISSED,
			});
		},
		selectGameMode: function(mode) {
			AppDispatcher.dispatch({
				actionType: Constants.GAME_MODE_SELECTED,
				mode: mode,
			});
		},
		selectBoardSize: function(size) {
			AppDispatcher.dispatch({
				actionType: Constants.BOARD_SIZE_SELECTED,
				size: size,
			});
		},
	};
})();
