Dodgeball = angular.module 'dodgeball'

Dodgeball.service 'AI', ->

	_DIFFICULTY_EASY   = 1
	_DIFFICULTY_MEDIUM = 2
	_DIFFICULTY_HARD   = 3

	makeChoice = (playerLetter, level) ->
		letter = playerLetter

		switch parseInt level
			when _DIFFICULTY_EASY
				if Math.random() > 0.8
					letter = _win letter
			when _DIFFICULTY_MEDIUM
				if Math.random() > 0.5
					letter = _win letter
				else
					letter = if Math.random() > 0.5 then 'X' else 'O'
			when _DIFFICULTY_HARD
				letter = _win letter
		letter

	_win = (letter) ->
		if letter is 'X' then 'O' else 'X'

	makeChoice: makeChoice