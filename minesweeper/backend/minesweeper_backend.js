const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Sample endpoint to generate a new Minesweeper board
app.get("/api/start-game", (req, res) => {
    const { difficulty } = req.query;
    let size = 8; // Default size

    if (difficulty === "medium") size = 12;
    if (difficulty === "hard") size = 16;

    // Generate an empty board for now
    const board = Array(size).fill().map(() => Array(size).fill(0));

    res.json({ board, size });
});

// Endpoint for handling tile guesses (e.g., clicking a tile)
app.post("/api/tile-click", (req, res) => {
    const { x, y } = req.body;
    // Here, you'd handle tile guesses (e.g., reveal tile, check if it's a mine)
    res.json({ message: `Tile clicked at ${x}, ${y}` });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});