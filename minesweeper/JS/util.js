'use strict';

function createMat(rows, cols) {
	var mat = [];
	for (var i = 0; i < rows; i++) {
		var row = [];
		for (var j = 0; j < cols; j++) row.push(createCell(false));
		mat.push(row);
	}
	return mat;
}
function createCell(
	isMine,
	isShown = false,
	isMarked = false,
	minesAroundCount = 0
) {
	return { isMine, isShown, isMarked, minesAroundCount };
}

function numOfNeighbor(board, row, col) {
	var negCount = 0;
	for (var i = row - 1; i <= row + 1 && i < board.length; i++) {
		if (i < 0) continue;
		for (var j = col - 1; j <= col + 1 && j < board[i].length; j++) {
			if ((i === row && j === col) || j < 0) continue;
			board[i][j].isMine && negCount++;
		}
	}
	return negCount;
}

function randomInt(max, min = 0) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
