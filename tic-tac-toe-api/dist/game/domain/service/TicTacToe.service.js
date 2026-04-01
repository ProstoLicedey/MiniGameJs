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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const game_repository_1 = require("../../datasource/repository/game.repository");
const gameSession_1 = require("../model/gameSession");
const datasourse_mapper_1 = require("../../datasource/mapper/datasourse.mapper");
const HUMAN = 1;
const COMPUTER = 0;
let GameService = class GameService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    initGame() {
        const game = new gameSession_1.GameSession();
        return game;
    }
    nextMove(game) {
        const boardCopy = game.board.map(row => [...row]);
        const bestMove = this.findBestMove(boardCopy);
        if (!bestMove) {
            return game;
        }
        boardCopy[bestMove.row][bestMove.col] = COMPUTER;
        const updatedGame = new gameSession_1.GameSession(undefined, boardCopy);
        updatedGame.id = game.id;
        return updatedGame;
    }
    async boardValidate(game) {
        const DBGame = await this.repo.getById(game.id);
        if (DBGame == null) {
            throw new common_1.NotFoundException('Игра не найдена');
        }
        if (this.isGameOver(DBGame)) {
            throw new common_1.BadRequestException('Игра уже окончена');
        }
        if (!this.isBoardCheck(DBGame.board, game.board)) {
            throw new common_1.BadRequestException({
                message: 'Неверное состояние доски',
                board: DBGame.board,
            });
        }
        return true;
    }
    isBoardCheck(a, b) {
        if (a.length != b.length) {
            return false;
        }
        let count = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i].length !== b[i].length)
                return false;
            for (let j = 0; j < a[i].length; j++) {
                if (a[i][j] !== b[i][j]) {
                    if (a[i][j] !== null || b[i][j] !== HUMAN)
                        return false;
                    count++;
                }
            }
        }
        return count == 1;
    }
    isGameOver(game) {
        return this.checkWinner(game.board) !== null || this.isBoardFull(game.board);
    }
    async saveGame(game) {
        await this.repo.save(datasourse_mapper_1.GameMapper.toEntity(game));
    }
    getGameById(id) {
        return this.repo.getById(id);
    }
    checkWinner(board) {
        const lines = [
            board[0], board[1], board[2],
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]],
        ];
        for (const line of lines) {
            const a = line[0], b = line[1], c = line[2];
            if (a != null && b != null && c != null && a == b && b == c) {
                return a;
            }
        }
        return null;
    }
    isBoardFull(board) {
        return board.every(row => row.every(cell => cell !== null));
    }
    minimax(board, depth, isMaximizing) {
        const winner = this.checkWinner(board);
        if (winner === COMPUTER) {
            return 10 - depth;
        }
        if (winner === HUMAN) {
            return depth - 10;
        }
        if (this.isBoardFull(board)) {
            return 0;
        }
        if (isMaximizing) {
            let best = -Infinity;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (board[r][c] === null) {
                        board[r][c] = COMPUTER;
                        best = Math.max(best, this.minimax(board, depth + 1, false));
                        board[r][c] = null;
                    }
                }
            }
            return best;
        }
        else {
            let best = Infinity;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (board[r][c] === null) {
                        board[r][c] = HUMAN;
                        best = Math.min(best, this.minimax(board, depth + 1, true));
                        board[r][c] = null;
                    }
                }
            }
            return best;
        }
    }
    findBestMove(board) {
        let bestVal = -Infinity;
        let move = null;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (board[r][c] === null) {
                    board[r][c] = COMPUTER;
                    const moveVal = this.minimax(board, 0, false);
                    board[r][c] = null;
                    if (moveVal > bestVal) {
                        bestVal = moveVal;
                        move = { row: r, col: c };
                    }
                }
            }
        }
        return move;
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_repository_1.GameRepository])
], GameService);
//# sourceMappingURL=TicTacToe.service.js.map