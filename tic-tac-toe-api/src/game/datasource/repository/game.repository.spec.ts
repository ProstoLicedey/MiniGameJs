import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { GameRepository } from './game.repository';
import { GameEntity } from '../model/game.entity';
import { GameSession } from '../../domain/model/gameSession';
import { v4 as uuidv4 } from 'uuid';

describe('GameRepository (интеграционные тесты с БД)', () => {
  let gameRepository: GameRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
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
              entities: [GameEntity],
              synchronize: true,
            };
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([GameEntity]),
      ],
      providers: [GameRepository],
    }).compile();

    gameRepository = module.get<GameRepository>(GameRepository);
    dataSource = module.get(DataSource);
  });

  afterAll(async () => {
    await dataSource?.destroy();
  });

  afterEach(async () => {
    await dataSource.getRepository(GameEntity).clear();
  });

  it('должен сохранить новую игру в БД и получить её по id', async () => {
    const gameId = uuidv4();
    const board: GameSession['board'] = [
      [1, 0, null],
      [null, 1, null],
      [null, null, 0],
    ];
    const gameSession = new GameSession(gameId, board);

    await gameRepository.save(gameSession);

    const result = await gameRepository.getById(gameId);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(gameId);
    expect(result!.board).toEqual(board);
  });

  it('должен вернуть null при получении несуществующей игры по id', async () => {
    const result = await gameRepository.getById('00000000-0000-0000-0000-000000000000');

    expect(result).toBeNull();
  });
});
