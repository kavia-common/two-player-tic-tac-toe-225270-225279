import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Simple, modern Tic Tac Toe game (no backend dependency).
 * - Centered 3x3 board
 * - Clickable squares toggle X/O based on current player
 * - Status area shows current turn or result (winner or draw)
 * - Reset button to restart
 * - Light theme styling using provided style guide colors
 */

// Helper: calculate winner given a 3x3 board.
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

// PUBLIC_INTERFACE
function App() {
  /** Light theme is enforced per requirements; no new env vars introduced. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Apply the light theme colors to the root element.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => squares.every(Boolean) && !winner,
    [squares, winner]
  );

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw!"
    : `Current turn: ${xIsNext ? 'X' : 'O'}`;

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    // Ignore clicks if square already filled or game is over
    if (squares[index] || winner) return;
    setSquares((prev) => {
      const next = [...prev];
      next[index] = xIsNext ? 'X' : 'O';
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="t3-app">
      <header className="t3-header">
        <h1 className="t3-title">Tic Tac Toe</h1>
        <p className={`t3-status ${winner ? 't3-status--win' : isDraw ? 't3-status--draw' : 't3-status--turn'}`}>
          {statusText}
        </p>
      </header>

      <main className="t3-main">
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={line}
        />
      </main>

      <footer className="t3-footer">
        <button
          className="t3-button"
          onClick={handleReset}
          aria-label="Reset the game"
        >
          Reset Game
        </button>
      </footer>
    </div>
  );
}

/**
 * Board component: renders 3x3 grid of squares.
 * PUBLIC_INTERFACE
 */
function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="t3-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((value, idx) => {
        const isWinning = winningLine.includes(idx);
        return (
          <button
            key={idx}
            role="gridcell"
            aria-label={`Square ${idx + 1} ${value ? `with ${value}` : 'empty'}`}
            className={`t3-square ${isWinning ? 't3-square--winning' : ''}`}
            onClick={() => onSquareClick(idx)}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

export default App;
