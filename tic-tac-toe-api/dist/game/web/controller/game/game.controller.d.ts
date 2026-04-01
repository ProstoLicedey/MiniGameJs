import * as gameSession from 'src/game/domain/model/gameSession';
import { GameService } from 'src/game/domain/service/TicTacToe.service';
import { GameDto } from '../../model/dto.model';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    initGame(): Promise<{
        id: string;
    }>;
    move(id: string, board: gameSession.Board): Promise<GameDto | undefined>;
}
