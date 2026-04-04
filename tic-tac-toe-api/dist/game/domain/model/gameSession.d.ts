export type CellValue = null | 0 | 1;
export type Board = CellValue[][];
export type GameMode = 'vs_ai' | 'two_player';
export declare class GameSession {
    id: string;
    board: Board;
    mode: GameMode;
    constructor(id?: string, board?: Board, mode?: GameMode);
}
