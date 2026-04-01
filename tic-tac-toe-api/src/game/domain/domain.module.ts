import { Module } from '@nestjs/common';
import { DatasourceModule } from "../datasource/datasource.module";
import { GameService } from "./service/TicTacToe.service";
@Module({
  imports: [
    DatasourceModule
  ],
  providers: [GameService],
  exports: [GameService],
})
export class DomainModule { }
