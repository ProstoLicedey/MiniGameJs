"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleshipWebMapper = void 0;
const battleshipSession_1 = require("../../domain/model/battleshipSession");
const dto_model_1 = require("../model/dto.model");
const GRID = 10;
class BattleshipWebMapper {
    static toPlayerView(session, player) {
        const dto = new dto_model_1.BattleshipPlayerViewDto();
        dto.gameId = session.id;
        dto.player = player;
        dto.phase = session.phase;
        dto.winner = session.winner;
        const myFleet = player === 1 ? session.player1Fleet : session.player2Fleet;
        const incoming = player === 1 ? session.player2Shots : session.player1Shots;
        const myShots = player === 1 ? session.player1Shots : session.player2Shots;
        dto.iHavePlaced = myFleet !== null;
        dto.opponentHasPlaced =
            player === 1
                ? session.player2Fleet !== null
                : session.player1Fleet !== null;
        if (myFleet === null) {
            dto.myBoard = (0, battleshipSession_1.emptyFleetGrid)();
        }
        else {
            dto.myBoard = this.buildMyBoardView(myFleet, incoming);
        }
        dto.enemyBoard = myShots.map((row) => [...row]);
        if (session.phase === 'battle') {
            dto.currentTurn = session.currentTurn;
            dto.isMyTurn = session.currentTurn === player;
        }
        else if (session.phase === 'placement') {
            dto.currentTurn = null;
            dto.isMyTurn = myFleet === null;
        }
        else {
            dto.currentTurn = null;
            dto.isMyTurn = false;
        }
        return dto;
    }
    static buildMyBoardView(fleet, incomingShots) {
        const out = [];
        for (let r = 0; r < GRID; r++) {
            const row = [];
            for (let c = 0; c < GRID; c++) {
                const ship = fleet[r][c] === 1;
                const shot = incomingShots[r][c];
                if (ship && shot === 2) {
                    row.push(2);
                }
                else if (ship && shot === 0) {
                    row.push(1);
                }
                else if (!ship && shot === 1) {
                    row.push(3);
                }
                else {
                    row.push(0);
                }
            }
            out.push(row);
        }
        return out;
    }
}
exports.BattleshipWebMapper = BattleshipWebMapper;
//# sourceMappingURL=battleship.web.mapper.js.map