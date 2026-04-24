import { type BattleshipPhase, type BattleshipPlayerId, type FleetGrid, type ShotsGrid } from 'src/game/domain/model/battleshipSession';
export interface BattleshipStateJson {
    player1Fleet: FleetGrid;
    player2Fleet: FleetGrid;
    player1Shots: ShotsGrid;
    player2Shots: ShotsGrid;
    phase: BattleshipPhase;
    currentTurn: BattleshipPlayerId;
    winner: BattleshipPlayerId | null;
}
export declare class BattleshipEntity {
    id: string;
    state: BattleshipStateJson;
}
