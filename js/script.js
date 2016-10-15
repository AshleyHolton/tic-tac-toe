/*MIT License

Copyright (c) 2016 Ashley Holton

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

var Game = function()
{
	this.isPlaying = false;
	this.greensTurn = false;
	this.status = '';
	this.winningOrder = [];
	this.grid = ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'];

	this.checkForGameOver = function()
	{
		for(var i = 0; i < 3; i++)
		{
			if(this.grid[i] != 'empty' && this.grid[i] == this.grid[i + 3] && this.grid[i + 3] == this.grid[i + 6])
			{
				this.winningOrder = [i, i + 3, i + 6];
				this.status = this.grid[i] + '-wins';
				return true;
			}
		}

		for(var i = 0; i < 7; i += 3)
		{
			if(this.grid[i] != 'empty' && this.grid[i] == this.grid[i + 1] && this.grid[i + 1] == this.grid[i + 2])
			{
				this.winningOrder = [i, i + 1, i + 2];
				this.status = this.grid[i] + '-wins';
				return true;
			}
		}

		for(var i = 0, j = 4; i < 3; i += 2, j -= 2)
		{
			if(this.grid[i] != 'empty' && this.grid[i] == this.grid[i + j] && this.grid[i + j] == this.grid[i + (2 * j)])
			{
				this.winningOrder = [i, i + j, i + (2 * j)];
				this.status = this.grid[i] + '-wins';
				return true;
			}
		}

		if(this.grid.indexOf("empty") == -1)
		{
			this.status = 'draw';
			return true;
		}

		return false;
	};

	this.goToNextTurn = function()
	{
		if(this.checkForGameOver())
		{
			this.isPlaying = false;
		}
		else
		{
			this.greensTurn = !this.greensTurn;
			this.status = this.greensTurn ? "greens-turn" : "reds-turn";
		}

		tictactoe.updateUI();
	};

	this.start = function()
	{
		if(!this.isPlaying)
		{
			this.isPlaying = true;
			this.goToNextTurn();
		}
	};
};

var tictactoe = {

	game: null,
	greenWins: 0,
	redWins: 0,
	gamesPlayed: 0,

	init: function()
	{
		var cells = document.querySelectorAll('.cell');

		for(var i = 0; i < cells.length; i++)
		{
			cells[i].addEventListener('click', tictactoe.onCellClick, false);
		}

		greenWins = 0;
		redWins = 0;
		gamesPlayed = 0;

		tictactoe.start();
	},

	resetGrid: function()
	{
		var cells = document.querySelectorAll('.cell');

		for(var i = 0; i < cells.length; i++)
		{
			cells[i].setAttribute('class', 'cell');
		}
	},

	onCellClick: function()
	{
		if(game.isPlaying && !this.classList.contains('used'))
		{
			var cellIndex = this.getAttribute('data-index');

			game.grid[cellIndex] = game.greensTurn ? "green" : "red";

			var cell = document.querySelectorAll('.cell')[cellIndex];
			cell.classList.add('used');
			cell.classList.add(game.greensTurn ? "green" : "red");

			game.goToNextTurn();
		}
	},

	updateUI: function()
	{
		var container = document.querySelector('#grid-container');
		container.setAttribute("class", game.greensTurn ? "go-green" : "go-red");

		var messages = document.querySelectorAll('#messages div');
		for(var i = 0; i < messages.length; i++)
		{
			messages[i].style.opacity = messages[i].id == game.status ? 1 : 0;
		}

		if(!game.isPlaying)
		{
			container.setAttribute("class", "");

			gamesPlayed += 1;
			greenWins += game.status == "green-wins" ? 1 : 0;
			redWins += game.status == "red-wins" ? 1 : 0;

			document.querySelector('#games-won-green .bottom-text').innerHTML = greenWins;
			document.querySelector('#games-won-red .bottom-text').innerHTML = redWins;
			document.querySelector('#games-played .bottom-text').innerHTML = gamesPlayed;

			if(game.status != "draw")
			{
				var cells = document.querySelectorAll('.cell');

				for(var i = 0; i < cells.length; i++)
				{
					if(game.winningOrder.indexOf(i) == -1)
					{
						cells[i].setAttribute('class', 'cell');
					}
				}
			}

			setTimeout(function()
			{
				tictactoe.start();
			}, 2000);
		}
		else
		{
			container.classList.add("playing");
		}
	},

	start: function()
	{
		tictactoe.resetGrid();
		game = new Game();
		game.start();
	}
}

window.onload = function()
{
	tictactoe.init();
}