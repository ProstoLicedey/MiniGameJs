import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getGame, makeMove } from '../api/gameApi';
import { Board } from '../components/Board/Board';
import type { Board as BoardType } from '../types/game';
import { createEmptyBoard, getGameResult } from '../utils/gameRules';
import './GamePage.scss';

function cloneBoard(board: BoardType): BoardType {
  return board.map((row) => [...row]);
}

function resultLabel(result: ReturnType<typeof getGameResult>): string {
  if (result === 'human') return 'Ты победил';
  if (result === 'computer') return 'Победил компьютер';
  if (result === 'draw') return 'Ничья';
  return 'Твой ход';
}

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => getGameResult(board), [board]);
  const isGameFinished = result !== 'playing';

  useEffect(() => {
    let cancelled = false;
    if (!gameId) {
      setInitialLoading(false);
      return;
    }

    const loadGame = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const response = await getGame(gameId);
        if (!cancelled) {
          setBoard(response.board);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить игру');
        }
      } finally {
        if (!cancelled) {
          setInitialLoading(false);
        }
      }
    };

    void loadGame();

    return () => {
      cancelled = true;
    };
  }, [gameId]);

  const onCellClick = async (row: number, col: number) => {
    if (!gameId || loading || isGameFinished) return;

    const nextBoard = cloneBoard(board);
    if (nextBoard[row][col] !== null) return;
    nextBoard[row][col] = 1;

    setLoading(true);
    setError(null);
    try {
      const response = await makeMove(gameId, nextBoard);
      setBoard(response.board);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка хода');
    } finally {
      setLoading(false);
    }
  };

  if (!gameId) {
    return (
      <main className="game-page">
        <p>Не найден id игры.</p>
        <button type="button" onClick={() => navigate('/')}>
          На главную
        </button>
      </main>
    );
  }

  return (
    <main className="game-page">
      <h1>Игра #{gameId.slice(0, 8)}</h1>
      <p className="game-page__status">
        {initialLoading ? 'Загружаем игру...' : loading ? 'Компьютер думает...' : resultLabel(result)}
      </p>
      {error && <p className="game-page__error">{error}</p>}
      <Board board={board} disabled={initialLoading || loading || isGameFinished} onCellClick={onCellClick} />
      <div className="game-page__actions">
        <Link to="/">Новая игра</Link>
      </div>
    </main>
  );
}
