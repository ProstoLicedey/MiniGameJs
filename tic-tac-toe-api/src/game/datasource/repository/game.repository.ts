import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameMapper } from '../mapper/datasourse.mapper';
import { GameEntity } from '../model/game.entity';
import { GameSession } from 'src/game/domain/model/gameSession';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(GameEntity)
    private readonly typeOrmRepository: Repository<GameEntity>,
  ) { }

  async save(game: GameSession): Promise<void> {
    const entity = GameMapper.toEntity(game);

    await this.typeOrmRepository.save(entity);
  }

  async getById(id: string): Promise<GameSession | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { id: id as any }
    });

    return entity ? GameMapper.toDomain(entity) : null;
  }
}