import { Module } from '@nestjs/common';
import { GameRepository } from './repository/game.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GameEntity } from './model/game.entity';
import { BattleshipEntity } from './model/battleship.entity';
import { BattleshipRepository } from './repository/battleship.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const password = configService.get<string>('DB_PASSWORD');
        if (!password || typeof password !== 'string') {
          throw new Error('DB_PASSWORD must be a non-empty string');
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME'),
          password: password,
          database: configService.get<string>('DB_DATABASE'),
          entities: [GameEntity, BattleshipEntity],
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([GameEntity, BattleshipEntity]),
  ],
  providers: [GameRepository, BattleshipRepository],
  exports: [GameRepository, BattleshipRepository],
})
export class DatasourceModule { }
