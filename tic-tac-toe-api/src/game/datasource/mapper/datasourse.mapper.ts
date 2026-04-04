import { GameMode, GameSession } from 'src/game/domain/model/gameSession';
import { GameEntity } from '../model/game.entity';

function entityMode(mode: string | null | undefined): GameMode {
  return mode === 'two_player' ? 'two_player' : 'vs_ai';
}

export class GameMapper {
  static toDomain(entity: GameEntity): GameSession {
    return new GameSession(entity.id, entity.board, entityMode(entity.mode));
  }

  static toEntity(domain: GameSession): GameEntity {
    const entity = new GameEntity();
    entity.id = domain.id;
    entity.board = domain.board;
    entity.mode = domain.mode;
    return entity;
  }
}