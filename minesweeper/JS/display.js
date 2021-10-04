'use strict';

// BOARD
function renderBoard() {
	elBoard.innerHTML = '';
	var strHtml = '';
	for (var i = 0; i < gSize; i++) {
		strHtml += '<tr>';
		for (var j = 0; j < gSize; j++) {
			var curCell = gBoard[i][j].isMine ? MINE : gBoard[i][j].minesAroundCount;
			strHtml += `<td id="cell-${i}-${j}" class="unopened" onclick="cellClicked(this,event) " oncontextmenu="cellClicked(this,event)">${
				curCell || ''
			}</td>`;
		}
		strHtml += '</tr>';
	}
	elBoard.innerHTML = strHtml;
	elBoard.classList.remove('hidden');
}

// TIMER
function renderTimer(start) {
	function time() {
		var sec = Math.floor((+new Date() - start) / 1000);
		var min = ('' + Math.floor(sec / 60)).padStart(2, 0);
		elTimerBox.innerText = `${min}:${('' + (sec % 60)).padStart(2, 0)}`;
		gGame.secsPassed++;
	}
	timerInterval = setInterval(time, 1000);
}
