// src/mazeAlgo/basicRandomMaze.js

export function basicRandomMaze(grid) {
  const walls = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const node = grid[row][col];
      // Skip start/finish nodes
      if (node.isStart || node.isFinish) continue;
      
      // Give each node a 35% chance of being a wall
      if (Math.random() < 0.35) {
        walls.push(node);
      }
    }
  }
  return walls;
}