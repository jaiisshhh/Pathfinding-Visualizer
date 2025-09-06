import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { astar } from "../algorithms/astar";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { recursiveDivisionMaze } from "../mazeAlgo/recursiveDivision";
import { recursiveDivisionMazeSkew } from "../mazeAlgo/recursiveDivisionSkew";
import { basicRandomMaze } from "../mazeAlgo/basicRandomMaze";

import Tutorial from "./Tutorial";

import "./PathfindingVisualizer.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      movingStart: false,
      movingFinish: false,
      selectedAlgorithm: "",
      selectedMaze: "",
      startNodeRow: START_NODE_ROW,
      startNodeCol: START_NODE_COL,
      finishNodeRow: FINISH_NODE_ROW,
      finishNodeCol: FINISH_NODE_COL,
      animationSpeed: 10,
    };
  }

  componentDidMount() {
  const grid = getInitialGrid();
  this.setState({ grid });

  this.setState({ showTutorial: true });
}

  closeTutorial = () => {
    this.setState({ showTutorial: false });
  };

  handleMouseDown(row, col) {
    const { grid } = this.state;
    const node = grid[row][col];

    if (node.isStart) {
      this.setState({ mouseIsPressed: true, movingStart: true });
    } else if (node.isFinish) {
      this.setState({ mouseIsPressed: true, movingFinish: true });
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;

    if (this.state.movingStart) {
      const newGrid = moveSpecialNode(
        this.state.grid,
        row,
        col,
        "isStart",
        this.state.startNodeRow,
        this.state.startNodeCol
      );
      this.setState({ grid: newGrid, startNodeRow: row, startNodeCol: col });
    } else if (this.state.movingFinish) {
      const newGrid = moveSpecialNode(
        this.state.grid,
        row,
        col,
        "isFinish",
        this.state.finishNodeRow,
        this.state.finishNodeCol
      );
      this.setState({ grid: newGrid, finishNodeRow: row, finishNodeCol: col });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({
      mouseIsPressed: false,
      movingStart: false,
      movingFinish: false,
    });
  }

  handleAlgorithmChange = (e) => {
    this.setState({ selectedAlgorithm: e.target.value });
  };

  handleMazeChange = (e) => {
    const selectedMaze = e.target.value;
    this.clearWalls(); // Clear the board before generating a new maze
    const { grid } = this.state;
    let walls;

    switch (selectedMaze) {
      case "recursive":
        walls = recursiveDivisionMaze(grid);
        break;
      case "recursive-vertical":
        // Call the skew function with a 'vertical' parameter
        walls = recursiveDivisionMazeSkew(grid, "vertical");
        break;
      case "recursive-horizontal":
        // Call the skew function with a 'horizontal' parameter
        walls = recursiveDivisionMazeSkew(grid, "horizontal");
        break;
      case "random":
        walls = basicRandomMaze(grid);
        break;
      default:
        return;
    }

    this.animateMaze(walls);
    // Reset the dropdown after selection
    this.setState({ selectedMaze: "" });
  };

  handleGenerateMaze = () => {
    this.clearWalls(); // Clear existing walls first
    const { grid } = this.state;
    const walls = recursiveDivisionMaze(grid);
    this.animateMaze(walls);
  };

  animateMaze = (walls) => {
    for (let i = 0; i < walls.length; i++) {
      setTimeout(() => {
        const node = walls[i];
        // Create a new grid for each step of the animation
        this.setState((prevState) => {
          const newGrid = prevState.grid.map((row) => row.slice());
          const animatedNode = newGrid[node.row][node.col];
          const newNode = { ...animatedNode, isWall: true };
          newGrid[node.row][node.col] = newNode;
          return { grid: newGrid };
        });
      }, 2 * i);
    }
  };

  // In PathfindingVisualizer.jsx

  // Replace your entire handleVisualize function with this one
  handleVisualize = () => {
    // First, call clearPreviousRun and pass the visualization logic as a callback
    this.clearPreviousRun(() => {
      const {
        grid, // We now get the guaranteed-fresh grid from the state
        selectedAlgorithm,
        startNodeRow,
        startNodeCol,
        finishNodeRow,
        finishNodeCol,
      } = this.state;

      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];

      let visitedNodesInOrder;
      switch (selectedAlgorithm) {
        case "dijkstra":
          visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
          break;
        case "astar":
          visitedNodesInOrder = astar(grid, startNode, finishNode);
          break;
        case "bfs":
          visitedNodesInOrder = bfs(grid, startNode, finishNode);
          break;
        case "dfs":
          visitedNodesInOrder = dfs(grid, startNode, finishNode);
          break;
        default:
          alert("Please select an algorithm");
          return;
      }

      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  };

  // In PathfindingVisualizer.jsx

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // When all visited nodes have been animated, animate the shortest path
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.state.animationSpeed * i);
        return;
      }

      // Animate each visited node
      setTimeout(() => {
        const node = visitedNodesInOrder[i];

        // This is the crucial fix: Update the state *and* the DOM class
        this.setState((prevState) => {
          const newGrid = prevState.grid.map((row) => row.slice());
          const visitedNode = newGrid[node.row][node.col];
          const newNode = {
            ...visitedNode,
            isVisited: true,
          };
          newGrid[node.row][node.col] = newNode;

          // Also update the DOM directly to apply the animation class
          if (!newNode.isStart && !newNode.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited";
          }

          return { grid: newGrid };
        });
      }, this.state.animationSpeed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    // The loop now stops one node early, as the last node in the array is the finish node.
    for (let i = 0; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);

        if (!element || node.isStart) return;

        // Clean up the arrow from the previous node
        if (i > 0) {
          const prevNode = nodesInShortestPathOrder[i - 1];
          if (!prevNode.isStart) {
            const prevElement = document.getElementById(
              `node-${prevNode.row}-${prevNode.col}`
            );
            if (prevElement) prevElement.className = "node node-shortest-path";
          }
        }

        // Determine direction and apply the arrow
        const nextNode = nodesInShortestPathOrder[i + 1];
        let directionClass = "";
        if (nextNode) {
          if (nextNode.row > node.row) directionClass = "node-path-down";
          else if (nextNode.row < node.row) directionClass = "node-path-up";
          else if (nextNode.col > node.col) directionClass = "node-path-right";
          else if (nextNode.col < node.col) directionClass = "node-path-left";
        }

        element.className = `node node-shortest-path ${directionClass}`;
      }, this.state.animationSpeed * 5 * i);
    }

    // THIS IS THE FIX:
    // After the animation is complete, find the very last PATH node (the one before the finish node)
    // and remove its arrow, leaving only the green trail.
    const lastPathNode =
      nodesInShortestPathOrder[nodesInShortestPathOrder.length - 2];
    if (lastPathNode) {
      // Schedule this cleanup to run right after the last arrow is drawn
      const cleanupTimeout =
        this.state.animationSpeed * 5 * (nodesInShortestPathOrder.length - 1);
      setTimeout(() => {
        const lastElement = document.getElementById(
          `node-${lastPathNode.row}-${lastPathNode.col}`
        );
        if (lastElement) {
          lastElement.className = "node node-shortest-path";
        }
      }, cleanupTimeout);
    }
  }

  // This function clears old pathfinding data without removing walls.
  // In PathfindingVisualizer.jsx

  // Modify this function to accept a callback
  clearPreviousRun = (callback) => {
    const newGrid = this.state.grid.map((row) =>
      row.map((node) => {
        const newNode = {
          ...node,
          isVisited: false,
          distance: Infinity,
          previousNode: null,
        };
        if (!newNode.isStart && !newNode.isFinish && !newNode.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }
        return newNode;
      })
    );
    // Pass the callback to setState. It will be executed after the state update is complete.
    this.setState({ grid: newGrid }, callback);
  };

  clearWalls = () => {
    const newGrid = this.state.grid.map((row) =>
      row.map((node) => {
        const newNode = { ...node, isWall: false };
        // Also clear visual styles
        if (!newNode.isStart && !newNode.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }
        return newNode;
      })
    );
    this.setState({ grid: newGrid });
  };

  handleLearn = () => {
    window.open("https://en.wikipedia.org/wiki/Pathfinding", "_blank");
  };

  render() {
    const { grid, mouseIsPressed, showTutorial } = this.state;

    return (
      <>
        {showTutorial && <Tutorial closeTutorial={this.closeTutorial} />}

        <nav className="navbar">
          {/* Navbar content remains the same */}
          <div className="navbar-left">
            <h2>Pathfinding Visualizer</h2>
          </div>
          <div className="navbar-right">
            <select
              className="dropdown"
              value={this.state.selectedAlgorithm}
              onChange={this.handleAlgorithmChange}
            >
              <option value="">Select Algorithm</option>
              <option value="dijkstra">Dijkstra</option>
              <option value="bfs">BFS</option>
              <option value="dfs">DFS</option>
              <option value="astar">A*</option>
            </select>
            <select
              className="dropdown"
              value={this.state.selectedMaze}
              onChange={this.handleMazeChange}
            >
              <option value="">Select Maze/Pattern</option>
              <option value="recursive">Recursive Division</option>
              {/* Add these three new options */}
              <option value="recursive-vertical">
                Recursive (Vertical Skew)
              </option>
              <option value="recursive-horizontal">
                Recursive (Horizontal Skew)
              </option>
              <option value="random">Basic Random Maze</option>
            </select>
            <select
              className="dropdown"
              value={this.state.animationSpeed}
              onChange={(e) =>
                this.setState({ animationSpeed: parseInt(e.target.value) })
              }
            >
              <option value={50}>Slow</option>
              <option value={10}>Medium</option>
              <option value={1}>Fast</option>
            </select>
            <button
              className="btn visualize-btn"
              onClick={this.handleVisualize}
            >
              Visualize
            </button>
            <button className="btn clear-walls-btn" onClick={this.clearWalls}>
              Clear Walls
            </button>
            <button className="btn learn-btn" onClick={this.handleLearn}>
              Learn
            </button>
          </div>
        </nav>
        <div className="grid-container">
          <div className="grid">
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="grid-row">
                {row.map((node, nodeIdx) => (
                  <Node
                    key={nodeIdx}
                    {...node}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <footer className="footer">
          © {new Date().getFullYear()} Pathfinding Visualizer by Sanskar
        </footer>
      </>
    );
  }
}

// Helper Functions outside the component

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 22; row++) {
    const currentRow = [];
    for (let col = 0; col < 56; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => ({
  col,
  row,
  isStart: row === START_NODE_ROW && col === START_NODE_COL,
  isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
  distance: Infinity,
  isVisited: false,
  isWall: false,
  previousNode: null,
});

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.map((r) => r.slice()); // Proper deep copy
  const node = newGrid[row][col];
  if (node.isStart || node.isFinish) return newGrid;
  const newNode = { ...node, isWall: !node.isWall };
  newGrid[row][col] = newNode;
  return newGrid;
};

const moveSpecialNode = (grid, newRow, newCol, nodeType, oldRow, oldCol) => {
  const newGrid = grid.map((r) => r.slice()); // Proper deep copy
  // Reset the old node
  const oldNode = { ...newGrid[oldRow][oldCol], [nodeType]: false };
  newGrid[oldRow][oldCol] = oldNode;
  // Set the new node
  const newNode = { ...newGrid[newRow][newCol], [nodeType]: true };
  newGrid[newRow][newCol] = newNode;
  return newGrid;
};
