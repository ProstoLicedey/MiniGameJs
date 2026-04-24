import { Repository } from 'typeorm';
import { BattleshipSession } from 'src/game/domain/model/battleshipSession';
import { BattleshipEntity } from '../model/battleship.entity';
export declare class BattleshipRepository {
    private readonly typeOrmRepository;
    constructor(typeOrmRepository: Repository<BattleshipEntity>);
    save(session: BattleshipSession): Promise<void>;
    getById(id: string): Promise<BattleshipSession | null>;
}
