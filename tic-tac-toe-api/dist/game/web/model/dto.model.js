"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleshipFireBodyDto = exports.BattleshipPlacementBodyDto = exports.BattleshipCreateResponseDto = exports.BattleshipPlayerViewDto = exports.GameDto = void 0;
class GameDto {
    id;
    board;
    mode;
}
exports.GameDto = GameDto;
class BattleshipPlayerViewDto {
    gameId;
    player;
    phase;
    currentTurn;
    isMyTurn;
    myBoard;
    enemyBoard;
    winner;
    iHavePlaced;
    opponentHasPlaced;
}
exports.BattleshipPlayerViewDto = BattleshipPlayerViewDto;
class BattleshipCreateResponseDto {
    id;
    player1Path;
    player2Path;
}
exports.BattleshipCreateResponseDto = BattleshipCreateResponseDto;
class BattleshipPlacementBodyDto {
    ships;
}
exports.BattleshipPlacementBodyDto = BattleshipPlacementBodyDto;
class BattleshipFireBodyDto {
    row;
    col;
}
exports.BattleshipFireBodyDto = BattleshipFireBodyDto;
//# sourceMappingURL=dto.model.js.map