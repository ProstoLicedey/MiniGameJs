import {
  type BattleshipPhase,
  type BattleshipPlayerId,
  type FleetGrid,
  type ShotsGrid,
} from 'src/game/domain/model/battleshipSession';
import { Entity, Column, PrimaryColumn } from 'typeorm';

export interface BattleshipStateJson {
  player1Fleet: FleetGrid;
  player2Fleet: FleetGrid;
  player1Shots: ShotsGrid;
  player2Shots: ShotsGrid;
  phase: BattleshipPhase;
  currentTurn: BattleshipPlayerId;
  winner: BattleshipPlayerId | null;
}

@Entity('battleship_games')
export class BattleshipEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: false })
  state: BattleshipStateJson;
}
