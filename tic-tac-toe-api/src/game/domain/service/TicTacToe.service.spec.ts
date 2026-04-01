import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GameService } from './TicTacToe.service';
import { GameRepository } from 'src/game/datasource/repository/game.repository';
import { GameSession } from '../model/gameSession';
import { v4 as uuidv4 } from 'uuid';

describe('GameService', () => {
  let service: GameService;
  let repo: jest.Mocked<GameRepository>;

  const emptyBoard: GameSession['board'] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  beforeEach(async () => {
    const mockRepo = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: GameRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    repo = module.get(GameRepository) as jest.Mocked<GameRepository>;
  });

  describe('boardValidate', () => {
    it('должен выбросить NotFoundException, если игра не найдена в БД', async () => {
      const gameId = uuidv4();
      const game = new GameSession(gameId, emptyBoard);
      repo.getById.mockResolvedValue(null);

      await expect(service.boardValidate(game)).rejects.toThrow(NotFoundException);
      await expect(service.boardValidate(game)).rejects.toThrow('Игра не найдена');
    });

    it('должен вернуть true при валидном ходе (одна клетка null -> 1)', async () => {
      const gameId = uuidv4();
      const dbBoard: GameSession['board'] = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];
      const requestBoard: GameSession['board'] = [
        [null, null, null],
        [null, 1, null],
        [null, null, null],
      ];
      repo.getById.mockResolvedValue(new GameSession(gameId, dbBoard));

      const result = await service.boardValidate(
        new GameSession(gameId, requestBoard),
      );

      expect(result).toBe(true);
    });

    it('должен выбросить BadRequestException при нескольких изменениях', async () => {
      const gameId = uuidv4();
      const dbBoard: GameSession['board'] = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];
      const requestBoard: GameSession['board'] = [
        [1, null, null],
        [null, 1, null],
        [null, null, null],
      ];
      repo.getById.mockResolvedValue(new GameSession(gameId, dbBoard));

      await expect(
        service.boardValidate(new GameSession(gameId, requestBoard)),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.boardValidate(new GameSession(gameId, requestBoard)),
      ).rejects.toThrow('Неверное состояние доски');
    });

    it('должен выбросить BadRequestException при попытке изменить клетку компьютера', async () => {
      const gameId = uuidv4();
      const dbBoard: GameSession['board'] = [
        [null, 0, null],
        [null, null, null],
        [null, null, null],
      ];
      const requestBoard: GameSession['board'] = [
        [null, 1, null],
        [null, null, null],
        [null, null, null],
      ];
      repo.getById.mockResolvedValue(new GameSession(gameId, dbBoard));

      await expect(
        service.boardValidate(new GameSession(gameId, requestBoard)),
      ).rejects.toThrow(BadRequestException);
    });

    it('должен выбросить BadRequestException при изменении null на 0 вместо 1', async () => {
      const gameId = uuidv4();
      const dbBoard: GameSession['board'] = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];
      const requestBoard: GameSession['board'] = [
        [null, null, null],
        [null, 0, null],
        [null, null, null],
      ];
      repo.getById.mockResolvedValue(new GameSession(gameId, dbBoard));

      await expect(
        service.boardValidate(new GameSession(gameId, requestBoard)),
      ).rejects.toThrow(BadRequestException);
    });

    it('должен выбросить BadRequestException при отсутствии изменений', async () => {
      const gameId = uuidv4();
      const board: GameSession['board'] = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];
      repo.getById.mockResolvedValue(new GameSession(gameId, board));

      await expect(
        service.boardValidate(new GameSession(gameId, board)),
      ).rejects.toThrow(BadRequestException);
    });

    it('должен выбросить BadRequestException при разной размерности досок', async () => {
      const gameId = uuidv4();
      const dbBoard: GameSession['board'] = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];
      const requestBoard: GameSession['board'] = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];
      repo.getById.mockResolvedValue(new GameSession(gameId, dbBoard));

      await expect(
        service.boardValidate(new GameSession(gameId, requestBoard)),
      ).rejects.toThrow(BadRequestException);
    });

    it('должен вернуть true при валидном ходе на уже частично заполненной доске', async () => {
      const gameId = uuidv4();
      const dbBoard: GameSession['board'] = [
        [1, 0, null],
        [null, 1, null],
        [null, null, 0],
      ];
      const requestBoard: GameSession['board'] = [
        [1, 0, null],
        [null, 1, 1],
        [null, null, 0],
      ];
      repo.getById.mockResolvedValue(new GameSession(gameId, dbBoard));

      const result = await service.boardValidate(
        new GameSession(gameId, requestBoard),
      );

      expect(result).toBe(true);
    });
  });
});
