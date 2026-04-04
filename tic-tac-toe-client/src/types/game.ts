export type CellValue = null | 0 | 1;
export type Board = CellValue[][];

export interface CreateGameResponse {
  id: string;
}

export interface GameDto {
  id: string;
  board: Board;
}

export type GameResult = 'playing' | 'human' | 'computer' | 'draw';
