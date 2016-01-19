/*

Materia
It's a thing

Widget  : Dodgeball, Engine
Authors : Jonathan Warner

*/

var INITIAL_SIZE = 2;
var GameState = [];
var PlayerTwoState = [];
var currentTurn = 0;
var gameUpdated = function(){};
var GameType = '';
var AI_Difficulty_Level = 'WIN';

var X = 'X';
var O = 'O';

var Game = React.createClass({
	componentDidMount: function() {
		var Store = Namespace('Dodgeball').Store;
		Store.addChangeListener(function() {
			this.setState({
				instructionsShown: Store.getInstructionsShown(),
				gameModeModalShown: Store.getGameModeModalShown(),
				gameMode: Store.getGameMode(),
			});
			console.log("DEBUG: GameModeModalShown = ", Store.getGameModeModalShown());
		}.bind(this));
		gameUpdated = function() {
			var a;
			if (a = CheckWinner()) {
				this.setState({
					winner: a,
				});
			}
			var changedTurn = false;
			var cpuThinking = false;
			if (currentTurn != this.state.turn) {
				if (this.state.gameMode === '2_PLAYER') {
					changedTurn = true;
					setTimeout(function() {
						this.setState({ changedTurn: false });
					}.bind(this), 1000);
				} else {
					cpuThinking = true;
					setTimeout(function() {
						var currentCol = getCurrentColumn();
						PlayerTwoState[currentCol] = Namespace('Dodgeball').AI(AI_Difficulty_Level).getAIMove(GameState, currentCol);
						currentTurn = 0;
						this.setState({ cpuThinking: false, turn: 0 });
						gameUpdated();
					}.bind(this), 1000);
				}
			}
			this.setState({
				turn: currentTurn,
				changedTurn,
				cpuThinking,
			});
		}.bind(this);
	},
	getInitialState: function() {
		var Store = Namespace('Dodgeball').Store;
		GameState = [];
		PlayerTwoState = [];
		for (var i = 0; i < INITIAL_SIZE; i++) {
			var row = [];
			for (var j = 0; j < INITIAL_SIZE; j++) {
				row.push(null);
			}
			GameState.push(row);
			PlayerTwoState.push(null);
		}
		return {
			size: INITIAL_SIZE,
			turn: 0,
			instructionsShown: Store.getInstructionsShown(),
			gameModeModalShown: Store.getGameModeModalShown(),
			winner: false,
		};
	},
	_handleDismissWon: function() {
		INITIAL_SIZE = (++INITIAL_SIZE >= 7) ? 7 : INITIAL_SIZE;
		this.setState(this.getInitialState());
		this.setState({
			instructionsShown: false,
			gameModeModalShown: true
		});
	},
	render: function() {
		return (
			<div>
				<div className="Game_header">
					<div className="Game_logo" />
					<h1 className="Game_title">Dodgeball</h1>
				</div>
				{ this.state.instructionsShown ? <Instructions /> : null }
				{ this.state.gameModeModalShown ? <GameModeSelectModal /> : null }
				{ this.state.winner ? (
					<Modal>
						<h1>The Winner is:</h1>
						<GameResult data={this.state.winner}/>
						<CenteredContent>
							<BigButton onClick={this._handleDismissWon}>
								Play again!
							</BigButton>
						</CenteredContent>
					</Modal>
				) : null}
				<GameBoard size={this.state.size} turn={this.state.turn} won={this.state.won} />
				{ this.state.changedTurn ? <div className="Game_turnTransition">Player {this.state.turn + 1}&#39;s turn</div> : null }
				{ this.state.cpuThinking ? <div className="Game_turnTransition">CPU is thinking...</div> : null }
			</div>
		);
	},
});
var GameResult = React.createClass
({
	result: function()
	{
		var winner = this.props.data;
		var p1rows = [];
		var p2row;
		var p2cols = [];
		p2cols.push(<td className="blankCell"></td>);
		var winExplanation = (winner === 1) ? <p>...wins because they matched the row in solid green (each square matches) with Player 2&#39;s single row there at the bottom.</p> : <p>...wins because none of Player 1&#39;s rows are solid green (not all squares match the single row at the bottom).</p>
		for (var i = 0; i < GameState.length; i++)
		{
			var p1cols = [];
			p1cols.push(<td className="PlayerOneBoard_number">{i+1}</td>);
			for (var j = 0; j < GameState[i].length; j++)
			{
				if(GameState[i][j] === PlayerTwoState[j]) var bordercolor = "greenOutline";
				else var bordercolor = "redOutline";
				p1cols.push(<td className={bordercolor}>{GameState[i][j]}</td>);
			}
			p1rows.push(<tr>{p1cols}</tr>);
		}
		for (var k = 0; k < PlayerTwoState.length; k++) {
			p2cols.push(<td>{PlayerTwoState[k]}</td>);
		}
		p2row = <tr>{p2cols}</tr>;
		return (
			<div>
				<div className="demonstration_row">
					<div className="demonstration_win-scenario">
						<div id="winner-content-left">
							<p>
								<span className="demonstration_subheader">Player {winner}</span>
								{winExplanation}
							</p>
						</div>
						<div id="winner-content-right">
							<table className="demonstration_table">
								{p1rows}
								<tr><td className="blankCell"></td></tr>
								<tr><td className="blankCell"></td></tr>
								{p2row}
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	},
	render: function()
	{
		var board = this.result();
		return (<div>
					{board}
				</div>);
	}
});
var GameBoard = React.createClass({
	render: function() {
		var currentRow = 0;
		var currentCol = 0;
		if (this.props.turn === 0) {
			for (var i = 0; i < this.props.size; i++) {
				var found = false;
				for (var j = 0; j < this.props.size; j++) {
					if (GameState[i][j] === null) {
						found = true;
						currentRow = i;
						currentCol = j;
						break;
					}
				}
				if (found) break;
			}
		} else {
			for (var i = 0; i < this.props.size; i++) {
				if (!PlayerTwoState[i]) {
					currentCol = i;
					break;
				}
			}
		}
		return (
			<div className='GameBoard'>
				{ this.props.won ? <div>winner!</div> : null }
				<PlayerOneBoard
					currentCol={currentCol}
					currentRow={currentRow}
					size={this.props.size}
					turn={this.props.turn}
				/>
				<PlayerTwoBoard
					currentCol={currentCol}
					currentRow={currentRow}
					size={this.props.size}
					turn={this.props.turn}
				/>
				<PlayControls
					boardLocation={{ row: currentRow, col: currentCol }}
					turn={this.props.turn}
				/>
			</div>
		);
	}
});
var PlayerOneBoard = React.createClass({
	render: function() {
		var rows = [];
		for (var i = 0; i < this.props.size; i++) {
			var cols = [];
			cols.push(<td className="PlayerOneBoard_number">{i+1}</td>);
			for (var j = 0; j < this.props.size; j++) {
				cols.push(
					<td>
						<NumberBox
							active={
								i === this.props.currentRow &&
								j === this.props.currentCol &&
								this.props.turn === 0
							}
							activeRow={i === this.props.currentRow && this.props.turn === 0}
							onChange={updatePlayer1Board.bind(this, i, j)}
							value={GameState[i][j]}
						/>
					</td>
				);
			}
			rows.push(<tr>{cols}</tr>);
		}
		return (
			<div className="PlayerOneBoard">
				<table>
					{rows}
				</table>
			</div>
		);
	}
});
var PlayerTwoBoard = React.createClass({
	render: function() {
		var rows = [];
		var headerColumns = [];
		var inputColumns = [];
		for (var i = 0; i < this.props.size; i++) {
			headerColumns.push(<td className="PlayerTwoBoard_number">{i+1}</td>);
			inputColumns.push(
				<td>
					<NumberBox
						active={
							i === this.props.currentCol &&
								this.props.turn === 1
						}
						onChange={updatePlayer2Board.bind(this, i)}
						value={PlayerTwoState[i]}
					/>
				</td>
			);
		}
		rows.push(<tr>{headerColumns}</tr>);
		rows.push(<tr>{inputColumns}</tr>);
		return (
			<div className="PlayerTwoBoard">
				<table>
					{rows}
				</table>
			</div>
		);
	}
});
var NumberBox = React.createClass({
	render: function() {
		var classes = ['NumberBox'];
		if (this.props.active) {
			classes.push('NumberBox_active');
		}
		if (!this.props.activeRow) {
			classes.push('NumberBox_inactiveRow');
		}

		return (
			<div className={classes.join(' ')}>
				{this.props.value}
			</div>
		);
	}
});
var PlayControls = React.createClass({
	render: function() {
		var Store = Namespace('Dodgeball').Store;
		var classes = ["PlayControls"];
		if (this.props.turn) {
			if (Store.getGameMode() === 'CPU') {
				classes.push('cpuPlaying');
			} else {
				classes.push('playerTwo');
			}
		}
		return (
			<div className={classes.join(' ')}>
				<h1>Player {this.props.turn ? "2's" : "1's"} turn</h1>
				<button
					className="PlayControls_button"
					onClick={updatePlayerBoard.bind(this, this.props.turn, this.props.boardLocation, X)}>
					X
				</button>
				<button
					className="PlayControls_button"
					onClick={updatePlayerBoard.bind(this, this.props.turn, this.props.boardLocation, O)}>
					O
				</button>
			</div>
		);
	}
});
function updatePlayerBoard(turn, boardLocation, letter) {
	if (turn) {
		PlayerTwoState[boardLocation.col] = letter;
		currentTurn = 0;
	} else {
		GameState[boardLocation.row][boardLocation.col] = letter;
		if (boardLocation.col === INITIAL_SIZE - 1) {
			currentTurn = 1;
		}
	}
	gameUpdated();
}
function updatePlayer1Board(i, j, event) {
	GameState[i][j] = event.target.value;
	if (j === INITIAL_SIZE - 1)
		currentTurn = 1;
	gameUpdated()
}
function updatePlayer2Board(i, event) {
	PlayerTwoState[i] = event.target.value;
	currentTurn = 0;
	gameUpdated()
}
var CheckWinner = function() {
	for (var i = 0; i < GameState.length; i++) {
		var won = true;
		for (var j = 0; j < PlayerTwoState.length; j++) {
			if (!PlayerTwoState[j] || PlayerTwoState[j] != GameState[i][j]) {
				won = false;
				break;
			}
		}
		if (won) {
			return 1;
		}
	}
	if (PlayerTwoState[PlayerTwoState.length -1]) {
		return 2;
	}
	return false;
};
var GameModeSelectModal = React.createClass({
	onDifficultyChange: function(difficulty) {
		AI_Difficulty_Level = difficulty;
	},
	_chooseGameMode: function(type) {
		var Actions = Namespace('Dodgeball').Actions;
		Actions.selectGameMode(type);
	},
	render: function() {
		return (
			<Modal>
				<h1>Choose a play mode</h1>
				<h3>Play against another person locally</h3>
				<p>Have two players play at the same computer.</p>
				<BigButton onClick={this._chooseGameMode.bind(this, '2_PLAYER')}>Play</BigButton>
				<h3>Play against the computer</h3>
				<p>Play against the computer player.</p>
				<BigButton onClick={this._chooseGameMode.bind(this, 'CPU')}>Play</BigButton>
				<ModeSelection onDifficultyChange={this.onDifficultyChange}></ModeSelection>
			</Modal>
		);
	},
});
var Instructions = React.createClass({
	getInitialState: function() {
		return {
			step: 0,
			animation: true
		};
	},
	componentDidMount: function() {
		this.resetAnimation();
	},
	componentWillUnmount: function() {
		clearTimeout(this._animationTimeout);
	},
	_handleNextButtonClicked: function() {
		this.setState({ step: this.state.step + 1 });
		var Actions = Namespace('Dodgeball').Actions;
		if (this.state.step + 1 === 3) {
			Actions.dismissInstructions();
		}
	},
	resetAnimation: function() {
		this.setState({ animation: false });
		setTimeout(function() {
			this.setState({ animation: true });
			this._animationTimeout = setTimeout(this.resetAnimation.bind(this), 12000);
		}.bind(this), 1000);
	},
	render: function() {
		var instruction = null;
		switch (this.state.step) {
			case 0:
				var tableClass = "Instructions_table";
				if (this.state.animation)
					tableClass += " animate";
				instruction = (<div>
					<p>
						Player 1 fills a row with X&#39;s or O&#39;s
					</p>
					<div className="Instructions_p1Tutorial">
						<div className={tableClass}>
							<table>
								<tr>
									<td>X</td>
									<td>X</td>
									<td>O</td>
									<td>X</td>
								</tr>
							</table>
							<div className="demonstration_cursor">
								<img src="assets/cursor.svg" />
							</div>
						</div>
						<div className="demonstration_controls">
							<div className="demonstration_button">X</div>
							<div className="demonstration_button">O</div>
							<div className="demonstration_cursor"></div>
						</div>
					</div>
				</div>);
				break;
			case 1:
				var tableClass = "Instructions_table";
				var tableClass2 = "Instructions_table2";
				if (this.state.animation)
				{
					tableClass += " animate";
					tableClass2 += " animate";
				}
				instruction = (<div>
					<p>
						Player 2 fills a single space with an X or an O
					</p>
					<div className="Instructions_p2Tutorial">
						<div className={tableClass}>
							<table>
								<tbody>
									<tr>
										<td className="oldMoves">X</td>
										<td className="oldMoves">X</td>
										<td className="oldMoves">O</td>
										<td className="oldMoves">X</td>
									</tr>
									<tr>
										<td className="blankCell"></td>
									</tr>
								</tbody>
							</table>
							<div className="demonstration_cursor">
								<img src="assets/cursor.svg" />
							</div>
						</div>
						<div className={tableClass2}>
							<table>
								<tbody>
									<tr>
										<td>O</td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="demonstration_controls">
							<div className="demonstration_button">X</div>
							<div className="demonstration_button">O</div>
							<div className="demonstration_cursor"></div>
						</div>
					</div>
				</div>);
				break;
			case 2:
				instruction = (<div>
					<div className="demonstration_row">
						<div className="demonstration_win-scenario">
							<p className="left">
								<span className="demonstration_subheader">Player 1 wins if:</span><br/>any one row matches<br/>Player 2&#39;s single row.
							</p>
							<div className="demonstration_table right">
								<table>
									<tbody>
										<tr>
											<td>X</td>
											<td>X</td>
											<td>O</td>
											<td>X</td>
										</tr>
										<tr>
											<td className="greenOutline">O</td>
											<td className="greenOutline">X</td>
											<td className="greenOutline">O</td>
											<td className="greenOutline">X</td>
										</tr>
										<tr>
											<td>O</td>
											<td>O</td>
											<td>X</td>
											<td>X</td>
										</tr>
										<tr>
											<td className="blankCell"></td>
										</tr>
										<tr>
											<td className="greenOutline">O</td>
											<td className="greenOutline">X</td>
											<td className="greenOutline">O</td>
											<td className="greenOutline">X</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<hr/>
					<div className="demonstration_row">
						<div className="demonstration_win-scenario">
							<p className="left">
								<span className="demonstration_subheader">Player 2 wins if:</span><br/>their single row doesn&#39;t<br/>match any of Player 1&#39;s rows.
							</p>
							<div className="demonstration_table right">
								<table>
									<tbody>
										<tr>
											<td>X</td>
											<td>X</td>
											<td>O</td>
											<td>X</td>
										</tr>
										<tr>
											<td>O</td>
											<td>X</td>
											<td>O</td>
											<td>X</td>
										</tr>
										<tr>
											<td className="greenOutline">O</td>
											<td className="greenOutline">O</td>
											<td className="redOutline">X</td>
											<td className="greenOutline">X</td>
										</tr>
										<tr>
											<td className="blankCell"></td>
										</tr>
										<tr>
											<td className="greenOutline">O</td>
											<td className="greenOutline">O</td>
											<td className="redOutline">O</td>
											<td className="greenOutline">X</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>);
				break;
		}
		return (
			<Modal>
				<h1>How to play Dodgeball</h1>
				{ instruction }
				<CenteredContent>
					<BigButton onClick={this._handleNextButtonClicked}>Next</BigButton>
				</CenteredContent>
			</Modal>
		);
	},
});
var Modal = React.createClass({
	render: function() {
		return (
			<div>
				<div className="Modal_Background" />
				<div className="Modal_Content">
					{this.props.children}
				</div>
			</div>
		);
	},
});
var BigButton = React.createClass({
	render: function() {
		return (
			<button className="BigButton" onClick={this.props.onClick}>
				{this.props.children}
			</button>
		);
	},
});
var CenteredContent = React.createClass({
	render: function() {
		return (
			<div className="CenteredContent">
				{this.props.children}
			</div>
		);
	},
});
var ModeSelection = React.createClass({
	getInitialState: function() {
		return {
			selected: AI_Difficulty_Level
		};
	},
	onCheckedChange: function(e) {
		this.setState({
			selected: e.currentTarget.value
		});
		this.props.onDifficultyChange(e.currentTarget.value);
	},
	render: function() {
		return (
			<div className="ModeSelection">
				<h4>AI Difficulty Level</h4>
				<ul>
					<li><label>Hard<input name="difficulty" type="radio" value="WIN" onChange={this.onCheckedChange} checked={this.state.selected === "WIN"} /> </label></li>
					<li><label>Average<input name="difficulty" type="radio" value="50" onChange={this.onCheckedChange} checked={this.state.selected === "50"} /> </label></li>
					<li><label>Easy<input name="difficulty" type="radio" value="LOSE" onChange={this.onCheckedChange} checked={this.state.selected === "LOSE"} /> </label></li>
				</ul>
			</div>
		);
	},
});

var getCurrentColumn = function() {
	for (var i = 0; i < PlayerTwoState.length; i++) {
		if (!PlayerTwoState[i]) {
			return i;
		}
	}
	return 0;
}

Namespace('Dodgeball').Engine = (function() {
	var start = function(instance, qset, version) {
		React.render(<Game />, document.getElementById("entrypoint"));
	};

	// Public.
	return {start};
})();
