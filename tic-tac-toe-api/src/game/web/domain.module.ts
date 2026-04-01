import { Module } from '@nestjs/common';
import { DatasourceModule } from "../datasource/datasource.module";
import { DomainModule } from '../domain/domain.module';
import { GameController } from './controller/game/game.controller';

@Module({
  imports: [
    DomainModule
  ],
  controllers: [GameController],
})
export class WebDomainModule { }
