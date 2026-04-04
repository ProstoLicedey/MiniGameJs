import { Board, GameMode } from "src/game/domain/model/gameSession";

export class GameDto {
  id: string;
  board: Board;
  mode: GameMode;
}