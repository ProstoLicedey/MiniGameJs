import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import * as gameSession from 'src/game/domain/model/gameSession';
import { GameService } from 'src/game/domain/service/TicTacToe.service';
import { GameDto } from '../../model/dto.model';
import { WebMapper } from '../../mapper/web.mapper';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Get()
  async initGame() {
    const game = this.gameService.initGame();
    await this.gameService.saveGame(game);
    return { id: game.id };
  }

  @Post(':id')
  async move(@Param('id') id: string, @Body() board: gameSession.Board) {
    let game: gameSession.GameSession = WebMapper.toDomain(id, board);
    if (await this.gameService.boardValidate(game)) {
      if (!this.gameService.isGameOver(game)) {
        game = this.gameService.nextMove(game);
      }
      await this.gameService.saveGame(game);
      return WebMapper.toDto(game);
    }
  }

  @Get(':id')
  async getGame(@Param('id') id: string): Promise<GameDto> {
    const game = await this.gameService.getGameById(id);
    if (!game) {
      throw new NotFoundException('Игра не найдена');
    }

    return WebMapper.toDto(game);
  }
}
