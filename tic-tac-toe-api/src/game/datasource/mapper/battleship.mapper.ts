import { BattleshipSession } from 'src/game/domain/model/battleshipSession';
import { BattleshipEntity } from '../model/battleship.entity';

export class BattleshipMapper {
  static toDomain(entity: BattleshipEntity): BattleshipSession {
    const s = entity.state;
    return new BattleshipSession(
      entity.id,
      s.player1Fleet,
      s.player2Fleet,
      s.player1Shots,
      s.player2Shots,
      s.phase,
      s.currentTurn,
      s.winner,
    );
  }

  static toEntity(domain: BattleshipSession): BattleshipEntity {
    const entity = new BattleshipEntity();
    entity.id = domain.id;
    entity.state = {
      player1Fleet: domain.player1Fleet,
      player2Fleet: domain.player2Fleet,
      player1Shots: domain.player1Shots,
      player2Shots: domain.player2Shots,
      phase: domain.phase,
      currentTurn: domain.currentTurn,
      winner: domain.winner,
    };
    return entity;
  }
}
