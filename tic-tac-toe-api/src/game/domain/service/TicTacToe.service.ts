import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { GameRepository } from "src/game/datasource/repository/game.repository";
import { Board, GameSession } from "../model/gameSession";
import { GameMapper } from "src/game/datasource/mapper/datasourse.mapper";


const HUMAN = 1;
const COMPUTER = 0;

@Injectable()
export class GameService {
  constructor(private repo: GameRepository) { }


  initGame(): GameSession {
    const game = new GameSession();

    return game;
  }

  nextMove(game: GameSession): GameSession {
    const boardCopy: Board = game.board.map(row => [...row]);
    const bestMove = this.findBestMove(boardCopy);

    if (!bestMove) {
      return game;
    }

    boardCopy[bestMove.row][bestMove.col] = COMPUTER;

    const updatedGame = new GameSession(undefined, boardCopy);
    updatedGame.id = game.id;

    return updatedGame;
  }

  async boardValidate(game: GameSession): Promise<boolean> {
    const DBGame = await this.repo.getById(game.id);

    if (DBGame == null) {
      throw new NotFoundException('Игра не найдена');
    }
    if (this.isGameOver(DBGame)) {
      throw new BadRequestException('Игра уже окончена');
    }
    if (!this.isBoardCheck(DBGame.board, game.board)) {
      throw new BadRequestException({
        message: 'Неверное состояние доски',
        board: DBGame.board,
      });

    }

    return true;
  }

  private isBoardCheck(a: Board, b: Board): boolean { //проверка правильности кода
    if (a.length != b.length) {
      return false;
    }
    let count = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i].length !== b[i].length) return false;
      for (let j = 0; j < a[i].length; j++) {
        if (a[i][j] !== b[i][j]) {
          if (a[i][j] !== null || b[i][j] !== HUMAN) return false;
          count++;
        }
      }
    }

    return count == 1;
  }

  isGameOver(game: GameSession): boolean { // проверяет победу 
    return this.checkWinner(game.board) !== null || this.isBoardFull(game.board);
  }

  async saveGame(game: GameSession): Promise<void> { // сохранение в бд
    await this.repo.save(GameMapper.toEntity(game));
  }

  getGameById(id: string): Promise<GameSession | null> { // поиск игры в БД
    return this.repo.getById(id);
  }

  private checkWinner(board: Board): number | null { // ищет три в ряд и возвращает победителя
    const lines = [
      board[0], board[1], board[2],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const line of lines) {
      const a = line[0], b = line[1], c = line[2];
      if (a != null && b != null && c != null && a == b && b == c) {
        return a as number;
      }
    }

    return null;
  }

  private isBoardFull(board: Board): boolean {
    return board.every(row => row.every(cell => cell !== null));
  }

  private minimax(board: Board, depth: number, isMaximizing: boolean): number {
    const winner = this.checkWinner(board);
    if (winner === COMPUTER) {
      return 10 - depth;
    }
    if (winner === HUMAN) {
      return depth - 10;
    }
    if (this.isBoardFull(board)) {
      return 0;
    }

    if (isMaximizing) {
      let best = -Infinity;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[r][c] === null) {
            board[r][c] = COMPUTER;
            best = Math.max(best, this.minimax(board, depth + 1, false));
            board[r][c] = null;
          }
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[r][c] === null) {
            board[r][c] = HUMAN;
            best = Math.min(best, this.minimax(board, depth + 1, true));
            board[r][c] = null;
          }
        }
      }
      return best;
    }
  }

  private findBestMove(board: Board): { row: number; col: number } | null {
    let bestVal = -Infinity;
    let move: { row: number; col: number } | null = null;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === null) {
          board[r][c] = COMPUTER;
          const moveVal = this.minimax(board, 0, false);
          board[r][c] = null;

          if (moveVal > bestVal) {
            bestVal = moveVal;
            move = { row: r, col: c };
          }
        }
      }
    }

    return move;
  }

}