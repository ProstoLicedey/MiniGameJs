"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSession = void 0;
const uuid_1 = require("uuid");
class GameSession {
    id;
    board;
    mode;
    constructor(id, board, mode) {
        this.id = id || (0, uuid_1.v4)();
        this.board = board || [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
        this.mode = mode ?? 'vs_ai';
    }
}
exports.GameSession = GameSession;
//# sourceMappingURL=gameSession.js.map