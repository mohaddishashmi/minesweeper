import React, { useState } from 'react';
import DifficultySelector from './components/DifficultySelector';
import Board from './components/Board';

function App() {
  const [difficulty, setDifficulty] = useState(null);

  return (
    <div className="App">
      {!difficulty ? (
        <DifficultySelector setDifficulty={setDifficulty} />
      ) : (
        <Board difficulty={difficulty} />
      )}
    </div>
  );
}

export default App;
