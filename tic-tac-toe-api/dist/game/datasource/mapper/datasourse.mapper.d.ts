import { GameSession } from 'src/game/domain/model/gameSession';
import { GameEntity } from '../model/game.entity';
export declare class GameMapper {
    static toDomain(entity: GameEntity): GameSession;
    static toEntity(domain: GameSession): GameEntity;
}
