"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleshipMapper = void 0;
const battleshipSession_1 = require("../../domain/model/battleshipSession");
const battleship_entity_1 = require("../model/battleship.entity");
class BattleshipMapper {
    static toDomain(entity) {
        const s = entity.state;
        return new battleshipSession_1.BattleshipSession(entity.id, s.player1Fleet, s.player2Fleet, s.player1Shots, s.player2Shots, s.phase, s.currentTurn, s.winner);
    }
    static toEntity(domain) {
        const entity = new battleship_entity_1.BattleshipEntity();
        entity.id = domain.id;
        entity.state = {
            player1Fleet: domain.player1Fleet,
            player2Fleet: domain.player2Fleet,
            player1Shots: domain.player1Shots,
            player2Shots: domain.player2Shots,
            phase: domain.phase,
            currentTurn: domain.currentTurn,
            winner: domain.winner,
        };
        return entity;
    }
}
exports.BattleshipMapper = BattleshipMapper;
//# sourceMappingURL=battleship.mapper.js.map