import { Module } from '@nestjs/common';
import { DatasourceModule } from "../datasource/datasource.module";
import { GameService } from "./service/TicTacToe.service";
import { BattleshipService } from "./service/Battleship.service";
@Module({
  imports: [
    DatasourceModule
  ],
  providers: [GameService, BattleshipService],
  exports: [GameService, BattleshipService],
})
export class DomainModule { }
