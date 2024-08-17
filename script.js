// Initialize the grid elements array
var cells = Array.from({ length: 9 }, () => Array(9).fill(null));

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        cells[i][j] = document.getElementById(i * 9 + j);
    }
}

var board = Array.from({ length: 9 }, () => Array(9).fill(0));

function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            cells[i][j].innerText = board[i][j] !== 0 ? board[i][j] : '';
        }
    }
}

function ClearBoard() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            board[i][j] = 0;
            cells[i][j].innerText = '';
        }
    }
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');
let ClearPuzzle = document.getElementById('ClearPuzzle');

GetPuzzle.onclick = function () {
    console.log("GetPuzzle button clicked");

    // Get the selected difficulty level
    let difficulty = document.getElementById('difficulty').value;

    if (!difficulty) {
        console.error('No difficulty level selected');
        return;
    }

    console.log('Fetching puzzle with difficulty:', difficulty);

    fetch(`https://sugoku.onrender.com/board?difficulty=${difficulty}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Puzzle data received:', data);
            if (data && data.board) {
                board = data.board;
                FillBoard(board);
            } else {
                console.error('Invalid puzzle data received');
            }
        })
        .catch(error => {
            console.error('Error fetching puzzle:', error);
        });
};

SolvePuzzle.onclick = () => {
    console.log("SolvePuzzle button clicked");
    if (SudokuSolver(board, 0, 0)) {
        FillBoard(board);
        console.log("Sudoku solved!");
    } else {
        console.log("No solution exists!");
    }
};

ClearPuzzle.onclick = () => {
    console.log("ClearPuzzle button clicked");
    ClearBoard();
};

function isSafe(board, row, col, num) {
    for (var x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num ||
            board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
}

function SudokuSolver(board, i, j) {
    if (i === 9 - 1 && j === 9) {
        return true;
    }
    if (j === 9) {
        i++;
        j = 0;
    }
    if (board[i][j] !== 0) {
        return SudokuSolver(board, i, j + 1);
    }
    for (var num = 1; num <= 9; num++) {
        if (isSafe(board, i, j, num)) {
            board[i][j] = num;
            if (SudokuSolver(board, i, j + 1)) {
                return true;
            }
            board[i][j] = 0;
        }
    }
    return false;
}
