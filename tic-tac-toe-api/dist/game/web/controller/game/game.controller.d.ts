import type { Board } from 'src/game/domain/model/gameSession';
import { GameMode } from 'src/game/domain/model/gameSession';
import { GameService } from 'src/game/domain/service/TicTacToe.service';
import { GameDto } from '../../model/dto.model';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    initGame(mode?: string): Promise<{
        id: string;
        mode: GameMode;
    }>;
    move(id: string, board: Board): Promise<GameDto | undefined>;
    getGame(id: string): Promise<GameDto>;
}
