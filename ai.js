Namespace('Dodgeball').AI = (function(AI_Difficulty_Level) {
	
	return {
		getAIMove: function(GameState, currentCol) {
			var play = O;
			if (AI_Difficulty_Level === 'LOSE') {
				if(Math.random() > 0.8) play = this.getItRight(currentCol);
				else play = GameState[0][currentCol];
			}
			if (AI_Difficulty_Level === '50') {
				if(Math.random() > 0.5) play = this.getItRight(currentCol);
				else play = Math.random() > 0.5 ? X : O;
			}
			if (AI_Difficulty_Level === 'WIN') {
				play = this.getItRight(currentCol);
			}
			return play;
		},
		getItRight: function(currentCol)
		{
			var currentRow = 0;
			var found = false;
			for (var i = 0; i < GameState.length; i++) {
				for (var j = 0; j < GameState[i].length; j++) {
					if (GameState[i][j] === null) {
						found = true;
						currentRow = i - 1;
						break;
					}
				}
				if (found) break;
			}
			if(!found) currentRow = GameState.length - 1;
			return GameState[currentRow][currentCol] == X ? O : X;
		},
	};
});

