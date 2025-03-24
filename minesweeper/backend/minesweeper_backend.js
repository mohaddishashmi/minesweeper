const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//store game state in memory
let games = {}

//Helper Function to generate a MS board
//used in api start game
const generateBoard = (size, mines) => {
    let board = Array(size).fill().map(() => Array(size).fill(0));

    //randomly place mines
    let mineCount = 0;
    while(mineCount < mines){
        let x = Math.floor(Math.random() * size);
        let y = Math.floor(Math.random() * size);
        if (board[x][y] === 0) {
            board[x][y] = "M";
            mineCount++;
        }
    }

    //calculate space numbers (# of adjacent mines)
    const directions = [
        [-1,-1], [-1,0],[-1,1], //this is for 1 row above
        [0, -1], [0,1],         //this is for the same row
        [1,-1], [1,0],[1,1]     //this is for 1 row below
    ];

    //look at the (up to) 8 possible spaces around non-mine spaces
    //count them up, let the board count value = that number
    for (let i = 0; i < size; i ++){
        for(let j = 0; j < size; j++){
            if(board[i][j] == "M") continue; //no number value for mine spaces
            let count = 0;
            //loop thru directions and check possible spaces and number values
            for(let [dx,dy] of directions){
                let ni = dx + i, nj = dy+j; 
                 if (ni >= 0 && ni < size && nj >= 0 && nj < size && board[ni][nj] === "M") {
                    count++;
                }
            }
            board[i][j] = count
        }
    }
    return board;
};

//Flood-reveal function to reveal squares recursively
const floodReveal = (game, x, y) =>{
    //restrict activity to within gameboard and ignore already revealed squares
    if (x < 0 || x >= game.size || y < 0 || y >= game.size) return;
    if (game.revealed[x][y]) return;

    //reveal just the clicked square
    game.revealed[x][y] = true

    //recursively reveal in each of the 8 possible directions if the square has 0 adjacent mines
    if(game.board[x][y] === 0){
     const directions = [
        [-1,-1], [-1,0],[-1,1], //this is for 1 row above
        [0, -1], [0,1],         //this is for the same row
        [1,-1], [1,0],[1,1]     //this is for 1 row below
    ];
    directions.forEach(([dx, dy]) => floodReveal(game, x + dx, y + dy));
    }
};
// Sample endpoint to generate a new Minesweeper board
app.get("/api/start-game", (req, res) => {
    const { difficulty } = req.query;

    /** 
     * Easy is the default difficulty, with an 8*8 grid containing 10 mines
     * Medium is a 12*12 grid containing 24 mines
     * Hard is a 16*16 grid conaining 40 mines
     * */  

    let size = 8, mines = 10;
    if (difficulty === "medium") size = 12, mines = 24;
    if (difficulty === "hard") size = 16, mines = 40;

    //generate board, all non-revealed spaces for now
    let board = generateBoard(size, mines);
    let revealed = Array(size).fill().map(() => Array(size).fill(false));
    const gameID = (""+Math.random()).substring(2,7) //random 5 digit #
    games[gameID] = {board, revealed, size, gameOVer: false}
    res.json({ board: games[gameID].revealed, size});
});

// Endpoint for handling tile guesses (e.g., clicking a tile)
app.post("/api/tile-click", (req, res) => {
    const {gameID, x, y } = req.body;
    // Here, you'd handle tile guesses (e.g., reveal tile, check if it's a mine)
    let game = games[gameID];
    //error case
    if(!game){
        return res.status(400).json({error: "Game not found"});
    }
    //if game is already over or if you're clicking a revealed tile, do nothing
     if (game.gameOver || game.revealed[x][y]) {
        return res.json({ board: game.revealed, gameOver: game.gameOver });
    }

    //if mine, end game
    if (game.board[x][y] === "M") {
        game.gameOver = true;
        return res.json({ board: game.board, gameOver: true });
    }
    //else, we clicked a non-mine square. reveal recursively
    floodReveal(game, x, y);

    //communicate API response back

    res.json({ board: game.revealed, gameOver: game.gameOver });

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});