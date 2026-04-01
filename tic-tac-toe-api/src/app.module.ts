import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game/datasource/model/game.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GameController } from './game/web/controller/game/game.controller';
import { GameService } from './game/domain/service/TicTacToe.service';
import { GameRepository } from './game/datasource/repository/game.repository';
import { DatasourceModule } from './game/datasource/datasource.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatasourceModule
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class AppModule { }