import { v4 as uuidv4 } from 'uuid';

export type BattleshipPhase = 'placement' | 'battle' | 'finished';

export type FleetGrid = number[][] | null;

/** 0 — не стреляли, 1 — промах, 2 — попадание */
export type ShotsGrid = number[][];

export type BattleshipPlayerId = 1 | 2;

export class BattleshipSession {
  id: string;
  /** Расстановка: 0 вода, 1 корабль; null — игрок ещё не расставил */
  player1Fleet: FleetGrid;
  player2Fleet: FleetGrid;
  /** Выстрелы 1-го по полю 2-го */
  player1Shots: ShotsGrid;
  /** Выстрелы 2-го по полю 1-го */
  player2Shots: ShotsGrid;
  phase: BattleshipPhase;
  /** Чей ход в фазе battle */
  currentTurn: BattleshipPlayerId;
  winner: BattleshipPlayerId | null;

  constructor(
    id?: string,
    player1Fleet: FleetGrid = null,
    player2Fleet: FleetGrid = null,
    player1Shots?: ShotsGrid,
    player2Shots?: ShotsGrid,
    phase: BattleshipPhase = 'placement',
    currentTurn: BattleshipPlayerId = 1,
    winner: BattleshipPlayerId | null = null,
  ) {
    this.id = id ?? uuidv4();
    this.player1Fleet = player1Fleet;
    this.player2Fleet = player2Fleet;
    this.player1Shots = player1Shots ?? emptyShotsGrid();
    this.player2Shots = player2Shots ?? emptyShotsGrid();
    this.phase = phase;
    this.currentTurn = currentTurn;
    this.winner = winner;
  }
}

export function emptyShotsGrid(): ShotsGrid {
  return Array.from({ length: 10 }, () => Array(10).fill(0));
}

export function emptyFleetGrid(): number[][] {
  return Array.from({ length: 10 }, () => Array(10).fill(0));
}
