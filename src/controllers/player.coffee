Dodgeball = angular.module 'dodgeball'

Dodgeball.controller 'dodgeballPlayerCtrl', ['$scope', '$timeout', 'AI', ($scope, $timeout, AI) ->
	_INSTRUCTIONS_LENGTH = 5

	_DIFFICULTY_EASY   = 1
	_DIFFICULTY_MEDIUM = 2
	_DIFFICULTY_HARD   = 3

	_MODE_HUMAN = '2_PLAYER'
	_MODE_AI    = '1_PLAYER'

	_MINIMUM_SIZE = 2
	_MAXIMUM_SIZE = 7

	_PLAYER_CPU = false
	_PLAYER_ONE = 1
	_PLAYER_TWO = 2

	_TURN_DELAY = 1000

	$scope.title = 'Dodgeball'
	$scope.tutorialStep = 1

	$scope.choosingMode = false
	$scope.choosingSize = false
	$scope.roundOver    = false

	$scope.difficulty = _DIFFICULTY_HARD
	$scope.gameMode   = null
	$scope.boardSize  = null

	$scope.firstPlayerRows   = null
	$scope.secondPlayerCells = null

	$scope.currentRow    = null
	$scope.currentColumn = null
	$scope.currentCell   = null
	$scope.currentPlayer = null
	$scope.changingTurn  = false

	$scope.roundsPlayed  = 0
	$scope.winningPlayer = null

	$scope.start = (instance) ->
		$scope.title = instance.name

		Materia.Engine.setHeight()
		$scope.$apply()

	$scope.tutorialNext = ->
		throw new Error 'Tutorial is already over!' unless $scope.tutorialStep > _INSTRUCTIONS_LENGTH or $scope.gameMode is null and !$scope.choosingMode
		$scope.tutorialStep++
		$scope.newRound() if $scope.tutorialStep is _INSTRUCTIONS_LENGTH

	$scope.newRound = ->
		$scope.roundsPlayed++

		$scope.gameMode          = null
		$scope.choosingMode      = true
		$scope.choosingSize      = false
		$scope.roundOver         = false
		$scope.firstPlayerRows   = null
		$scope.secondPlayerCells = null
		$scope.currentRow        = null
		$scope.currentColumn     = null
		$scope.currentCell       = null
		$scope.currentPlayer     = null
		$scope.changingTurn      = false
		$scope.winningPlayer     = null

	_selectMode = (mode) ->
		throw new Error 'Game mode already chosen!' unless $scope.gameMode is null
		$scope.choosingMode = false
		$scope.gameMode = mode
		$scope.choosingSize = true

	$scope.selectHuman = ->
		_selectMode _MODE_HUMAN

	$scope.selectDifficulty = (difficulty) ->
		throw new Error 'Valid difficulty not chosen!' unless difficulty >= _DIFFICULTY_EASY and difficulty <= _DIFFICULTY_HARD
		$scope.difficulty = difficulty

	$scope.selectAI = ->
		throw new Error 'Valid difficulty not chosen!' unless $scope.difficulty >= _DIFFICULTY_EASY and $scope.difficulty <= _DIFFICULTY_HARD
		_selectMode _MODE_AI

	$scope.selectSize = (size) ->
		throw new Error 'No size given!' unless size
		throw new Error 'Game mode not chosen!' unless $scope.gameMode
		throw new Error 'Board size already chosen!' unless $scope.choosingSize
		throw new Error 'Invalid board size!' unless size >= _MINIMUM_SIZE and size <= _MAXIMUM_SIZE
		$scope.boardSize = size
		$scope.choosingSize = false
		_generateTable()
		_startRound()

	_generateTable = ->
		size = $scope.boardSize
		$scope.firstPlayerRows = []
		$scope.secondPlayerCells = []
		for i in [1..size]
			newRow = {}
			for j in [1..size]
				newRow[j] =
					letter: ''
			$scope.firstPlayerRows[i] = newRow

		$scope.secondPlayerCells = []
		for i in [1..size]
			$scope.secondPlayerCells[i] =
				letter: ''

	_startRound = ->
		$scope.currentRow = 1
		$scope.currentColumn = 1
		$scope.currentCell = $scope.firstPlayerRows[$scope.currentRow][$scope.currentColumn]
		$scope.currentPlayer = _PLAYER_ONE

	$scope.selectLetter = (letter) ->
		throw new Error 'Wait for the next turn!' if $scope.changingTurn
		throw new Error 'No cell to choose a letter for!' unless $scope.currentCell
		throw new Error 'Valid letter not chosen!' if letter isnt 'X' and letter isnt 'O'
		$scope.currentCell.letter = letter

		if $scope.currentPlayer is _PLAYER_ONE
			if ++$scope.currentColumn > $scope.boardSize
				$scope.currentColumn = 1
				_swapPlayers()
		else
			if ++$scope.currentRow > $scope.boardSize
				_endRound()
			else
				_swapPlayers $scope.gameMode is _MODE_AI

		if $scope.currentPlayer is _PLAYER_ONE
			$scope.currentCell = $scope.firstPlayerRows[$scope.currentRow][$scope.currentColumn]
		else
			$scope.currentCell = $scope.secondPlayerCells[$scope.currentRow]

	_endRound = ->
		$scope.winningPlayer = _PLAYER_TWO # player 1 didn't win until proven otherwise
		for row in [1..$scope.boardSize]
			for cell in [1..$scope.boardSize]
				matched = true
				if $scope.firstPlayerRows[row][cell].letter isnt $scope.secondPlayerCells[cell].letter
					matched = false
					break
			if matched
				$scope.winningPlayer = _PLAYER_ONE
				break

		$scope.roundOver = true

	_swapPlayers = (quiet = false) ->
		if $scope.gameMode is _MODE_HUMAN
			$scope.currentPlayer = if $scope.currentPlayer is _PLAYER_ONE then _PLAYER_TWO else _PLAYER_ONE
		else
			$scope.currentPlayer = if $scope.currentPlayer is _PLAYER_ONE then _PLAYER_CPU else _PLAYER_ONE

		unless quiet
			$scope.changingTurn = true
			$timeout ->
				$scope.changingTurn = false
				if $scope.gameMode is _MODE_AI
					_computerTurn()
			, _TURN_DELAY

	_computerTurn = ->
		$scope.selectLetter AI.makeChoice $scope.firstPlayerRows[$scope.currentRow][$scope.currentRow].letter, $scope.difficulty

	$scope.end = ->
		throw new Error 'Round is not over yet!' unless $scope.winningPlayer
		Materia.Score.submitQuestionForScoring 0, "", 100
		Materia.Score.addGlobalScoreFeedback "Rounds played: " + $scope.roundsPlayed
		Materia.Engine.end
		Materia.Engine.end yes

	Materia.Engine.start $scope
]