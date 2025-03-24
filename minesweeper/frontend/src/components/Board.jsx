import React, { useState, useEffect } from "react";

export default function GameBoard({ difficulty }) {
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/start-game?difficulty=${difficulty}`)
      .then((res) => res.json())
      .then((data) => {
        setBoard(data.board);

        // Initialize revealed state (matching board size)
        setRevealed(
          Array(data.size)
            .fill()
            .map(() => Array(data.size).fill(false))
        );
      });
  }, [difficulty]);

  const handleTileClick = (x, y) => {
    fetch("http://localhost:5000/api/tile-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ x, y }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Game Over") {
          alert("Game Over! You clicked on a mine.");
        }

        // Update revealed state (for UI)
        setRevealed((prevRevealed) => {
          const newRevealed = [...prevRevealed];
          newRevealed[x][y] = true;
          return [...newRevealed];
        });
      });
  };

  return (
    <div className="game-container">
      <h2>Minesweeper</h2>
      <div
        className="game-board"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${board.length}, 30px)`,
          gap: "2px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`tile ${
                revealed[rowIndex][colIndex] ? "revealed" : ""
              }`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            >
              {revealed[rowIndex][colIndex] &&
                (cell === "M" ? "💣" : cell !== 0 ? cell : "")}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
