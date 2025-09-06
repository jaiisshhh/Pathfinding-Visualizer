import React, { useState } from 'react'; // Changed to include useState
import './Tutorial.css';

const Tutorial = ({ closeTutorial }) => {
  // Add a state to track when the closing animation should play
  const [isClosing, setIsClosing] = useState(false);

  // This function will now handle the closing logic
  const handleClose = () => {
    setIsClosing(true); // Trigger the animation by setting state

    // Wait for the animation to finish (400ms), then call the original close function
    setTimeout(() => {
      closeTutorial();
    }, 400);
  };

  return (
    // Conditionally add the 'closing' class to trigger the CSS animation
    <div className={`tutorial-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="tutorial-content">
        {/* Updated to call the new handleClose function */}
        <button className="close-btn" onClick={handleClose}>×</button>

        <h2>Welcome to Pathfinding Visualizer!</h2>
        <p>This interactive tool helps you visualize how different pathfinding algorithms explore a grid to find the shortest path between two points.</p>

        <h3>Features</h3>
        <ul>
          <li><strong>Select Algorithm:</strong> Choose from classic algorithms like Dijkstra's, A*, BFS, DFS and more.</li>
          <li><strong>Generate Mazes:</strong> Create complex mazes using various patterns to challenge the algorithms.</li>
          <li><strong>Add Walls:</strong> Click and drag on the grid to draw your own obstacles.</li>
          <li><strong>Move Nodes:</strong> Click and drag the start and end nodes to new positions.</li>
          <li><strong>Control Speed:</strong> Adjust the animation speed to see the process in detail or get results quickly.</li>
        </ul>

        <h3>Legend</h3>
        <div className="legend">
          <div className="legend-item">
            <img src="/start.png" alt="Start Node"/>
            <span>Start Node</span>
          </div>
          <div className="legend-item">
            <img src="/end.png" alt="End Node"/>
            <span>Finish Node</span>
          </div>
          <div className="legend-item">
            <div className="legend-node wall-node"></div>
            <span>Wall Node</span>
          </div>
          <div className="legend-item">
            <div className="legend-node visited-node"></div>
            <span>Visited Node</span>
          </div>
          <div className="legend-item">
            <div className="legend-node path-node"></div>
            <span>Shortest-Path Node</span>
          </div>
        </div>

        {/* Updated to call the new handleClose function */}
        <button className="start-btn" onClick={handleClose}>Get Started</button>
      </div>
    </div>
  );
};

export default Tutorial;