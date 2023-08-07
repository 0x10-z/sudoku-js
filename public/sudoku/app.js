// Crea una nueva instancia de Sudoku
const sudoku = new Sudoku(9, true);
sudoku.drawGrid();

function startGame() {
  const player = new Player(true, sudoku);
  player.play();
}

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame);

// Obtén la referencia al botón de reset
const resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", () => {
  sudoku.createGrid(true);
  sudoku.checkResult();
  sudoku.drawGrid();
});
