import { BattleshipService } from 'src/game/domain/service/Battleship.service';
import { BattleshipCreateResponseDto, BattleshipFireBodyDto, BattleshipPlacementBodyDto, BattleshipPlayerViewDto } from '../../model/dto.model';
export declare class BattleshipController {
    private readonly battleshipService;
    constructor(battleshipService: BattleshipService);
    createGame(): Promise<BattleshipCreateResponseDto>;
    getForPlayer(id: string, playerParam: string): Promise<BattleshipPlayerViewDto>;
    placement(id: string, playerParam: string, body: BattleshipPlacementBodyDto): Promise<BattleshipPlayerViewDto>;
    fire(id: string, playerParam: string, body: BattleshipFireBodyDto): Promise<BattleshipPlayerViewDto>;
}
