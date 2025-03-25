import React, { useState } from 'react';
import DifficultySelector from './components/DifficultySelector';
import Board from './components/Board';
import Header from './components/Header'
function App() {
  const [difficulty, setDifficulty] = useState(null);

  return (
    <div className="App">
      <Header />
      {!difficulty ? (
        <DifficultySelector setDifficulty={setDifficulty} />
      ) : (
        <Board difficulty={difficulty} />
      )}
    </div>
  );
}

export default App;
