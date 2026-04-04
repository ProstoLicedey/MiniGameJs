import type { Board } from 'src/game/domain/model/gameSession';
import { Entity, Column, PrimaryColumn } from 'typeorm';


@Entity('games')
export class GameEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'json',
    nullable: false,
  })
  board: Board;

  @Column({ type: 'varchar', length: 20, default: 'vs_ai' })
  mode: string;
}