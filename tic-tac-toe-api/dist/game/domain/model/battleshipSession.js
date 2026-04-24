"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleshipSession = void 0;
exports.emptyShotsGrid = emptyShotsGrid;
exports.emptyFleetGrid = emptyFleetGrid;
const uuid_1 = require("uuid");
class BattleshipSession {
    id;
    player1Fleet;
    player2Fleet;
    player1Shots;
    player2Shots;
    phase;
    currentTurn;
    winner;
    constructor(id, player1Fleet = null, player2Fleet = null, player1Shots, player2Shots, phase = 'placement', currentTurn = 1, winner = null) {
        this.id = id ?? (0, uuid_1.v4)();
        this.player1Fleet = player1Fleet;
        this.player2Fleet = player2Fleet;
        this.player1Shots = player1Shots ?? emptyShotsGrid();
        this.player2Shots = player2Shots ?? emptyShotsGrid();
        this.phase = phase;
        this.currentTurn = currentTurn;
        this.winner = winner;
    }
}
exports.BattleshipSession = BattleshipSession;
function emptyShotsGrid() {
    return Array.from({ length: 10 }, () => Array(10).fill(0));
}
function emptyFleetGrid() {
    return Array.from({ length: 10 }, () => Array(10).fill(0));
}
//# sourceMappingURL=battleshipSession.js.map