import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import type { Board } from 'src/game/domain/model/gameSession';
import { GameMode, GameSession } from 'src/game/domain/model/gameSession';
import { GameService } from 'src/game/domain/service/TicTacToe.service';
import { GameDto } from '../../model/dto.model';
import { WebMapper } from '../../mapper/web.mapper';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Get()
  async initGame(@Query('mode') mode?: string) {
    const gameMode: GameMode = mode === 'two_player' ? 'two_player' : 'vs_ai';
    const game = this.gameService.initGame(gameMode);
    await this.gameService.saveGame(game);
    return { id: game.id, mode: game.mode };
  }

  @Post(':id')
  async move(@Param('id') id: string, @Body() board: Board) {
    let game: GameSession = WebMapper.toDomain(id, board);
    if (await this.gameService.boardValidate(game)) {
      const stored = await this.gameService.getGameById(id);
      game = new GameSession(id, board, stored!.mode);
      if (!this.gameService.isGameOver(game) && stored!.mode === 'vs_ai') {
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
