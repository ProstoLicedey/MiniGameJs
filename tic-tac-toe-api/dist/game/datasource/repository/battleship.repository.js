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
exports.BattleshipRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const battleship_mapper_1 = require("../mapper/battleship.mapper");
const battleship_entity_1 = require("../model/battleship.entity");
let BattleshipRepository = class BattleshipRepository {
    typeOrmRepository;
    constructor(typeOrmRepository) {
        this.typeOrmRepository = typeOrmRepository;
    }
    async save(session) {
        await this.typeOrmRepository.save(battleship_mapper_1.BattleshipMapper.toEntity(session));
    }
    async getById(id) {
        const entity = await this.typeOrmRepository.findOne({
            where: { id: id },
        });
        return entity ? battleship_mapper_1.BattleshipMapper.toDomain(entity) : null;
    }
};
exports.BattleshipRepository = BattleshipRepository;
exports.BattleshipRepository = BattleshipRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(battleship_entity_1.BattleshipEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BattleshipRepository);
//# sourceMappingURL=battleship.repository.js.map