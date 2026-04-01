"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebMapper = void 0;
const gameSession_1 = require("../../domain/model/gameSession");
const dto_model_1 = require("../model/dto.model");
class WebMapper {
    static toDomain(id, board) {
        return new gameSession_1.GameSession(id, board);
    }
    static toDto(game) {
        const dto = new dto_model_1.GameDto();
        dto.id = game.id;
        dto.board = game.board;
        return dto;
    }
}
exports.WebMapper = WebMapper;
//# sourceMappingURL=web.mapper.js.map