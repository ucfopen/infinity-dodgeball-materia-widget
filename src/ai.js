Namespace('Dodgeball').AI = (function(AI_Difficulty_Level)
{
	return {
		getAIMove: function(GameState, currentCol)
		{
			var play = O;
			// Using a random number generator, AI has only a 20% of making the correct move each turn.
			if (AI_Difficulty_Level === 'LOSE') {
				if(Math.random() > 0.8) play = this.getItRight(currentCol);
				else play = GameState.boardState[0][currentCol];
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
		** If the board is full (Player's last move was made) then the comparison is made with the final square.
		** If the board is not full, comparison is made with the last move. The opposite of that X or O is returned.
		*/
		getItRight: function(currentCol)
		{
			var currentRow = 0;
			if(GameState.isBoardFull) currentRow = GameState.boardState.length - 1;
			else currentRow = GameState.nextEmptySpace[0];
			return GameState.boardState[currentRow][currentCol] == X ? O : X;
		},
	};
});