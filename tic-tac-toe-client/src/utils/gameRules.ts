import type { Board, GameResult } from '../types/game';

function winner(board: Board): null | 0 | 1 {
  const lines = [
    board[0],
    board[1],
    board[2],
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (a !== null && a === b && b === c) {
      return a;
    }
  }

  return null;
}

function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export function getGameResult(board: Board): GameResult {
  const value = winner(board);
  if (value === 1) return 'human';
  if (value === 0) return 'computer';
  if (isBoardFull(board)) return 'draw';
  return 'playing';
}

export function createEmptyBoard(): Board {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}
