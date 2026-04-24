import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameController } from './game/web/controller/game/game.controller';
import { BattleshipController } from './game/web/controller/battleship/battleship.controller';
import { GameService } from './game/domain/service/TicTacToe.service';
import { BattleshipService } from './game/domain/service/Battleship.service';
import { DatasourceModule } from './game/datasource/datasource.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatasourceModule
  ],
  controllers: [GameController, BattleshipController],
  providers: [GameService, BattleshipService],
})
export class AppModule { }