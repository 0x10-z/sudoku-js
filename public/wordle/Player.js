class Player {
  constructor(doItRight, sudoku) {
    this.sudoku = sudoku;
    this.doItRight = doItRight;
    this.play();
  }

  async play() {
    while (!(await this.solve(0, 0))) {
      this.resetSudoku();
      this.sudoku.drawGrid();
      await this.delay(100);
    }
    this.sudoku.isComplete = true;
    this.sudoku.checkResult();
  }

  resetSudoku() {
    this.sudoku.grid = this.sudoku.grid.map((row) =>
      row.map((cell) => (cell.isInitial ? cell : new Cell(0, false)))
    );
  }

  async solve(row, col) {
    if (row === this.sudoku.size) {
      // Hemos completado el tablero
      return true;
    }

    const nextRow = col === this.sudoku.size - 1 ? row + 1 : row;
    const nextCol = (col + 1) % this.sudoku.size;

    if (this.sudoku.grid[row][col].value !== 0) {
      // Si esta celda ya está llena, pasamos a la siguiente
      return await this.solve(nextRow, nextCol);
    }

    const numbers = Array.from({ length: this.sudoku.size }, (_, i) => i + 1);
    for (const num of numbers) {
      if (this.sudoku.isValid(this.sudoku.grid, row, col, num)) {
        this.sudoku.grid[row][col].value = num;
        this.sudoku.drawGrid();
        await this.delay(10);

        if (await this.solve(nextRow, nextCol)) {
          // Registra las acciones en el log
          logAction("Escribe", num, row, col);
          updateActionLog();
          return true;
        }

        // Si no podemos resolver el Sudoku con este número en la celda, borramos el número e intentamos con el siguiente
        logAction("Borra", num, row, col);
        updateActionLog();
        this.sudoku.grid[row][col].value = 0;
        this.sudoku.drawGrid();
        await this.delay(100);
      }
    }

    // Si ninguno de los números es válido en esta celda, retornamos false
    return false;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
