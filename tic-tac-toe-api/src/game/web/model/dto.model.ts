import { Board, GameMode } from "src/game/domain/model/gameSession";

export class GameDto {
  id: string;
  board: Board;
  mode: GameMode;
}

/** Вид состояния для одного из двух игроков (без чужого расположения кораблей). */
export type BattleshipPhaseDto = "placement" | "battle" | "finished";

export class BattleshipPlayerViewDto {
  gameId: string;
  player: 1 | 2;
  phase: BattleshipPhaseDto;
  /** Актуально в фазе battle; в placement и finished — null */
  currentTurn: 1 | 2 | null;
  /** В placement: можно отправить расстановку; в battle: ваш ход выстрела */
  isMyTurn: boolean;
  /**
   * Ваше поле: 0 вода, 1 корабль (цел), 2 попадание по кораблю, 3 промах по воде.
   * До расстановки — нули 10×10.
   */
  myBoard: number[][];
  /**
   * Поле противника (радар): 0 ещё не стреляли, 1 ваш промах, 2 ваше попадание.
   */
  enemyBoard: number[][];
  winner: 1 | 2 | null;
  iHavePlaced: boolean;
  opponentHasPlaced: boolean;
}

export class BattleshipCreateResponseDto {
  id: string;
  player1Path: string;
  player2Path: string;
}

/** Корабль — массив клеток [row, col]; всего 10 кораблей флота. */
export class BattleshipPlacementBodyDto {
  ships: [number, number][][];
}

export class BattleshipFireBodyDto {
  row: number;
  col: number;
}