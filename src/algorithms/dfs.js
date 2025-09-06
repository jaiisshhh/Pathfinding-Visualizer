// src/algorithms/dfs.js

export function dfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const stack = []; // Use an array as a stack

    stack.push(startNode);

    while (stack.length > 0) {
        const currentNode = stack.pop(); // Pop the last node

        if (currentNode.isWall || currentNode.isVisited) {
            continue;
        }

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === finishNode) {
            return visitedNodesInOrder;
        }

        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            neighbor.previousNode = currentNode;
            stack.push(neighbor);
        }
    }
    
    // Return if path is not found
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;

    // The order matters for visualization; this order explores down, right, up, left
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited);
}