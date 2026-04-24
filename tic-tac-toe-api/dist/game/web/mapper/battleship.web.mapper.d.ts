import { BattleshipSession, type BattleshipPlayerId } from 'src/game/domain/model/battleshipSession';
import { BattleshipPlayerViewDto } from '../model/dto.model';
export declare class BattleshipWebMapper {
    static toPlayerView(session: BattleshipSession, player: BattleshipPlayerId): BattleshipPlayerViewDto;
    private static buildMyBoardView;
}
