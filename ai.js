Namespace('Dodgeball').AI = (function(AI_Difficulty_Level) {
	
	return {
		getAIMove: function(GameState, currentCol) {
			var play = O;
			// Using a random number generator, AI has only a 20% of making the correct move each turn.
			if (AI_Difficulty_Level === 'LOSE') {
				if(Math.random() > 0.8) play = this.getItRight(currentCol);
				else play = GameState[0][currentCol];
			}
			// Using a random number generator, AI has only a 50% of making the correct move each turn.
			// Otherwise they take a fifty-fifty shot at placing an X or O regardless of human's move.
			if (AI_Difficulty_Level === '50') {
				if(Math.random() > 0.5) play = this.getItRight(currentCol);
				else play = Math.random() > 0.5 ? X : O;
			}
			// Always chooses the correct move for that turn (Opposite the player's last move).
			if (AI_Difficulty_Level === 'WIN') {
				play = this.getItRight(currentCol);
			}
			return play;
		},
		/*
		** Works off the simple logic of always picking the opposite choice from that of the human player's last move.
		** When used every move, this guarantees the computer will not be defeated. The nested for-loops find the first
		** empty space, and then backtracks one cell to know human player's last move. Then chooses opposite in the return statement.
		** If there are no more empty spaces on human player's board, it signifies human player has made their final move.
		** The final if-statement makes sure to choose opposite from that final move.
		*/
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