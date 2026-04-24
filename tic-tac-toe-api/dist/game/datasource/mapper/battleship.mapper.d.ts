import { BattleshipSession } from 'src/game/domain/model/battleshipSession';
import { BattleshipEntity } from '../model/battleship.entity';
export declare class BattleshipMapper {
    static toDomain(entity: BattleshipEntity): BattleshipSession;
    static toEntity(domain: BattleshipSession): BattleshipEntity;
}
