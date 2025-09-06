// src/mazeAlgo/recursiveDivision.js

let wallsToAnimate;

export function recursiveDivisionMaze(grid) {
  wallsToAnimate = [];
  // Get the dimensions, excluding the outer borders
  const rowEnd = grid.length - 1;
  const colEnd = grid[0].length - 1;

  // Start the recursive process
  divide(grid, 1, rowEnd - 1, 1, colEnd - 1, chooseOrientation(colEnd, rowEnd));

  return wallsToAnimate;
}

function divide(grid, rowStart, rowEnd, colStart, colEnd, orientation) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }

  if (orientation === 'horizontal') {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    
    // Choose a random row and a random column for the passage
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];

    // Draw the wall
    for (let col = colStart - 1; col <= colEnd + 1; col++) {
      if (col !== colRandom && grid[currentRow] && grid[currentRow][col]) {
        const node = grid[currentRow][col];
        if (!node.isStart && !node.isFinish) {
          wallsToAnimate.push(node);
        }
      }
    }

    // Recurse on the sub-chambers
    divide(grid, rowStart, currentRow - 2, colStart, colEnd, chooseOrientation(colEnd - colStart, currentRow - 2 - rowStart));
    divide(grid, currentRow + 2, rowEnd, colStart, colEnd, chooseOrientation(colEnd - colStart, rowEnd - (currentRow + 2)));
  } else { // Vertical orientation
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }

    // Choose a random column and a random row for the passage
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];

    // Draw the wall
    for (let row = rowStart - 1; row <= rowEnd + 1; row++) {
      if (row !== rowRandom && grid[row] && grid[row][currentCol]) {
         const node = grid[row][currentCol];
        if (!node.isStart && !node.isFinish) {
          wallsToAnimate.push(node);
        }
      }
    }

    // Recurse on the sub-chambers
    divide(grid, rowStart, rowEnd, colStart, currentCol - 2, chooseOrientation(currentCol - 2 - colStart, rowEnd - rowStart));
    divide(grid, rowStart, rowEnd, currentCol + 2, colEnd, chooseOrientation(colEnd - (currentCol + 2), rowEnd - rowStart));
  }
}

function chooseOrientation(width, height) {
  if (width < height) {
    return 'horizontal';
  } else if (height < width) {
    return 'vertical';
  } else {
    return Math.random() < 0.5 ? 'horizontal' : 'vertical';
  }
}