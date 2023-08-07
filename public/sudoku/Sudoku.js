class Cell {
  constructor(value, isInitial) {
    this.value = value;
    this.isInitial = isInitial;
  }
}

class Sudoku {
  constructor(size, drawHint) {
    this.size = size;
    this.createGrid(drawHint);
    this.isComplete = false;
  }

  createGrid(drawHint) {
    // Empezamos con una cuadrícula vacía
    this.grid = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => new Cell(0, false))
    );

    // Luego la resolvemos
    this.solveSudoku(this.grid);

    // Mezclamos filas y columnas dentro de la misma región de 3x3.
    this.shuffleGrid();

    if (drawHint) {
      this.drawHint();
    }

    // Y finalmente eliminamos números de manera aleatoria
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (Math.random() < 0.5) {
          this.grid[i][j].value = 0;
        } else {
          this.grid[i][j].isInitial = true;
        }
      }
    }
  }

  drawHint() {
    // Imprime la solución del Sudoku como pista en la consola
    console.log("Pista del Sudoku:");
    this.grid.forEach((row) => {
      console.log(row.map((cell) => cell.value).join(" "));
    });
  }

  drawGrid() {
    const container = document.getElementById("sudoku-grid");
    container.innerHTML = "";
    let cells = []; // Guarda los elementos de entrada en un array bidimensional
    this.grid.forEach((row, i) => {
      let cellRow = [];
      const rowElement = document.createElement("div");
      rowElement.className = "row";
      row.forEach((cell, j) => {
        const cellElement = document.createElement("input");
        cellElement.type = "text";
        cellElement.maxLength = 1;

        // Aplica la clase 'thick-border' a las celdas en los bordes de las subcuadrículas y en el borde externo
        cellElement.className =
          "cell" +
          (i % 3 === 2 || i === this.size - 1 ? " bottom-border" : "") +
          (j % 3 === 2 || j === this.size - 1 ? " right-border" : "") +
          (i === 0 ? " top-border" : "") +
          (j === 0 ? " left-border" : "");
        cellElement.value =
          this.grid[i][j].value !== 0 ? this.grid[i][j].value : "";
        cellElement.readOnly = this.grid[i][j].isInitial; // Las celdas iniciales son de solo lectura

        cellElement.addEventListener("input", (e) => this.handleInput(e, i, j));
        cellElement.addEventListener(
          "keydown",
          this.handleArrowKeys(i, j, cells)
        );
        rowElement.appendChild(cellElement);
        cellRow.push(cellElement); // Agrega el elemento a la fila
      });
      cells.push(cellRow); // Agrega la fila al array de celdas
      container.appendChild(rowElement);
    });
  }

  handleInput(event, row, col) {
    if (this.grid[row][col].isInitial) {
      // Si la celda es inicial, no hacemos nada
      return;
    }

    const value = parseInt(event.target.value);
    if (isNaN(value) || value < 1 || value > 9) {
      this.grid[row][col].value = 0;
      event.target.value = "";
    } else {
      this.grid[row][col].value = value;
    }

    this.isComplete = this.grid.every((row) =>
      row.every((cell) => cell.value !== 0)
    );
  }

  handleArrowKeys(i, j, cells) {
    const that = this;
    return function (e) {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (i > 0) cells[i - 1][j].focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          if (i < that.size - 1) cells[i + 1][j].focus();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (j > 0) cells[i][j - 1].focus();
          break;
        case "ArrowRight":
          e.preventDefault();
          if (j < that.size - 1) cells[i][j + 1].focus();
          break;
      }

      that.checkResult();
    };
  }

  solveSudoku(grid, row = 0, col = 0) {
    if (row === this.size) {
      // Hemos llegado al final de la cuadrícula, lo que significa que hemos encontrado una solución
      return true;
    }

    if (grid[row][col].value !== 0) {
      // Esta celda ya está llena, entonces pasamos a la siguiente
      return this.solveSudoku(
        grid,
        col === this.size - 1 ? row + 1 : row,
        (col + 1) % this.size
      );
    }

    for (let num = 1; num <= this.size; num++) {
      if (this.isValid(grid, row, col, num)) {
        // Si es válido, intentamos poner este número en la celda
        grid[row][col].value = num;

        if (
          this.solveSudoku(
            grid,
            col === this.size - 1 ? row + 1 : row,
            (col + 1) % this.size
          )
        ) {
          // Si podemos resolver el Sudoku con este número en la celda, retornamos true
          return true;
        }

        // Si no podemos resolver el Sudoku con este número en la celda, borramos el número e intentamos con el siguiente
        grid[row][col].value = 0;
      }
    }

    // Si ninguno de los números es válido en esta celda, retornamos false
    return false;
  }

  shuffleGrid() {
    for (let i = 0; i < this.size; i += 3) {
      this.shuffleRegionRows(i);
      this.shuffleRegionColumns(i);
    }
  }

  shuffleRegionRows(startRow) {
    let region = this.grid.slice(startRow, startRow + 3);
    for (let i = 0; i < 3; i++) {
      const row1 = i;
      const row2 = Math.floor(Math.random() * 3);
      [region[row1], region[row2]] = [region[row2], region[row1]];
    }
    this.grid.splice(startRow, 3, ...region);
  }

  shuffleRegionColumns(startCol) {
    let region = [];
    for (let i = 0; i < this.size; i++) {
      region.push(this.grid[i].slice(startCol, startCol + 3));
    }
    for (let i = 0; i < 3; i++) {
      const col1 = i;
      const col2 = Math.floor(Math.random() * 3);
      region.forEach((row) => {
        [row[col1], row[col2]] = [row[col2], row[col1]];
      });
    }
    for (let i = 0; i < this.size; i++) {
      this.grid[i].splice(startCol, 3, ...region[i]);
    }
  }

  isValid(grid, row, col, num) {
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < this.size; i++) {
      if (i !== col && grid[row][i].value === num) {
        return false;
      }
      if (i !== row && grid[i][col].value === num) {
        return false;
      }
      const checkRow = boxRow + Math.floor(i / 3);
      const checkCol = boxCol + (i % 3);
      if (
        (checkRow !== row || checkCol !== col) &&
        grid[checkRow][checkCol].value === num
      ) {
        return false;
      }
    }
    return true;
  }

  checkResult() {
    if (this.isComplete) {
      let isValid = true;
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (!this.isValid(this.grid, i, j, this.grid[i][j].value)) {
            isValid = false;
            break;
          }
        }
      }

      if (isValid) {
        M.toast({
          html: "Tablero correcto",
          classes: "green lighten-1",
          displayLength: 3000,
        });
      } else {
        M.toast({
          html: "Tablero incorrecto",
          classes: "red darken-1",
          displayLength: 3000,
        });
      }
    } else {
      M.toast({
        html: "El tablero no está completo",
        classes: "yellow darken-1",
        displayLength: 3000,
      });
    }
  }
}
