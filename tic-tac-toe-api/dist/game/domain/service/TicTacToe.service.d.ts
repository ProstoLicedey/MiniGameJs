import { GameRepository } from "src/game/datasource/repository/game.repository";
import { GameSession } from "../model/gameSession";
export declare class GameService {
    private repo;
    constructor(repo: GameRepository);
    initGame(): GameSession;
    nextMove(game: GameSession): GameSession;
    boardValidate(game: GameSession): Promise<boolean>;
    private isBoardCheck;
    isGameOver(game: GameSession): boolean;
    saveGame(game: GameSession): Promise<void>;
    getGameById(id: string): Promise<GameSession | null>;
    private checkWinner;
    private isBoardFull;
    private minimax;
    private findBestMove;
}
