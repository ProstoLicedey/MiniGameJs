import { Repository } from 'typeorm';
import { GameEntity } from '../model/game.entity';
import { GameSession } from 'src/game/domain/model/gameSession';
export declare class GameRepository {
    private readonly typeOrmRepository;
    constructor(typeOrmRepository: Repository<GameEntity>);
    save(game: GameSession): Promise<void>;
    getById(id: string): Promise<GameSession | null>;
}
