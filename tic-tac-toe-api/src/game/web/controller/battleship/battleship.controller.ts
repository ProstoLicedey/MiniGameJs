import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { BattleshipService } from 'src/game/domain/service/Battleship.service';
import {
  BattleshipCreateResponseDto,
  BattleshipFireBodyDto,
  BattleshipPlacementBodyDto,
  BattleshipPlayerViewDto,
} from '../../model/dto.model';
import { BattleshipWebMapper } from '../../mapper/battleship.web.mapper';

@Controller('battleship')
export class BattleshipController {
  constructor(private readonly battleshipService: BattleshipService) {}

  /** Создаёт партию для двух игроков; каждому свой URL с номером игрока. */
  @Get()
  async createGame(): Promise<BattleshipCreateResponseDto> {
    const game = this.battleshipService.initGame();
    await this.battleshipService.saveGame(game);
    const dto = new BattleshipCreateResponseDto();
    dto.id = game.id;
    dto.player1Path = `/battleship/${game.id}/player/1`;
    dto.player2Path = `/battleship/${game.id}/player/2`;
    return dto;
  }

  /** Состояние с точки зрения игрока 1 или 2 (разные ответы на двух устройствах). */
  @Get(':id/player/:player')
  async getForPlayer(
    @Param('id') id: string,
    @Param('player') playerParam: string,
  ): Promise<BattleshipPlayerViewDto> {
    const player = this.battleshipService.parsePlayer(playerParam);
    const session = await this.battleshipService.getById(id);
    if (!session) {
      throw new NotFoundException('Игра не найдена');
    }
    return BattleshipWebMapper.toPlayerView(session, player);
  }

  @Post(':id/player/:player/placement')
  async placement(
    @Param('id') id: string,
    @Param('player') playerParam: string,
    @Body() body: BattleshipPlacementBodyDto,
  ): Promise<BattleshipPlayerViewDto> {
    const player = this.battleshipService.parsePlayer(playerParam);
    const session = await this.battleshipService.getByIdOrThrow(id);
    const next = this.battleshipService.placeFleet(session, player, body.ships);
    await this.battleshipService.saveGame(next);
    return BattleshipWebMapper.toPlayerView(next, player);
  }

  @Post(':id/player/:player/fire')
  async fire(
    @Param('id') id: string,
    @Param('player') playerParam: string,
    @Body() body: BattleshipFireBodyDto,
  ): Promise<BattleshipPlayerViewDto> {
    const player = this.battleshipService.parsePlayer(playerParam);
    const session = await this.battleshipService.getByIdOrThrow(id);
    const next = this.battleshipService.fire(session, player, body.row, body.col);
    await this.battleshipService.saveGame(next);
    return BattleshipWebMapper.toPlayerView(next, player);
  }
}
