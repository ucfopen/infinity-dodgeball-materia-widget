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
var CheckWinner = function() {
	for (var i = 0; i < GameState.length; i++) {
		var won = true;
		for (var j = 0; j < PlayerTwoState.length; j++) {
			if (PlayerTwoState[j] != GameState[i][j]) {
				won = false;
				break;
			}
		}
		if (won) {
			alert("win! " + i);
		}
	}
};
var Game = React.createClass({
	componentDidMount: function() {
		gameUpdated = function() {
			console.log("GAME UDPATED");
			this.setState({
				turn: currentTurn
			});
		}.bind(this);
	},
	getInitialState: function() {
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
		};
	},
	render: function() {
		return (
			<div>
				<h1 className='Game_header'>Dodgeball</h1>
				<GameBoard size={this.state.size} turn={this.state.turn} />
			</div>
		);
	},
});
var GameBoard = React.createClass({
	render: function() {
		return (
			<div className='GameBoard'>
				<PlayerOneBoard size={this.props.size} turn={this.props.turn} />
				<PlayerTwoBoard size={this.props.size} turn={this.props.turn} />
			</div>
		);
	}
});
var PlayerOneBoard = React.createClass({
	render: function() {
		var rows = [];
		var currentRow = 0;
		var currentCol = 0;
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
		for (var i = 0; i < this.props.size; i++) {
			var cols = [];
			cols.push(<td className="PlayerOneBoard_number">{i+1}</td>);
			var thisRow = false;
			for (var j = 0; j < this.props.size; j++) {
				cols.push(<td><InputBox enabled={i === currentRow && j === currentCol && this.props.turn === 0} onChange={updatePlayer1Board.bind(this, i, j)} /></td>);
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
		var currentCol = 0;
		for (var i = 0; i < this.props.size; i++) {
			if (!PlayerTwoState[i]) {
				currentCol = i;
				break;
			}
		}
		for (var i = 0; i < this.props.size; i++) {
			headerColumns.push(<td className="PlayerTwoBoard_number">{i+1}</td>);
			inputColumns.push(<InputBox enabled={i === currentCol && this.props.turn === 1} onChange={updatePlayer2Board.bind(this, i)} />);
		}
		rows.push(<tr>{headerColumns}</tr>);
		rows.push(<tr>{inputColumns}</tr>);
		return (
			<div className="PlayerTwoBoard">
				<table>
					{rows}
				</table>
				<input type="button" onClick={CheckWinner} />
			</div>
		);
	}
});
var InputBox = React.createClass({
	render: function() {
		return (
			<td className="InputBox">
				<input type="text" className="InputBox_input" disabled={!this.props.enabled} onChange={this.props.onChange} />
			</td>
		);
	}
});
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

Namespace('Dodgeball').Engine = (function() {
	var start = function(instance, qset, version) {
		React.render(<Game />, document.getElementById("entrypoint"));
	};

	// Public.
	return {start};
})();

