import Board from './Components/Board';
import UpcomingBlocks from './Components/UpcomingBlocks';
import { useTetris } from './Hooks/useTetris';



function App() {
  const {board, startGame, isPlaying, score, upcomingBlocks, holdBlocks, lines, level} = useTetris();

  return (
    <div className="app">
      <h1>Tetris</h1>
      <Board currentBoard={board} />
      <div className="controls">
        <h2>Score: {score}</h2>
        <h2>Lines: {lines}</h2>
        <h2>Level: {level}</h2>
        {isPlaying ? (
          <div>
            <h2>Hold:</h2>
            <UpcomingBlocks upcomingBlocks={holdBlocks} />
            <h2>Next:</h2>
            <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
          </div>
        ) : (
          <button onClick={startGame}>New Game</button>
        )}
      </div>
    </div>
  );
}

export default App;
