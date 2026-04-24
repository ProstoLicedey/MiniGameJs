export type BattleshipPhase = 'placement' | 'battle' | 'finished';

export interface BattleshipPlayerView {
  gameId: string;
  player: 1 | 2;
  phase: BattleshipPhase;
  currentTurn: 1 | 2 | null;
  isMyTurn: boolean;
  myBoard: number[][];
  enemyBoard: number[][];
  winner: 1 | 2 | null;
  iHavePlaced: boolean;
  opponentHasPlaced: boolean;
}

export interface BattleshipCreateResponse {
  id: string;
  player1Path: string;
  player2Path: string;
}

export type ShipCells = [number, number][];
