"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const game_controller_1 = require("./game/web/controller/game/game.controller");
const battleship_controller_1 = require("./game/web/controller/battleship/battleship.controller");
const TicTacToe_service_1 = require("./game/domain/service/TicTacToe.service");
const Battleship_service_1 = require("./game/domain/service/Battleship.service");
const datasource_module_1 = require("./game/datasource/datasource.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            datasource_module_1.DatasourceModule
        ],
        controllers: [game_controller_1.GameController, battleship_controller_1.BattleshipController],
        providers: [TicTacToe_service_1.GameService, Battleship_service_1.BattleshipService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map