import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createGame, getGame, makeMove } from '../api/gameApi';
import { Board } from '../components/Board/Board';
import type { Board as BoardType } from '../types/game';
import { createEmptyBoard, getTwoPlayerGameResult, nextTwoPlayerSymbol } from '../utils/gameRules';
import './GamePage.scss';

function cloneBoard(board: BoardType): BoardType {
  return board.map((row) => [...row]);
}

function turnLabel(sym: 0 | 1): string {
  return sym === 1 ? 'X' : 'O';
}

function resultMessage(result: ReturnType<typeof getTwoPlayerGameResult>): string {
  if (result === 'player_x') return 'Победил игрок X';
  if (result === 'player_o') return 'Победил игрок O';
  if (result === 'draw') return 'Ничья';
  return '';
}

export function LocalGamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [initialLoading, setInitialLoading] = useState(true);
  const [moveLoading, setMoveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => getTwoPlayerGameResult(board), [board]);
  const isGameFinished = result !== 'playing';
  const nextSymbol = useMemo(() => nextTwoPlayerSymbol(board), [board]);

  const statusText = useMemo(() => {
    if (initialLoading) return 'Загружаем игру...';
    if (moveLoading) return 'Сохраняем ход...';
    if (isGameFinished) return resultMessage(result);
    return `Ход игрока ${turnLabel(nextSymbol)}`;
  }, [initialLoading, moveLoading, isGameFinished, result, nextSymbol]);

  useEffect(() => {
    let cancelled = false;
    if (!gameId) {
      setInitialLoading(false);
      return;
    }

    const load = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const dto = await getGame(gameId);
        if (cancelled) return;
        const mode = dto.mode ?? 'vs_ai';
        if (mode !== 'two_player') {
          navigate(`/game/${gameId}`, { replace: true });
          return;
        }
        setBoard(dto.board);
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

    void load();

    return () => {
      cancelled = true;
    };
  }, [gameId, navigate]);

  const onCellClick = async (row: number, col: number) => {
    if (!gameId || initialLoading || moveLoading || isGameFinished) return;
    if (board[row][col] !== null) return;

    const symbol = nextTwoPlayerSymbol(board);
    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = symbol;

    setMoveLoading(true);
    setError(null);
    try {
      const dto = await makeMove(gameId, nextBoard);
      setBoard(dto.board);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка хода');
      try {
        const dto = await getGame(gameId);
        setBoard(dto.board);
      } catch {
        // ignore refetch errors
      }
    } finally {
      setMoveLoading(false);
    }
  };

  const restart = async () => {
    setError(null);
    setMoveLoading(true);
    try {
      const { id } = await createGame({ mode: 'two_player' });
      navigate(`/local/${id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать игру');
    } finally {
      setMoveLoading(false);
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
      <h1>Два игрока #{gameId.slice(0, 8)}</h1>
      <p className="game-page__status">{statusText}</p>
      {error && <p className="game-page__error">{error}</p>}
      <Board
        board={board}
        disabled={initialLoading || moveLoading || isGameFinished}
        onCellClick={onCellClick}
      />
      <div className="game-page__actions game-page__actions--local">
        <button type="button" className="game-page__secondary" onClick={() => void restart()}>
          Новая партия
        </button>
        <Link to="/">На главную</Link>
      </div>
    </main>
  );
}
