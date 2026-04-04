import { v4 as uuidv4 } from 'uuid';

// Только три разрешенных значения
export type CellValue = null | 0 | 1;
export type Board = CellValue[][];

export type GameMode = 'vs_ai' | 'two_player';

export class GameSession {
  id: string;
  board: Board;
  mode: GameMode;

  constructor(id?: string, board?: Board, mode?: GameMode) {
    this.id = id || uuidv4();

    this.board = board || [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.mode = mode ?? 'vs_ai';
  }
}