"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMapper = void 0;
const gameSession_1 = require("../../domain/model/gameSession");
const game_entity_1 = require("../model/game.entity");
class GameMapper {
    static toDomain(entity) {
        return new gameSession_1.GameSession(entity.id, entity.board);
    }
    static toEntity(domain) {
        const entity = new game_entity_1.GameEntity();
        entity.id = domain.id;
        entity.board = domain.board;
        return entity;
    }
}
exports.GameMapper = GameMapper;
//# sourceMappingURL=datasourse.mapper.js.map