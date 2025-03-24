import React, { useState, useEffect } from 'react';

export default function GameBoard({ difficulty }) {
    const [board, setBoard] = useState([]);
    const [revealed, setRevealed] = useState([]);

    useEffect(() => {
        // Fetch new game board from the backend
        fetch(`http://localhost:5000/api/start-game?difficulty=${difficulty}`)
            .then((res) => res.json())
            .then((data) => {
                setBoard(data.board);
                setRevealed(Array(data.size).fill().map(() => Array(data.size).fill(false)));
            });
    }, [difficulty]);

    const handleTileClick = (x, y) => {
        // Send tile click to the backend
        fetch('http://localhost:5000/api/tile-click', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ x, y }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
            });

        // Update revealed state (for UI)
        const newRevealed = [...revealed];
        newRevealed[x][y] = true;
        setRevealed(newRevealed);
    };

    return (
        <div className="game-board">
            <h2>Minesweeper</h2>
            <div className="board">
                {board.map((row, i) => (
                    <div key={i} className="row">
                        {row.map((_, j) => (
                            <button
                                key={j}
                                className="tile"
                                onClick={() => handleTileClick(i, j)}
                            >
                                {revealed[i][j] ? "🔲" : "🌑"}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
