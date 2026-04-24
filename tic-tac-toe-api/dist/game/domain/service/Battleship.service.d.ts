import { BattleshipRepository } from 'src/game/datasource/repository/battleship.repository';
import { BattleshipSession, type BattleshipPlayerId } from '../model/battleshipSession';
export type ShipCells = [number, number][];
export declare class BattleshipService {
    private readonly repo;
    constructor(repo: BattleshipRepository);
    initGame(): BattleshipSession;
    saveGame(session: BattleshipSession): Promise<void>;
    getById(id: string): Promise<BattleshipSession | null>;
    getByIdOrThrow(id: string): Promise<BattleshipSession>;
    parsePlayer(param: string): BattleshipPlayerId;
    placeFleet(session: BattleshipSession, player: BattleshipPlayerId, ships: ShipCells[]): BattleshipSession;
    fire(session: BattleshipSession, player: BattleshipPlayerId, row: number, col: number): BattleshipSession;
    private copyShots;
    private allShipsSunk;
    private fleetFromShips;
    private validateFleet;
    private shipsHaveClassicSeparation;
    private isStraightConnectedShip;
    private inBounds;
}
