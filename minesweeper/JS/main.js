'use strict';

var elForm = document.querySelector('.form');
var elBoard = document.querySelector('.board');
var elLives = document.querySelector('.lives');
var elTimerBox = document.querySelector('.timer-box');
var elRestartBtn = document.querySelector('.btn-restart');
var elSafeClickAmount = document.querySelector('.safe-btn-box span');
var elManuallyCreate = document.querySelector('.manually-create-box');

const gLevels = {
	beginner: {
		size: 4,
		mines: 2,
	},
	medium: {
		size: 8,
		mines: 12,
	},
	expert: {
		size: 12,
		mines: 30,
	},
};
const MINE = '💣';
const MARKED_IMG = '<img class="img" src="img/flag.png" alt="flag" />';

var gEmptyPlaces = [];
var unopenedLocations = [];
var gBoard;
var timerInterval;
var gNumMarked = 0;
var safeClickedCount = 3;
// Will hold the size that the user choose.
var gSize;
var gMines;
var gLives;
var gGame;
var gMinesLocations = [];

function init() {
	gHints = creteHintsObj();
	elHints.innerText = `${gHints.hints.join(' ')}`;
	gLives = `❤️ ❤️ ❤️`.split(' ');
	elLives.innerText = `${gLives.join(' ')}`;
	elRestartBtn.innerText = START;
	gGame = createGameObj();

	elManuallyCreate.classList.add('hidden');
	elBoard.classList.add('hidden');
	elForm.classList.remove('hidden');

	// Resetting the timer
	elTimerBox.innerText = `00:00`;
	clearInterval(timerInterval);
	//
	gMinesLocations = [];
	safeClickedCount = 3;
	gNumMarked = 0;
	gIsManuallyOn = false;
}
//

var gBombCoords;

function checkboxClicked(elCell, level) {
	gSize = gLevels[level].size;
	gMines = gLevels[level].mines;
	// Removing the check sign
	elCell.checked = false;
	//
	elManuallyCreate.classList.remove('hidden');
	//
	elForm.classList.add('hidden');
	// Creating the board in the chosen size
	gBoard = createMat(gSize, gSize);

	gEmptyPlaces = emptyLocations();
	unopenedLocations = gEmptyPlaces.slice();

	renderBoard();
}
// FUNCTIONS

function createBoard() {
	for (var i = 0; i < gSize; i++) {
		for (var j = 0; j < gSize; j++) {
			if (gBoard[i][j].isMine) continue;
			gBoard[i][j].minesAroundCount = numOfNeighbor(gBoard, i, j);
		}
	}
}

//

////////////
// Auxiliary function
function emptyLocations() {
	var board = [];
	for (var i = 0; i < gSize; i++) {
		for (var j = 0; j < gSize; j++) board.push({ i, j });
	}
	return board;
}

function getCellCoord(strCellId) {
	var parts = strCellId.split('-');
	return { i: +parts[1], j: +parts[2] };
}

function getSelector(coord) {
	return '#cell-' + coord.i + '-' + coord.j;
}

function createGameObj() {
	return { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };
}
