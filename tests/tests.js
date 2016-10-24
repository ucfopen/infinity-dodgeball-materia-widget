describe('materiaCreator module', function(){
	// grab the demo widget for easy reference
	var widgetInfo = window.__demo__['build/demo'];
	var qset = widgetInfo.qset;

	var $scope = {};
	var ctrl;

	describe('creatorCtrl', function() {
		beforeEach(module('materiaCreator'));

		beforeEach(inject(function($rootScope, $controller){
			//instantiate $scope with all of the generic $scope methods/properties
			$scope = $rootScope.$new();
			//pass $scope through the 'creatorCtrl' controller
			ctrl = $controller('creatorCtrl', { $scope: $scope });
		}));

		// override the method that runs if the widget is saved properly
		Materia.CreatorCore.save = function(title, qset, version) {
			return true;
		};
		// override the method that runs if the widget is saved without a title
		Materia.CreatorCore.cancelSave = function(msg) {
			return msg;
		};

		it('should make a new widget', function(){
			$scope.initNewWidget({name: 'be-finder'});

			expect($scope.widget.engineName).toBe('be-finder');
			expect($scope.widget.title).toBe('be-finder');
		});

		it('should cause an issue when saved without a title', function(){
			expect($scope.onSaveClicked()).toBe('This widget has no title!');
		});

		it('should save properly when it has a title', function(){
			$scope.widget.title = 'be-finder';
			expect($scope.onSaveClicked()).toBe(true);
		});

		it('should edit an existing widget', function(){
			$scope.initExistingWidget('Be Finder', {name: 'be-finder'}, {});
			expect($scope.initExistingWidget).toBeDefined();
		});
	});

	describe('dodgeballPlayerCtrl', function(){
		module.sharedInjector();
		beforeAll(module('dodgeball'));

		var $timeout = null;

		beforeAll(inject(function($rootScope, $controller, _$timeout_){
			$timeout = _$timeout_;
			//instantiate $scope with all of the generic $scope methods/properties
			$scope = $rootScope.$new();
			//pass $scope through the 'dodgeballPlayerCtrl' controller
			ctrl = $controller('dodgeballPlayerCtrl', { $scope: $scope });
		}));

		//make sure all of the player's variables are in their 'new round' or 'tutorial mode' settings
		function _checkNewRoundState(){
			expect($scope.choosingMode).toBe(true);
			expect($scope.choosingSize).toBe(false);
			expect($scope.roundOver).toBe(false);
			expect($scope.gameMode).toBe(null);
			expect($scope.firstPlayerRows).toBe(null);
			expect($scope.secondPlayerCells).toBe(null);
			expect($scope.currentRow).toBe(null);
			expect($scope.currentColumn).toBe(null);
			expect($scope.currentCell).toBe(null);
			expect($scope.currentPlayer).toBe(null);
			expect($scope.changingTurn).toBe(false);
			expect($scope.winningPlayer).toBe(null);
		}

		//make sure the first and second players' boards are initialized correctly
		function _checkBoardSize(size){
			for(var i = 1; i <= size; i++)
			{
				//two-dimensional board for player one
				for(var j = 1; j <= size; j++)
				{
					expect($scope.firstPlayerRows[i][j].letter).toBe('');
				}

				//one-dimensional board for player two
				expect($scope.secondPlayerCells[i].letter).toBe('');
			}
		}

		//quickly execute player letter choices, then clear the timeout so the AI can make its letter choice
		function _quickTurn(playerLetters, computerLetter){
			var row = $scope.currentRow;
			for(var i = 0; i < playerLetters.length; i++)
			{
				$scope.selectLetter(playerLetters[i]);
			}
			$timeout.flush();
			expect($scope.secondPlayerCells[row].letter).toBe(computerLetter);
		}

		it('should start properly', function(){
			$scope.start(widgetInfo, qset.data);
			expect($scope.title).toBe('Dodgeball');

			//everything should have initial settings
			expect($scope.tutorialStep).toBe(1);

			expect($scope.choosingMode).toBe(false);
			expect($scope.choosingSize).toBe(false);
			expect($scope.roundOver).toBe(false);

			expect($scope.difficulty).toBe(3); //'hard' mode, for use in single-player rounds
			expect($scope.gameMode).toBe(null);
			expect($scope.boardSize).toBe(null);

			expect($scope.firstPlayerRows).toBe(null);
			expect($scope.secondPlayerCells).toBe(null);

			expect($scope.currentRow).toBe(null);
			expect($scope.currentColumn).toBe(null);
			expect($scope.currentCell).toBe(null);
			expect($scope.currentPlayer).toBe(null);
			expect($scope.changingTurn).toBe(false);

			expect($scope.roundsPlayed).toBe(0);
			expect($scope.winningPlayer).toBe(null);
		});

		it('should progress through the instructions', function(){
			//make sure we're still on the first page of instructions
			expect($scope.tutorialStep).toBe(1);

			//this action is normally tied to a button press
			$scope.tutorialNext();
			expect($scope.tutorialStep).toBe(2);

			//make sure we stop incrementing the step counter when we hit the cap - should be 5
			$scope.tutorialNext();
			expect($scope.tutorialStep).toBe(3);
			$scope.tutorialNext();
			expect($scope.tutorialStep).toBe(4);
			//step 5 is the mode select screen, basically indicating the instructions are over
			$scope.tutorialNext();
			expect($scope.tutorialStep).toBe(5);

			//trying to go to the next step of the tutorial after it's over should not be possible
			expect(function(){
				$scope.tutorialNext();
			}).toThrow(new Error('Tutorial is already over!'));
		});

		it('should start a new round automatically once the tutorial has ended', function(){
			//make sure everything that resets on a new round is still correct
			_checkNewRoundState();
			expect($scope.roundsPlayed).toBe(1);
		});

		it('should not allow selecting a size before selecting a mode', function(){
			expect(function(){
				$scope.selectSize(2);
			}).toThrow(new Error('Game mode not chosen!'));
		});

		it('should choose two-player mode', function(){
			$scope.selectHuman();

			expect($scope.choosingMode).toBe(false);
			expect($scope.gameMode).toBe('2_PLAYER');
		});

		it('should not allow selecting a mode after selecting a mode', function(){
			expect(function(){
				$scope.selectHuman();
			}).toThrow(new Error('Game mode already chosen!'));
			expect(function(){
				$scope.selectAI();
			}).toThrow(new Error('Game mode already chosen!'));
		});

		it('should not allow selecting an invalid board size', function(){
			expect(function(){
				$scope.selectSize(1);
			}).toThrow(new Error('Invalid board size!'));
			expect(function(){
				$scope.selectSize(8);
			}).toThrow(new Error('Invalid board size!'));
		});

		it('should not allow selecting a letter without a cell selected', function(){
			expect(function(){
				$scope.selectLetter('X');
			}).toThrow(new Error('No cell to choose a letter for!'));
		});

		it('should require a size when selecting a size', function(){
			expect(function(){
				$scope.selectSize();
			}).toThrow(new Error('No size given!'));
		});

		it('should select a board size', function(){
			//we should still be at the 'choose a size' stage
			expect($scope.choosingSize).toBe(true);

			//normally, clicking one of the 6 board size options will cause both of these to occur at the same time
			$scope.selectSize(2);
			expect($scope.boardSize).toBe(2);

			expect($scope.choosingSize).toBe(false);
		});

		it('should not allow selecting a size after selecting a size', function(){
			expect(function(){
				$scope.selectSize(2);
			}).toThrow(new Error('Board size already chosen!'));
		});

		//after selecting a size, the game board is generated
		it('should have generated the board', function(){
			_checkBoardSize(2);
		});

		it('should have started the round', function(){
			//should start at the top left corner of the board
			expect($scope.currentRow).toBe(1);
			expect($scope.currentColumn).toBe(1);
			expect($scope.currentCell).toEqual($scope.firstPlayerRows[1][1]);

			//player one should have their turn first
			expect($scope.currentPlayer).toBe(1);
		});

		it('should not allow selecting invalid letters', function(){
			expect(function(){
				$scope.selectLetter('A');
			}).toThrow(new Error('Valid letter not chosen!'));
		});

		it('should select the letter X', function(){
			$scope.selectLetter('X');
			//make sure this set the right cell's letter appropriately
			expect($scope.firstPlayerRows[1][1].letter).toBe('X');

			//make sure the column and target cell were incremented correctly
			expect($scope.currentColumn).toBe(2);
			expect($scope.currentCell).toEqual($scope.firstPlayerRows[1][2]);
		});

		it('should select the letter O', function(){
			$scope.selectLetter('O');
			expect($scope.firstPlayerRows[1][2].letter).toBe('O');
		});

		//reaching the end of a row will start the other player's turn
		it('should have reacted to reaching the end of the row', function(){
			expect($scope.currentPlayer).toBe(2);
			expect($scope.changingTurn).toBe(true);
		});

		//at this point a 1000-millisecond timer should be running, during which selecting another answer shouldn't be possible
		it('should not allow selecting letters during turn transitions', function(){
			expect(function(){
				$scope.selectLetter('X');
			}).toThrow(new Error('Wait for the next turn!'));

			//since the timer doesn't really run out properly during tests, just help it along
			$timeout.flush();
			expect($scope.changingTurn).toBe(false);
		});

		it('should only allow the second player to select a single letter at a time', function(){
			//assume the second player wants to win - choose the opposite of the first player
			$scope.selectLetter('O');
			//make sure the second player's target cell was set correctly
			expect($scope.secondPlayerCells[1].letter).toBe('O');

			//whenever the second player selects a letter, the row should increment
			expect($scope.currentRow).toBe(2);

			//since the second player only chooses one letter at a time, it should be the first player's turn again
			expect($scope.currentPlayer).toBe(1);

			//remember - the timer doesn't run out properly during tests, so it has to be flushed manually
			$timeout.flush();
		});

		//play out the rest of the round
		it('should end the round after all cells are filled for both players', function(){
			$scope.selectLetter('O');
			$scope.selectLetter('X');

			expect($scope.firstPlayerRows[2][1].letter).toBe('O');
			expect($scope.firstPlayerRows[2][2].letter).toBe('X');

			$timeout.flush();
			//again - assume the second player wants to win
			$scope.selectLetter('O');
			expect($scope.secondPlayerCells[2].letter).toBe('O');

			//the round should be over now, player 2 should be the winner
			expect($scope.winningPlayer).toBe(2);
		});

		it('should start a new round', function(){
			//this is tied to a button press from the 'round over' screen
			$scope.newRound();
			_checkNewRoundState();
			expect($scope.roundsPlayed).toBe(2);
		});

		it('should not allow selecting an invalid difficulty', function(){
			//valid difficitulties are 1(easy), 2(medium), and 3(hard)
			expect(function(){
				$scope.selectDifficulty(0);
			}).toThrow(new Error('Valid difficulty not chosen!'));
			expect(function(){
				$scope.selectDifficulty(4);
			}).toThrow(new Error('Valid difficulty not chosen!'));
		});

		it('should not start a game against AI without a difficulty set', function(){
			//this shouldn't be possible unless somebody messes with scope directly, but guard against it anyway
			$scope.difficulty = null;
			expect(function(){
				$scope.selectAI();
			}).toThrow(new Error('Valid difficulty not chosen!'));
		});

		it('should start a game against AI on hard difficulty', function(){
			$scope.selectDifficulty(3);
			$scope.selectAI();
			expect($scope.gameMode).toBe('1_PLAYER');

			//let's use a bigger board to make sure the AI is working
			$scope.selectSize(4);
			expect($scope.boardSize).toBe(4);
		});

		it('should make letter choices consistent with hard difficulty', function(){
			//since it's on hard mode, it should always try to win
			//that means it should always select the opposite of the player-selected letter
			_quickTurn(['X', 'X', 'X', 'X'], 'O');
			_quickTurn(['O', 'O', 'X', 'X'], 'X');
			_quickTurn(['O', 'X', 'X', 'X'], 'O');
			_quickTurn(['O', 'X', 'O', 'X'], 'O');

			//the round should be over now, player 2 should be the winner
			expect($scope.winningPlayer).toBe(2);
		});

		it('should start a new round against AI on medium difficulty', function(){
			$scope.newRound();
			_checkNewRoundState();
			expect($scope.roundsPlayed).toBe(3);

			$scope.selectAI();
			$scope.selectDifficulty(2);
			expect($scope.gameMode).toBe('1_PLAYER');
			$scope.selectSize(4);
			expect($scope.boardSize).toBe(4);
		});

		it('should make letter choices consistent with medium difficulty', function(){
			//since it's on medium difficulty, it should choose the winning letter 50% of the time
			//the other 50% of the time, it has a 50% chance of choosing either 'X' or 'O'

			//use these so we can control what number 'Math.random()' is passing back, and control the AI's random letter selection
			var randomNum = 1;
			spyOn(Math, 'random').and.callFake(function(){
				//since on Medium difficulty Math.random() is called twice rapidly, we need to test three different possibilities
				//one: the first check is above .5, AI chooses correctly
				//two: the first check is below .5, Math.random() runs again; the second check is above .5, the AI chooses 'X'
				//three: the first check is below .5, Math.random() runs again; the second check is below .5, the AI chooses 'O'

				//first, build in some support for cases two and three
				//for a certain number that satisfies the first check, decrement to satisfy the second check differently
				if(randomNum == 0.4)
				{
					//this will satisfy the case where the AI randomly chooses 'O'
					return randomNum--;
				}
				if(randomNum == 0.2)
				{
					//this will satisfy the case where the AI randomly chooses 'X'
					return randomNum++;
				}
				//this will satisfy
				return randomNum;
			});

			//first two turns - Math.random() will return '1', so the AI should select a winning letter
			_quickTurn(['X', 'X', 'X', 'X'], 'O');
			_quickTurn(['O', 'O', 'X', 'X'], 'X');
			randomNum = 0.4;
			//third turn - Math.random() will return '.4' then '-.4', so the AI should select 'O'
			_quickTurn(['O', 'X', 'O', 'X'], 'O');
			randomNum = 0.2;
			//fourth turn - Math.random() will return '.2' then '1.2', so the AI should select 'X'
			_quickTurn(['O', 'X', 'O', 'O'], 'X');

			//the player lucked out this time - their third line matches the AI's line with 'O, X, O, X'
			expect($scope.winningPlayer).toBe(1);
		});

		it('should start a new round against AI on easy difficulty', function(){
			$scope.newRound();
			_checkNewRoundState();
			expect($scope.roundsPlayed).toBe(4);

			$scope.selectAI();
			$scope.selectDifficulty(1);
			expect($scope.gameMode).toBe('1_PLAYER');
			$scope.selectSize(4);
			expect($scope.boardSize).toBe(4);
		});

		it('should not be able to end the widget before a round has finished', function(){
			expect(function(){
				$scope.end();
			}).toThrow(new Error('Round is not over yet!'));
		});

		it('should make letter choices consistent with easy difficulty', function(){
			//since it's on easy difficulty, it should choose teh winning letter 20% of the time
			//the other 80% of the time, it will choose the same letter the player chose

			var randomNum = 1;
			spyOn(Math, 'random').and.callFake(function(){
				return randomNum;
			});

			//first turn - Math.random() will return '1', so the AI should select a winning letter
			_quickTurn(['X', 'X', 'X', 'X'], 'O');
			randomNum = 0.5;
			//second and third turns - Math.random() will return '.5', so the AI should select the same letter as the player
			_quickTurn(['O', 'O', 'X', 'X'], 'O');
			_quickTurn(['O', 'O', 'X', 'X'], 'X');
			randomNum = 0.81;
			//fourth turn - Math.random() will return '.81', so the AI should select a winning letter
			_quickTurn(['O', 'O', 'X', 'X'], 'O');

			//bad luck to the player this time
			expect($scope.winningPlayer).toBe(2);
		});

		it('should end the widget', function(){
			spyOn(Materia.Score, 'submitQuestionForScoring');
			spyOn(Materia.Score, 'addGlobalScoreFeedback');
			spyOn(Materia.Engine, 'end');

			$scope.end();
			expect(Materia.Score.submitQuestionForScoring).toHaveBeenCalledWith(0, '', 100);
			expect(Materia.Score.addGlobalScoreFeedback).toHaveBeenCalledWith('Rounds played: 4');
			expect(Materia.Engine.end).toHaveBeenCalled();
		});
	});
});
