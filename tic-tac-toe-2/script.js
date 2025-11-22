// DOM-элементы
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetButton = document.getElementById('reset');

// Состояние игры
let currentPlayer = 'X';
let gameBoard = Array(9).fill('');
let gameActive = true;

// Паттерны победы (вынесены в константу)
const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // строки
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // столбцы
    [0, 4, 8], [2, 4, 6]             // диагонали
];

// Создаём игровое поле
function createBoard() {
    boardEl.innerHTML = '';
    gameBoard.forEach((_, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = index; // современный способ вместо setAttribute
        cell.addEventListener('click', handleCellClick);
        boardEl.appendChild(cell);
    });
}

// Обработка клика по ячейке
function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index, 10);

    if (gameBoard[index] !== '' || !gameActive) return;

    // Обновляем состояние
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;

    // Проверка победы
    if (checkWin()) {
        statusEl.textContent = `Игрок ${currentPlayer} победил!`;
        gameActive = false;
        highlightWinningCells();
        return;
    }

    // Проверка ничьей
    if (!gameBoard.includes('')) {
        statusEl.textContent = 'Ничья!';
        gameActive = false;
        return;
    }

    // Смена игрока
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `Ход игрока ${currentPlayer}`;
}

// Проверка победы
function checkWin() {
    return WIN_PATTERNS.some(([a, b, c]) => {
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
    });
}

// Подсветка победной линии
function highlightWinningCells() {
    const winningPattern = WIN_PATTERNS.find(([a, b, c]) => {
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
    });

    if (winningPattern) {
        winningPattern.forEach(index => {
            document.querySelector(`.cell[data-index="${index}"]`).classList.add('win-line');
        });
    }
}

// Сброс игры
function resetGame() {
    gameBoard = Array(9).fill('');
    gameActive = true;
    currentPlayer = 'X';
    statusEl.textContent = `Ход игрока ${currentPlayer}`;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win-line');
    });
}

// Инициализация
resetButton.addEventListener('click', resetGame);
createBoard();