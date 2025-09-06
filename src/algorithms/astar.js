// src/algorithms/astar.js

export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = []; // This will act as our open set

  startNode.distance = 0;
  startNode.h = manhattanDistance(startNode, finishNode);
  startNode.f = startNode.h;

  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length) {
    // Sort to find the node with the lowest f-score
    sortNodesByFScore(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // If the closest node is a wall, skip it
    if (closestNode.isWall) continue;

    // If we are trapped, stop
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // If we reached the finish node, we're done
    if (closestNode === finishNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid, finishNode, unvisitedNodes);
  }
  // Return if no path was found
  return visitedNodesInOrder;
}

function updateUnvisitedNeighbors(node, grid, finishNode, unvisitedNodes) {
  const neighbors = getNeighbors(node, grid);

  for (const neighbor of neighbors) {
    // If the neighbor is already visited (in the closed set), skip it
    if (neighbor.isVisited) continue;

    // Calculate tentative g-score (distance from start)
    const tentativeGScore = node.distance + 1;

    // If this new path to the neighbor is better than any previous one
    if (tentativeGScore < neighbor.distance) {
      neighbor.previousNode = node;
      neighbor.distance = tentativeGScore; // g-score
      neighbor.h = manhattanDistance(neighbor, finishNode); // h-score
      neighbor.f = neighbor.distance + neighbor.h; // f-score

      // If the neighbor is not in our open set, add it
      if (!unvisitedNodes.includes(neighbor)) {
        unvisitedNodes.push(neighbor);
      }
    }
  }
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

// Manhattan distance heuristic
function manhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.col - nodeB.col) + Math.abs(nodeA.row - nodeB.row);
}

function sortNodesByFScore(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
}