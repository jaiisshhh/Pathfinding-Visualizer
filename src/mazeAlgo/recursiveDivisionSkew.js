// src/mazeAlgo/recursiveDivisionSkew.js

let wallsToAnimate;

export function recursiveDivisionMazeSkew(grid, skew) {
  wallsToAnimate = [];
  const rowEnd = grid.length - 1;
  const colEnd = grid[0].length - 1;

  divide(grid, 1, rowEnd - 1, 1, colEnd - 1, chooseOrientation(colEnd, rowEnd, skew));
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
    
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];

    for (let col = colStart - 1; col <= colEnd + 1; col++) {
      if (col !== colRandom && grid[currentRow] && grid[currentRow][col]) {
        const node = grid[currentRow][col];
        if (!node.isStart && !node.isFinish) {
          wallsToAnimate.push(node);
        }
      }
    }

    divide(grid, rowStart, currentRow - 2, colStart, colEnd, chooseOrientation(colEnd - colStart, currentRow - 2 - rowStart, 'vertical'));
    divide(grid, currentRow + 2, rowEnd, colStart, colEnd, chooseOrientation(colEnd - colStart, rowEnd - (currentRow + 2), 'vertical'));

  } else { // Vertical orientation
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }

    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];

    for (let row = rowStart - 1; row <= rowEnd + 1; row++) {
      if (row !== rowRandom && grid[row] && grid[row][currentCol]) {
         const node = grid[row][currentCol];
        if (!node.isStart && !node.isFinish) {
          wallsToAnimate.push(node);
        }
      }
    }
    
    divide(grid, rowStart, rowEnd, colStart, currentCol - 2, chooseOrientation(currentCol - 2 - colStart, rowEnd - rowStart, 'horizontal'));
    divide(grid, rowStart, rowEnd, currentCol + 2, colEnd, chooseOrientation(colEnd - (currentCol + 2), rowEnd - rowStart, 'horizontal'));
  }
}

// The chooseOrientation function now accepts a skew parameter
function chooseOrientation(width, height, skew) {
  if (width < height) {
    return skew === 'horizontal' ? 'horizontal' : 'vertical';
  } else if (height < width) {
    return skew === 'vertical' ? 'vertical' : 'horizontal';
  } else {
    // If the chamber is a square, prefer the skewed orientation
    return skew === 'horizontal' ? 'horizontal' : 'vertical';
  }
}