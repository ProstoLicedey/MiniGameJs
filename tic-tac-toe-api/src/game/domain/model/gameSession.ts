import { v4 as uuidv4 } from 'uuid';

// Только три разрешенных значения
export type CellValue = null | 0 | 1;
export type Board = CellValue[][];

export class GameSession {
  id: string;
  board: Board;

  constructor(id?: string, board?: Board) {
    this.id = id || uuidv4();

    this.board = board || [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }
}