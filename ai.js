Namespace('Dodgeball').AI = (function(AI_Difficulty_Level) {
	return {
		getAIMove: function(GameState, currentCol) {
			var play = O;
			if (AI_Difficulty_Level === 'LOSE') {
				play = GameState[0][currentCol];
			}
			if (AI_Difficulty_Level === '50') {
				play = Math.random() > 0.5 ? X : O;
			}
			if (AI_Difficulty_Level === 'WIN') {
				var currentRow = 0;
				for (var i = 0; i < GameState.length; i++) {
					var found = false;
					for (var j = 0; j < GameState.length; j++) {
						if (GameState[i][j] === null) {
							found = true;
							currentRow = i - 1;
							break;
						}
					}
					if (found) break;
				}
				play = GameState[currentRow][currentCol] == X ? O : X;
			}
			return play;
		},
	};
});

