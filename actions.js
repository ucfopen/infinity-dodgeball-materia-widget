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
			console.log("DEBUG: GAME MODE SELECTED = ", mode);
			AppDispatcher.dispatch({
				actionType: Constants.GAME_MODE_SELECTED,
				mode: mode,
			});
		},
		selectBoardSize: function(size) {
			console.log("DEBUG: BOARD SIZE SELECTED = ", size);
			AppDispatcher.dispatch({
				actionType: Constants.BOARD_SIZE_SELECTED,
				size: size,
			});
		},
	};
})();
