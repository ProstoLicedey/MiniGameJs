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
exports.BattleshipController = void 0;
const common_1 = require("@nestjs/common");
const Battleship_service_1 = require("../../../domain/service/Battleship.service");
const dto_model_1 = require("../../model/dto.model");
const battleship_web_mapper_1 = require("../../mapper/battleship.web.mapper");
let BattleshipController = class BattleshipController {
    battleshipService;
    constructor(battleshipService) {
        this.battleshipService = battleshipService;
    }
    async createGame() {
        const game = this.battleshipService.initGame();
        await this.battleshipService.saveGame(game);
        const dto = new dto_model_1.BattleshipCreateResponseDto();
        dto.id = game.id;
        dto.player1Path = `/battleship/${game.id}/player/1`;
        dto.player2Path = `/battleship/${game.id}/player/2`;
        return dto;
    }
    async getForPlayer(id, playerParam) {
        const player = this.battleshipService.parsePlayer(playerParam);
        const session = await this.battleshipService.getById(id);
        if (!session) {
            throw new common_1.NotFoundException('Игра не найдена');
        }
        return battleship_web_mapper_1.BattleshipWebMapper.toPlayerView(session, player);
    }
    async placement(id, playerParam, body) {
        const player = this.battleshipService.parsePlayer(playerParam);
        const session = await this.battleshipService.getByIdOrThrow(id);
        const next = this.battleshipService.placeFleet(session, player, body.ships);
        await this.battleshipService.saveGame(next);
        return battleship_web_mapper_1.BattleshipWebMapper.toPlayerView(next, player);
    }
    async fire(id, playerParam, body) {
        const player = this.battleshipService.parsePlayer(playerParam);
        const session = await this.battleshipService.getByIdOrThrow(id);
        const next = this.battleshipService.fire(session, player, body.row, body.col);
        await this.battleshipService.saveGame(next);
        return battleship_web_mapper_1.BattleshipWebMapper.toPlayerView(next, player);
    }
};
exports.BattleshipController = BattleshipController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BattleshipController.prototype, "createGame", null);
__decorate([
    (0, common_1.Get)(':id/player/:player'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('player')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BattleshipController.prototype, "getForPlayer", null);
__decorate([
    (0, common_1.Post)(':id/player/:player/placement'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('player')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_model_1.BattleshipPlacementBodyDto]),
    __metadata("design:returntype", Promise)
], BattleshipController.prototype, "placement", null);
__decorate([
    (0, common_1.Post)(':id/player/:player/fire'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('player')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_model_1.BattleshipFireBodyDto]),
    __metadata("design:returntype", Promise)
], BattleshipController.prototype, "fire", null);
exports.BattleshipController = BattleshipController = __decorate([
    (0, common_1.Controller)('battleship'),
    __metadata("design:paramtypes", [Battleship_service_1.BattleshipService])
], BattleshipController);
//# sourceMappingURL=battleship.controller.js.map