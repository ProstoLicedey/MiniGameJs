import { GameRepository } from "src/game/datasource/repository/game.repository";
import { GameMode, GameSession } from "../model/gameSession";
export declare class GameService {
    private repo;
    constructor(repo: GameRepository);
    initGame(mode?: GameMode): GameSession;
    nextMove(game: GameSession): GameSession;
    boardValidate(game: GameSession): Promise<boolean>;
    private countFilled;
    private isBoardCheckTwoPlayer;
    private isBoardCheckVsAi;
    isGameOver(game: GameSession): boolean;
    saveGame(game: GameSession): Promise<void>;
    getGameById(id: string): Promise<GameSession | null>;
    private checkWinner;
    private isBoardFull;
    private minimax;
    private findBestMove;
}
