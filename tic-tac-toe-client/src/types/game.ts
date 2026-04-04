export type CellValue = null | 0 | 1;
export type Board = CellValue[][];

export type GameMode = 'vs_ai' | 'two_player';

export interface CreateGameResponse {
  id: string;
  mode: GameMode;
}

export interface GameDto {
  id: string;
  board: Board;
  mode: GameMode;
}

export type GameResult = 'playing' | 'human' | 'computer' | 'draw';
