import { Board, GameSession } from 'src/game/domain/model/gameSession';
import { GameDto } from '../model/dto.model';



export class WebMapper {
  static toDomain(id: string, board: Board): GameSession {
    return new GameSession(id, board);
  }

  static toDto(game: GameSession): GameDto {
    const dto = new GameDto();
    dto.id = game.id;
    dto.board = game.board;
    return dto;
  }
}