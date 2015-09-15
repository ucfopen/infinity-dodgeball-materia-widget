/*

Materia
It's a thing

Widget  : Dodgeball, Engine
Authors : Jonathan Warner

*/

var INITIAL_SIZE = 6;
var GameState = [];
var PlayerTwoState = [];
var currentTurn = 0;
var gameUpdated = function(){};

var X = 'X';
var O = 'O';

var Game = React.createClass({
	componentDidMount: function() {
		var Store = Namespace('Dodgeball').Store;
		Store.addChangeListener(function() {
			this.setState({
				instructionsShown: Store.getInstructionsShown(),
			});
		}.bind(this));
		gameUpdated = function() {
			var a;
			if (a = CheckWinner()) {
				this.setState({
					winner: a,
				});
			}
			var changedTurn = false;
			if (currentTurn != this.state.turn) {
				changedTurn = true;
				setTimeout(function() {
					this.setState({ changedTurn: false });
				}.bind(this), 1000);
			}
			this.setState({
				turn: currentTurn,
				changedTurn,
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
			winner: false,
		};
	},
	_handleDismissWon: function() {
		this.setState(this.getInitialState());
	},
	render: function() {
		return (
			<div>
				<div className="Game_header">
					<div className="Game_logo" />
					<h1 className="Game_title">Dodgeball</h1>
				</div>
				{ this.state.instructionsShown ? <Instructions /> : null }
				{ this.state.winner ? (
					<Modal>
						Player {this.state.winner} wins!
						<CenteredContent>
							<BigButton onClick={this._handleDismissWon}>
								Play again!
							</BigButton>
						</CenteredContent>
					</Modal>
				) : null}
				<GameBoard size={this.state.size} turn={this.state.turn} won={this.state.won} />
				{ this.state.changedTurn ? <div className="Game_turnTransition">Player {this.state.turn + 1}'s turn</div> : null }
			</div>
		);
	},
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
			var thisRow = false;
			for (var j = 0; j < this.props.size; j++) {
				cols.push(
					<td>
						<NumberBox
							active={
								i === this.props.currentRow &&
								j === this.props.currentCol &&
								this.props.turn === 0
							}
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

		return (
			<div className={classes.join(' ')}>
				{this.props.value}
			</div>
		);
	}
});
var PlayControls = React.createClass({
	render: function() {
		return (
			<div className="PlayControls">
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
var Instructions = React.createClass({
	getInitialState: function() {
		return {
			step: 0
		};
	},
	_handleNextButtonClicked: function() {
		this.setState({ step: this.state.step + 1 });
		var Actions = Namespace('Dodgeball').Actions;
		if (this.state.step + 1 === 3) {
			Actions.dismissInstructions();
		}
	},
	render: function() {
		var instruction = null;
		switch (this.state.step) {
			case 0:
				instruction = (<div>Here are some instructions about the game.</div>);
				break;
			case 1:
				instruction = (<div>Some more instructions.</div>);
				break;
			case 2:
				instruction = (<div>Ready, set, go!</div>);
				break;
		}
		return (
			<Modal>
				<h1>Instructions</h1>
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

Namespace('Dodgeball').Engine = (function() {
	var start = function(instance, qset, version) {
		React.render(<Game />, document.getElementById("entrypoint"));
	};

	// Public.
	return {start};
})();
