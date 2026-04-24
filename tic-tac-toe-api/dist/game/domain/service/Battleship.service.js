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
exports.BattleshipService = void 0;
const common_1 = require("@nestjs/common");
const battleship_repository_1 = require("../../datasource/repository/battleship.repository");
const battleshipSession_1 = require("../model/battleshipSession");
const GRID = 10;
const REQUIRED_SHIP_LENGTHS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
let BattleshipService = class BattleshipService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    initGame() {
        return new battleshipSession_1.BattleshipSession();
    }
    async saveGame(session) {
        await this.repo.save(session);
    }
    async getById(id) {
        return this.repo.getById(id);
    }
    async getByIdOrThrow(id) {
        const g = await this.repo.getById(id);
        if (!g)
            throw new common_1.NotFoundException('Игра не найдена');
        return g;
    }
    parsePlayer(param) {
        const n = Number(param);
        if (n !== 1 && n !== 2) {
            throw new common_1.BadRequestException('Номер игрока должен быть 1 или 2');
        }
        return n;
    }
    placeFleet(session, player, ships) {
        if (session.phase !== 'placement') {
            throw new common_1.BadRequestException('Расстановка уже завершена');
        }
        const existing = player === 1 ? session.player1Fleet : session.player2Fleet;
        if (existing !== null) {
            throw new common_1.BadRequestException('Вы уже расставили корабли');
        }
        if (!this.validateFleet(ships)) {
            throw new common_1.BadRequestException('Некорректная расстановка кораблей');
        }
        const grid = this.fleetFromShips(ships);
        const next = player === 1
            ? new battleshipSession_1.BattleshipSession(session.id, grid, session.player2Fleet, session.player1Shots, session.player2Shots, session.phase, session.currentTurn, session.winner)
            : new battleshipSession_1.BattleshipSession(session.id, session.player1Fleet, grid, session.player1Shots, session.player2Shots, session.phase, session.currentTurn, session.winner);
        if (next.player1Fleet !== null && next.player2Fleet !== null) {
            next.phase = 'battle';
            next.currentTurn = 1;
        }
        return next;
    }
    fire(session, player, row, col) {
        if (session.phase !== 'battle') {
            throw new common_1.BadRequestException('Сейчас нельзя стрелять');
        }
        if (session.currentTurn !== player) {
            throw new common_1.BadRequestException('Не ваш ход');
        }
        if (!this.inBounds(row, col)) {
            throw new common_1.BadRequestException('Координаты вне поля');
        }
        const myShots = player === 1 ? session.player1Shots : session.player2Shots;
        if (myShots[row][col] !== 0) {
            throw new common_1.BadRequestException('По этой клетке уже стреляли');
        }
        const enemyFleet = player === 1 ? session.player2Fleet : session.player1Fleet;
        const hit = enemyFleet[row][col] === 1;
        const shots1 = player === 1
            ? this.copyShots(session.player1Shots)
            : session.player1Shots;
        const shots2 = player === 2
            ? this.copyShots(session.player2Shots)
            : session.player2Shots;
        const targetShots = player === 1 ? shots1 : shots2;
        targetShots[row][col] = hit ? 2 : 1;
        const myShotsUpdated = player === 1 ? shots1 : shots2;
        let winner = null;
        let phase = session.phase;
        const nextTurn = player === 1 ? 2 : 1;
        if (this.allShipsSunk(enemyFleet, myShotsUpdated)) {
            winner = player;
            phase = 'finished';
        }
        const turnAfter = phase === 'finished' ? session.currentTurn : nextTurn;
        return new battleshipSession_1.BattleshipSession(session.id, session.player1Fleet, session.player2Fleet, shots1, shots2, phase, turnAfter, winner);
    }
    copyShots(g) {
        return g.map((row) => [...row]);
    }
    allShipsSunk(fleet, myShotsAtEnemy) {
        for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
                if (fleet[r][c] === 1 && myShotsAtEnemy[r][c] !== 2) {
                    return false;
                }
            }
        }
        return true;
    }
    fleetFromShips(ships) {
        const grid = (0, battleshipSession_1.emptyFleetGrid)();
        for (const ship of ships) {
            for (const [r, c] of ship) {
                grid[r][c] = 1;
            }
        }
        return grid;
    }
    validateFleet(ships) {
        if (ships.length !== REQUIRED_SHIP_LENGTHS.length)
            return false;
        const got = ships.map((s) => s.length).sort((a, b) => b - a);
        const need = [...REQUIRED_SHIP_LENGTHS].sort((a, b) => b - a);
        if (got.some((len, i) => len !== need[i]))
            return false;
        const used = new Set();
        for (const ship of ships) {
            if (!this.isStraightConnectedShip(ship))
                return false;
            for (const [r, c] of ship) {
                if (!this.inBounds(r, c))
                    return false;
                const key = `${r},${c}`;
                if (used.has(key))
                    return false;
                used.add(key);
            }
        }
        return this.shipsHaveClassicSeparation(ships);
    }
    shipsHaveClassicSeparation(ships) {
        for (let i = 0; i < ships.length; i++) {
            for (let j = i + 1; j < ships.length; j++) {
                for (const [r1, c1] of ships[i]) {
                    for (const [r2, c2] of ships[j]) {
                        if (Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2)) <= 1) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
    isStraightConnectedShip(cells) {
        if (cells.length === 0)
            return false;
        if (cells.length === 1)
            return true;
        const rows = new Set(cells.map(([r]) => r));
        const cols = new Set(cells.map(([, c]) => c));
        if (rows.size > 1 && cols.size > 1)
            return false;
        if (rows.size === 1) {
            const sorted = [...cells].sort((a, b) => a[1] - b[1]);
            for (let i = 1; i < sorted.length; i++) {
                if (sorted[i][1] !== sorted[i - 1][1] + 1)
                    return false;
            }
            return true;
        }
        const sorted = [...cells].sort((a, b) => a[0] - b[0]);
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i][0] !== sorted[i - 1][0] + 1)
                return false;
        }
        return true;
    }
    inBounds(row, col) {
        return (Number.isInteger(row) &&
            Number.isInteger(col) &&
            row >= 0 &&
            row < GRID &&
            col >= 0 &&
            col < GRID);
    }
};
exports.BattleshipService = BattleshipService;
exports.BattleshipService = BattleshipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [battleship_repository_1.BattleshipRepository])
], BattleshipService);
//# sourceMappingURL=Battleship.service.js.map