'use strict';
var elHints = document.querySelector('.hints-box');

const WIN = `😎`;
const LOSE = `🤯`;
const START = `😃`;

var gIsManuallyOn = false;
var hintInterval;
// var mainesCount = 0;
var gPrevElement = [];
var gHints = creteHintsObj();

function cellClicked(elCell, key) {
	var curCoord = getCellCoord(elCell.id);
	// C
	if (gIsManuallyOn) {
		// Check if there is already a mine in this cell
		if (elCell.classList.contains('unopened')) {
			elCell.classList.remove('unopened');
			elCell.classList.add('mine');
			// Add a mines
			addMine(curCoord, true);
			// Updating the number of mines remain to place
			var minesRemain = gMines - gMinesLocations.length;

			elManuallyCreate.querySelector('span').innerText = `${
				minesRemain || 'Touch cell to start'
			} mines remain`;
		}

		return;
	}
	if (!gGame.isOn && gGame.shownCount) return;
	if (gHints.isOn) {
		openCells(curCoord.i, curCoord.j, true);
		setTimeout(() => {
			gHints.isOn = false;
			// Adding the class hidden to each one
			gPrevElement.forEach((e) => e.classList.add('unopened'));
			// Clearing the prev array
			gPrevElement = [];
		}, 1000);
		return;
	}
	if (!gGame.isOn && key.type !== 'contextmenu')
		startGame(curCoord, gMinesLocations.length === 0);

	var curCell = gBoard[curCoord.i][curCoord.j];

	if (key.type === 'click' && curCell.isMarked) return;
	// Adding a mark
	if (key.type === 'contextmenu') {
		addMarked(curCell, elCell);
		return;
	}

	// If there is a mine in the chosen cell
	if (curCell.isMine && !curCell.isShown) {
		// Removing one life
		gLives.pop();
		if (!gLives.length) {
			for (let i = 0; i < gMinesLocations.length; i++) {
				var elCurMine = document.querySelector(getSelector(gMinesLocations[i]));
				elCurMine.classList.remove('unopened');
				elCurMine.classList.add('mine');
			}
			gameOver();
		}

		elCell.classList.remove('unopened');
		elCell.classList.add('mine');
		// Changing the btn em
		elRestartBtn.innerText = LOSE;
		curCell.isShown = true;
		gGame.shownCount++;
		elLives.innerText = `${gLives.join(' ')}`;
		return;
	}
	openCells(curCoord.i, curCoord.j);
}

function openCells(i, j, reverse = false) {
	// Check
	if (
		i < 0 ||
		j < 0 ||
		i >= gBoard.length ||
		j >= gBoard[0].length ||
		gBoard[i][j].isMine ||
		gBoard[i][j].isShown
	)
		return;

	var curCell = gBoard[i][j];
	var cellElement = document.querySelector(getSelector({ i, j }));

	cellElement.classList.remove('unopened');
	// Updating the current cell isShown to true
	curCell.isShown = reverse ? false : true;
	// Updating the amount of cells that shown
	gGame.shownCount++;

	removeFromTheArray({ i, j }, unopenedLocations);
	if (reverse) {
		gPrevElement.push(cellElement);
		gGame.shownCount--;
	}
	// if its not an empty cell
	if (curCell.minesAroundCount) return;

	return (
		openCells(i - 1, j, reverse) ||
		openCells(i + 1, j, reverse) ||
		openCells(i, j - 1, reverse) ||
		openCells(i, j + 1, reverse)
	);
}
function hintClicked() {
	// Check if there is any hints left or if the game already started
	if (!gHints.hints.length || !gGame.isOn) return;
	// Removing the hint
	gHints.hints.pop();
	// Updating the DOM
	elHints.innerText = `${gHints.hints.join(' ')}`;
	// Up
	gHints.isOn = true;
}
function safeClickClicked() {
	if (!safeClickedCount || !gGame.isOn) return;
	elSafeClickAmount.innerText = `${--safeClickedCount} remain`;
	if (!safeClickedCount) {
		elSafeClickAmount.style.color = `#d00000`;
	}
	var idx = randomInt(unopenedLocations.length - 1, 0);
	var coord = unopenedLocations[idx];

	// var curCell = gBoard[coord.i][coord.j];
	var el = document.querySelector(`${getSelector(coord)}`);
	el.style.backgroundColor = `red`;
	setTimeout(() => {
		el.style.backgroundColor = `#333`;
	}, 1000);
}

/////

// MINES FUNCTIONS
function addMines() {
	const minesLocations = [];
	for (var idx = 0; idx < gMines; idx++) {
		const curIdx = randomInt(gEmptyPlaces.length - 1, 0);
		addMine(gEmptyPlaces[curIdx]);
		gEmptyPlaces.splice(curIdx, 1);
	}
	return minesLocations;
}

function addMarked(cell, elCell) {
	cell.isMarked = cell.isMarked ? false : true;
	if (cell.isMarked && cell.isMine) gNumMarked++;
	if (!cell.isMarked && cell.isMine) gNumMarked--;
	elCell.innerHTML = MARKED_IMG;
	elCell.classList.toggle('marked');
	// Wining
	if (gNumMarked === gMines) {
		gameOver(true);
	}
}
// START
function startGame(coord, isRegularStart) {
	if (isRegularStart) {
		// Removing the first cell from the empty array
		removeFromTheArray(coord, gEmptyPlaces);
		// creating an array that holds the bombs coords
		gMinesLocations = addMines();
		// updating the unopened array
		unopenedLocations = gEmptyPlaces.slice();
	}

	createBoard();
	renderBoard();
	gGame.isOn = true;
	// Removing the option of manually create
	elManuallyCreate.classList.add('hidden');

	// Start the timer
	renderTimer(new Date());
}
function gameOver(win = false) {
	clearInterval(timerInterval);
	gGame.isOn = false;
	elRestartBtn.innerText = win ? WIN : LOSE;
}
// END
function creteHintsObj() {
	return { hints: `💡 💡 💡`.split(' '), isOn: false };
}
function removeFromTheArray(coord, arr) {
	for (let idx = 0; idx < arr.length; idx++) {
		var curCell = arr[idx];
		if (curCell.i !== coord.i || coord.j !== curCell.j) continue;
		return arr.splice(idx, 1);
	}
}

function manuallyCreate() {
	gIsManuallyOn = true;
	elManuallyCreate.querySelector('span').innerText = `${
		gMines - gMinesLocations.length
	} mines remain`;
}
function addMine(coord, toRemove = false) {
	gMinesLocations.push(coord);
	//
	gBoard[coord.i][coord.j].isMine = true;
	// Removing from the array
	toRemove && removeFromTheArray(coord, gEmptyPlaces);
	console.log(gMinesLocations);

	if (gMinesLocations.length === gMines && toRemove) {
		gIsManuallyOn = false;
		unopenedLocations = gEmptyPlaces.slice();

		// Removing the mark class
		var elMine = document.querySelectorAll('.mine');
		for (let i = 0; i < elMine.length; i++) {
			elMine[i].classList.remove('mine');
			elMine[i].classList.add('unopened');
		}
		elManuallyCreate.querySelector('span').innerText = `Touch cell to start`;
	}
}
