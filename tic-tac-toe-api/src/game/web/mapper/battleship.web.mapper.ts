import {
  BattleshipSession,
  emptyFleetGrid,
  type BattleshipPlayerId,
} from 'src/game/domain/model/battleshipSession';
import {
  BattleshipPlayerViewDto,
  type BattleshipPhaseDto,
} from '../model/dto.model';

const GRID = 10;

export class BattleshipWebMapper {
  static toPlayerView(
    session: BattleshipSession,
    player: BattleshipPlayerId,
  ): BattleshipPlayerViewDto {
    const dto = new BattleshipPlayerViewDto();
    dto.gameId = session.id;
    dto.player = player;
    dto.phase = session.phase as BattleshipPhaseDto;
    dto.winner = session.winner;

    const myFleet = player === 1 ? session.player1Fleet : session.player2Fleet;
    const incoming = player === 1 ? session.player2Shots : session.player1Shots;
    const myShots = player === 1 ? session.player1Shots : session.player2Shots;

    dto.iHavePlaced = myFleet !== null;
    dto.opponentHasPlaced =
      player === 1
        ? session.player2Fleet !== null
        : session.player1Fleet !== null;

    if (myFleet === null) {
      dto.myBoard = emptyFleetGrid();
    } else {
      dto.myBoard = this.buildMyBoardView(myFleet, incoming);
    }

    dto.enemyBoard = myShots.map((row) => [...row]);

    if (session.phase === 'battle') {
      dto.currentTurn = session.currentTurn;
      dto.isMyTurn = session.currentTurn === player;
    } else if (session.phase === 'placement') {
      dto.currentTurn = null;
      dto.isMyTurn = myFleet === null;
    } else {
      dto.currentTurn = null;
      dto.isMyTurn = false;
    }

    return dto;
  }

  /** Собирает вид своего поля: корабли + входящие выстрелы противника */
  private static buildMyBoardView(
    fleet: number[][],
    incomingShots: number[][],
  ): number[][] {
    const out: number[][] = [];
    for (let r = 0; r < GRID; r++) {
      const row: number[] = [];
      for (let c = 0; c < GRID; c++) {
        const ship = fleet[r][c] === 1;
        const shot = incomingShots[r][c];
        if (ship && shot === 2) {
          row.push(2);
        } else if (ship && shot === 0) {
          row.push(1);
        } else if (!ship && shot === 1) {
          row.push(3);
        } else {
          row.push(0);
        }
      }
      out.push(row);
    }
    return out;
  }
}
