import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BattleshipRepository } from 'src/game/datasource/repository/battleship.repository';
import {
  BattleshipSession,
  emptyFleetGrid,
  type BattleshipPhase,
  type BattleshipPlayerId,
} from '../model/battleshipSession';

const GRID = 10;
const REQUIRED_SHIP_LENGTHS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

export type ShipCells = [number, number][];

@Injectable()
export class BattleshipService {
  constructor(private readonly repo: BattleshipRepository) {}

  initGame(): BattleshipSession {
    return new BattleshipSession();
  }

  async saveGame(session: BattleshipSession): Promise<void> {
    await this.repo.save(session);
  }

  async getById(id: string): Promise<BattleshipSession | null> {
    return this.repo.getById(id);
  }

  async getByIdOrThrow(id: string): Promise<BattleshipSession> {
    const g = await this.repo.getById(id);
    if (!g) throw new NotFoundException('Игра не найдена');
    return g;
  }

  parsePlayer(param: string): BattleshipPlayerId {
    const n = Number(param);
    if (n !== 1 && n !== 2) {
      throw new BadRequestException('Номер игрока должен быть 1 или 2');
    }
    return n as BattleshipPlayerId;
  }

  placeFleet(session: BattleshipSession, player: BattleshipPlayerId, ships: ShipCells[]): BattleshipSession {
    if (session.phase !== 'placement') {
      throw new BadRequestException('Расстановка уже завершена');
    }
    const existing = player === 1 ? session.player1Fleet : session.player2Fleet;
    if (existing !== null) {
      throw new BadRequestException('Вы уже расставили корабли');
    }
    if (!this.validateFleet(ships)) {
      throw new BadRequestException('Некорректная расстановка кораблей');
    }
    const grid = this.fleetFromShips(ships);
    const next =
      player === 1
        ? new BattleshipSession(
            session.id,
            grid,
            session.player2Fleet,
            session.player1Shots,
            session.player2Shots,
            session.phase,
            session.currentTurn,
            session.winner,
          )
        : new BattleshipSession(
            session.id,
            session.player1Fleet,
            grid,
            session.player1Shots,
            session.player2Shots,
            session.phase,
            session.currentTurn,
            session.winner,
          );

    if (next.player1Fleet !== null && next.player2Fleet !== null) {
      next.phase = 'battle';
      next.currentTurn = 1;
    }
    return next;
  }

  fire(session: BattleshipSession, player: BattleshipPlayerId, row: number, col: number): BattleshipSession {
    if (session.phase !== 'battle') {
      throw new BadRequestException('Сейчас нельзя стрелять');
    }
    if (session.currentTurn !== player) {
      throw new BadRequestException('Не ваш ход');
    }
    if (!this.inBounds(row, col)) {
      throw new BadRequestException('Координаты вне поля');
    }

    const myShots = player === 1 ? session.player1Shots : session.player2Shots;
    if (myShots[row][col] !== 0) {
      throw new BadRequestException('По этой клетке уже стреляли');
    }

    const enemyFleet = player === 1 ? session.player2Fleet! : session.player1Fleet!;
    const hit = enemyFleet[row][col] === 1;

    const shots1 =
      player === 1
        ? this.copyShots(session.player1Shots)
        : session.player1Shots;
    const shots2 =
      player === 2
        ? this.copyShots(session.player2Shots)
        : session.player2Shots;

    const targetShots = player === 1 ? shots1 : shots2;
    targetShots[row][col] = hit ? 2 : 1;

    const myShotsUpdated = player === 1 ? shots1 : shots2;
    let winner: BattleshipPlayerId | null = null;
    let phase: BattleshipPhase = session.phase;
    const nextTurn: BattleshipPlayerId = player === 1 ? 2 : 1;

    if (this.allShipsSunk(enemyFleet, myShotsUpdated)) {
      winner = player;
      phase = 'finished';
    }

    const turnAfter: BattleshipPlayerId =
      phase === 'finished' ? session.currentTurn : nextTurn;

    return new BattleshipSession(
      session.id,
      session.player1Fleet,
      session.player2Fleet,
      shots1,
      shots2,
      phase,
      turnAfter,
      winner,
    );
  }

  private copyShots(g: number[][]): number[][] {
    return g.map((row) => [...row]);
  }

  private allShipsSunk(fleet: number[][], myShotsAtEnemy: number[][]): boolean {
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        if (fleet[r][c] === 1 && myShotsAtEnemy[r][c] !== 2) {
          return false;
        }
      }
    }
    return true;
  }

  private fleetFromShips(ships: ShipCells[]): number[][] {
    const grid = emptyFleetGrid();
    for (const ship of ships) {
      for (const [r, c] of ship) {
        grid[r][c] = 1;
      }
    }
    return grid;
  }

  private validateFleet(ships: ShipCells[]): boolean {
    if (ships.length !== REQUIRED_SHIP_LENGTHS.length) return false;
    const got = ships.map((s) => s.length).sort((a, b) => b - a);
    const need = [...REQUIRED_SHIP_LENGTHS].sort((a, b) => b - a);
    if (got.some((len, i) => len !== need[i])) return false;

    const used = new Set<string>();
    for (const ship of ships) {
      if (!this.isStraightConnectedShip(ship)) return false;
      for (const [r, c] of ship) {
        if (!this.inBounds(r, c)) return false;
        const key = `${r},${c}`;
        if (used.has(key)) return false;
        used.add(key);
      }
    }
    return this.shipsHaveClassicSeparation(ships);
  }

  /** Классические правила РФ: корабли не касаются даже по диагонали. */
  private shipsHaveClassicSeparation(ships: ShipCells[]): boolean {
    for (let i = 0; i < ships.length; i++) {
      for (let j = i + 1; j < ships.length; j++) {
        for (const [r1, c1] of ships[i]) {
          for (const [r2, c2] of ships[j]) {
            if (Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2)) <= 1) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  private isStraightConnectedShip(cells: ShipCells): boolean {
    if (cells.length === 0) return false;
    if (cells.length === 1) return true;
    const rows = new Set(cells.map(([r]) => r));
    const cols = new Set(cells.map(([, c]) => c));
    if (rows.size > 1 && cols.size > 1) return false;
    if (rows.size === 1) {
      const sorted = [...cells].sort((a, b) => a[1] - b[1]);
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i][1] !== sorted[i - 1][1] + 1) return false;
      }
      return true;
    }
    const sorted = [...cells].sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i][0] !== sorted[i - 1][0] + 1) return false;
    }
    return true;
  }

  private inBounds(row: number, col: number): boolean {
    return (
      Number.isInteger(row) &&
      Number.isInteger(col) &&
      row >= 0 &&
      row < GRID &&
      col >= 0 &&
      col < GRID
    );
  }
}
