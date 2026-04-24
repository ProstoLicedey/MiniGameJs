import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleshipSession } from 'src/game/domain/model/battleshipSession';
import { BattleshipMapper } from '../mapper/battleship.mapper';
import { BattleshipEntity } from '../model/battleship.entity';

@Injectable()
export class BattleshipRepository {
  constructor(
    @InjectRepository(BattleshipEntity)
    private readonly typeOrmRepository: Repository<BattleshipEntity>,
  ) {}

  async save(session: BattleshipSession): Promise<void> {
    await this.typeOrmRepository.save(BattleshipMapper.toEntity(session));
  }

  async getById(id: string): Promise<BattleshipSession | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { id: id as any },
    });
    return entity ? BattleshipMapper.toDomain(entity) : null;
  }
}
