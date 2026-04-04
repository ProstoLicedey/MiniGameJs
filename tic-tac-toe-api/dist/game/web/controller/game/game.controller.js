"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const gameSession_1 = require("../../../domain/model/gameSession");
const TicTacToe_service_1 = require("../../../domain/service/TicTacToe.service");
const web_mapper_1 = require("../../mapper/web.mapper");
let GameController = class GameController {
    gameService;
    constructor(gameService) {
        this.gameService = gameService;
    }
    async initGame(mode) {
        const gameMode = mode === 'two_player' ? 'two_player' : 'vs_ai';
        const game = this.gameService.initGame(gameMode);
        await this.gameService.saveGame(game);
        return { id: game.id, mode: game.mode };
    }
    async move(id, board) {
        let game = web_mapper_1.WebMapper.toDomain(id, board);
        if (await this.gameService.boardValidate(game)) {
            const stored = await this.gameService.getGameById(id);
            game = new gameSession_1.GameSession(id, board, stored.mode);
            if (!this.gameService.isGameOver(game) && stored.mode === 'vs_ai') {
                game = this.gameService.nextMove(game);
            }
            await this.gameService.saveGame(game);
            return web_mapper_1.WebMapper.toDto(game);
        }
    }
    async getGame(id) {
        const game = await this.gameService.getGameById(id);
        if (!game) {
            throw new common_1.NotFoundException('Игра не найдена');
        }
        return web_mapper_1.WebMapper.toDto(game);
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "initGame", null);
__decorate([
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "move", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getGame", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [TicTacToe_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map