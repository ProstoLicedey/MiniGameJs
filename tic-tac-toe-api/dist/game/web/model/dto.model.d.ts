import { Board, GameMode } from "src/game/domain/model/gameSession";
export declare class GameDto {
    id: string;
    board: Board;
    mode: GameMode;
}
export type BattleshipPhaseDto = "placement" | "battle" | "finished";
export declare class BattleshipPlayerViewDto {
    gameId: string;
    player: 1 | 2;
    phase: BattleshipPhaseDto;
    currentTurn: 1 | 2 | null;
    isMyTurn: boolean;
    myBoard: number[][];
    enemyBoard: number[][];
    winner: 1 | 2 | null;
    iHavePlaced: boolean;
    opponentHasPlaced: boolean;
}
export declare class BattleshipCreateResponseDto {
    id: string;
    player1Path: string;
    player2Path: string;
}
export declare class BattleshipPlacementBodyDto {
    ships: [number, number][][];
}
export declare class BattleshipFireBodyDto {
    row: number;
    col: number;
}
