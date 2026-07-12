export function generateSudoku(difficulty = 'easy') {
  // Create empty 9x9 board
  let board = Array(9).fill().map(() => Array(9).fill(0));
  
  // Fill it with a valid solution
  fillGrid(board);
  
  // Determine how many cells to remove based on target remaining cells
  let cellsToRemove = 40; 
  if (difficulty === 'medium') {
    // Medium: 30-34 remaining (81 - [30, 34] = 47 to 51)
    cellsToRemove = Math.floor(Math.random() * 5) + 47; 
  } else if (difficulty === 'hard') {
    // Hard: 23-28 remaining (81 - [23, 28] = 53 to 58)
    cellsToRemove = Math.floor(Math.random() * 6) + 53; 
  } else {
    // Easy: 38-45 remaining (81 - [38, 45] = 36 to 43)
    cellsToRemove = Math.floor(Math.random() * 8) + 36; 
  }
  
  // Remove cells
  removeCells(board, cellsToRemove);
  
  return board;
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    // Check row
    if (board[row][i] === num) return false;
    // Check col
    if (board[i][col] === num) return false;
    
    // Check 3x3 box
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + i % 3;
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function fillGrid(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        // Try random numbers 1-9
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // Shuffle array
        for (let i = numbers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        
        for (let num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillGrid(board)) return true;
            board[row][col] = 0; // Backtrack
          }
        }
        return false; // No valid number found, backtrack
      }
    }
  }
  return true; // Board is completely filled
}

function removeCells(board, count) {
  let removed = 0;
  while (removed < count) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }
}
