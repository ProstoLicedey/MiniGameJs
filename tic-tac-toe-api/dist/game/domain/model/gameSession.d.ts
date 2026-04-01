export type CellValue = null | 0 | 1;
export type Board = CellValue[][];
export declare class GameSession {
    id: string;
    board: Board;
    constructor(id?: string, board?: Board);
}
