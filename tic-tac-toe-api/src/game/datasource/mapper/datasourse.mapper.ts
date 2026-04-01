import { GameSession } from 'src/game/domain/model/gameSession';
import { GameEntity } from '../model/game.entity';



export class GameMapper {
  static toDomain(entity: GameEntity): GameSession {
    return new GameSession(entity.id, entity.board);
  }

  static toEntity(domain: GameSession): GameEntity {
    const entity = new GameEntity();
    entity.id = domain.id;
    entity.board = domain.board;
    return entity;
  }
}