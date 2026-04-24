export type BattleshipPhase = 'placement' | 'battle' | 'finished';
export type FleetGrid = number[][] | null;
export type ShotsGrid = number[][];
export type BattleshipPlayerId = 1 | 2;
export declare class BattleshipSession {
    id: string;
    player1Fleet: FleetGrid;
    player2Fleet: FleetGrid;
    player1Shots: ShotsGrid;
    player2Shots: ShotsGrid;
    phase: BattleshipPhase;
    currentTurn: BattleshipPlayerId;
    winner: BattleshipPlayerId | null;
    constructor(id?: string, player1Fleet?: FleetGrid, player2Fleet?: FleetGrid, player1Shots?: ShotsGrid, player2Shots?: ShotsGrid, phase?: BattleshipPhase, currentTurn?: BattleshipPlayerId, winner?: BattleshipPlayerId | null);
}
export declare function emptyShotsGrid(): ShotsGrid;
export declare function emptyFleetGrid(): number[][];
