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

export type TwoPlayerGameResult = 'playing' | 'player_x' | 'player_o' | 'draw';

export function getTwoPlayerGameResult(board: Board): TwoPlayerGameResult {
  const value = winner(board);
  if (value === 1) return 'player_x';
  if (value === 0) return 'player_o';
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

/** Чей ход в режиме двух игроков: X (1) и O (0) по очереди. */
export function nextTwoPlayerSymbol(board: Board): 0 | 1 {
  let x = 0;
  let o = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 1) x++;
      if (cell === 0) o++;
    }
  }
  return x === o ? 1 : 0;
}
