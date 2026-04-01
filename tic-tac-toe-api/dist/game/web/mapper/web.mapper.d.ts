import { Board, GameSession } from 'src/game/domain/model/gameSession';
import { GameDto } from '../model/dto.model';
export declare class WebMapper {
    static toDomain(id: string, board: Board): GameSession;
    static toDto(game: GameSession): GameDto;
}
