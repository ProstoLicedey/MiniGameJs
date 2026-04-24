import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  battleshipFire,
  createBattleshipGame,
  getBattleshipPlayerView,
  submitBattleshipPlacement,
} from '../api/battleshipApi';
import { BattleshipBoard } from '../components/BattleshipBoard/BattleshipBoard';
import type { BattleshipPlayerView, ShipCells } from '../types/battleship';
import {
  buildPlacementDisplayGrid,
  canPlaceShipClassic,
  countByLength,
  generateRandomFleet,
  getShipCellsFromAnchor,
  remainingLengthsAfterPlaced,
} from '../utils/battleshipFleet';
import './BattleshipPage.scss';

const POLL_MS = 2500;

function parsePlayer(param: string | undefined): 1 | 2 | null {
  if (param === '1' || param === '2') {
    return Number(param) as 1 | 2;
  }
  return null;
}

function statusMessage(view: BattleshipPlayerView | null): string {
  if (!view) return 'Загрузка...';
  if (view.phase === 'finished' && view.winner) {
    return view.winner === view.player ? 'Вы победили' : 'Победил соперник';
  }
  if (view.phase === 'placement') {
    if (!view.iHavePlaced) {
      return 'Расставьте корабли вручную (классические правила) и подтвердите.';
    }
    if (!view.opponentHasPlaced) {
      return 'Ожидаем расстановку соперника...';
    }
    return 'Начинаем бой.';
  }
  if (view.phase === 'battle') {
    return view.isMyTurn ? 'Ваш ход — стреляйте по полю соперника.' : 'Ход соперника...';
  }
  return '';
}

export function BattleshipLobbyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setError(null);
    try {
      const { id } = await createBattleshipGame();
      navigate(`/battleship/${id}/player/1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось создать игру');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="battleship-page battleship-page--lobby">
      <h1>Морской бой</h1>
      <p className="battleship-page__intro">
        Партия на двоих с двух устройств. Классическая расстановка: 1×4, 2×3, 3×2, 4×1; корабли не касаются друг друга
        даже по диагонали.
      </p>
      {error && <p className="battleship-page__error">{error}</p>}
      <button type="button" className="battleship-page__primary" onClick={() => void start()} disabled={loading}>
        {loading ? 'Создаём...' : 'Создать игру'}
      </button>
      <div className="battleship-page__footer">
        <Link to="/">На главную</Link>
      </div>
    </main>
  );
}

export function BattleshipGamePage() {
  const { gameId, playerId } = useParams<{ gameId: string; playerId: string }>();
  const player = useMemo(() => parsePlayer(playerId), [playerId]);

  const [view, setView] = useState<BattleshipPlayerView | null>(null);
  const [placedShips, setPlacedShips] = useState<ShipCells[]>([]);
  const [selectedLen, setSelectedLen] = useState<number | null>(null);
  const [vertical, setVertical] = useState(false);
  const [hoverPos, setHoverPos] = useState<[number, number] | null>(null);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [placementLoading, setPlacementLoading] = useState(false);
  const [fireLoading, setFireLoading] = useState(false);

  const remaining = useMemo(() => remainingLengthsAfterPlaced(placedShips), [placedShips]);
  const lengthCounts = useMemo(() => countByLength(remaining), [remaining]);
  const fleetComplete = remaining.length === 0;

  const hoverPreview = useMemo(() => {
    if (selectedLen === null || hoverPos === null) {
      return { cells: null as ShipCells | null, valid: false };
    }
    const cells = getShipCellsFromAnchor(hoverPos[0], hoverPos[1], selectedLen, vertical);
    if (!cells) {
      return { cells: null as ShipCells | null, valid: false };
    }
    const valid = canPlaceShipClassic(placedShips, cells);
    return { cells, valid };
  }, [selectedLen, hoverPos, vertical, placedShips]);

  const placementDisplayGrid = useMemo(
    () => buildPlacementDisplayGrid(placedShips, hoverPreview.cells, hoverPreview.valid),
    [placedShips, hoverPreview.cells, hoverPreview.valid],
  );

  const refresh = useCallback(async () => {
    if (!gameId || !player) return;
    try {
      const next = await getBattleshipPlayerView(gameId, player);
      setView(next);
      setInitialError(null);
    } catch (e) {
      setInitialError(e instanceof Error ? e.message : 'Ошибка загрузки');
    }
  }, [gameId, player]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!gameId || !player || !view) return;
    if (view.phase === 'finished') return;
    const id = window.setInterval(() => {
      void refresh();
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [gameId, player, view?.phase, refresh]);

  const opponentClientUrl = useMemo(() => {
    if (!gameId || typeof window === 'undefined') return '';
    return `${window.location.origin}/battleship/${gameId}/player/2`;
  }, [gameId]);

  const myPlayerClientUrl = useMemo(() => {
    if (!gameId || !player || typeof window === 'undefined') return '';
    return `${window.location.origin}/battleship/${gameId}/player/${player}`;
  }, [gameId, player]);

  const copyOpponentLink = async () => {
    if (!opponentClientUrl) return;
    try {
      await navigator.clipboard.writeText(opponentClientUrl);
      setActionError(null);
    } catch {
      setActionError('Не удалось скопировать ссылку');
    }
  };

  const onPlacementClick = (row: number, col: number) => {
    if (selectedLen === null || placementLoading) return;
    const cells = getShipCellsFromAnchor(row, col, selectedLen, vertical);
    if (!cells || !canPlaceShipClassic(placedShips, cells)) return;
    setPlacedShips((s) => [...s, cells]);
    setHoverPos(null);
    setSelectedLen(null);
    setActionError(null);
  };

  const undoLastShip = () => {
    setPlacedShips((s) => s.slice(0, -1));
    setActionError(null);
  };

  const randomFill = () => {
    try {
      setPlacedShips(generateRandomFleet());
      setSelectedLen(null);
      setHoverPos(null);
      setActionError(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Ошибка генерации');
    }
  };

  const clearFleet = () => {
    setPlacedShips([]);
    setSelectedLen(null);
    setHoverPos(null);
    setActionError(null);
  };

  const confirmPlacement = async () => {
    if (!gameId || !player || !fleetComplete) return;
    setPlacementLoading(true);
    setActionError(null);
    try {
      const next = await submitBattleshipPlacement(gameId, player, placedShips);
      setView(next);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Ошибка расстановки');
    } finally {
      setPlacementLoading(false);
    }
  };

  const onFire = async (row: number, col: number) => {
    if (!gameId || !player || !view?.isMyTurn || view.phase !== 'battle') return;
    setFireLoading(true);
    setActionError(null);
    try {
      const next = await battleshipFire(gameId, player, row, col);
      setView(next);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Ошибка выстрела');
      await refresh();
    } finally {
      setFireLoading(false);
    }
  };

  if (!gameId || player === null) {
    return (
      <main className="battleship-page">
        <p>Некорректная ссылка. Номер игрока должен быть 1 или 2.</p>
        <Link to="/battleship">К морскому бою</Link>
      </main>
    );
  }

  if (initialError && !view) {
    return (
      <main className="battleship-page">
        <p className="battleship-page__error">{initialError}</p>
        <button type="button" className="battleship-page__secondary" onClick={() => void refresh()}>
          Повторить
        </button>
        <div className="battleship-page__footer">
          <Link to="/">На главную</Link>
        </div>
      </main>
    );
  }

  const showPlacementUi = view && view.phase === 'placement' && !view.iHavePlaced;
  const showBattleBoards = view && (view.phase === 'battle' || view.phase === 'finished');

  return (
    <main className="battleship-page">
      <h1>
        Морской бой <span className="battleship-page__id">#{gameId.slice(0, 8)}</span>
      </h1>
      <p className="battleship-page__you">Вы — игрок {player}</p>

      {player === 1 && (
        <div className="battleship-page__share">
          <p className="battleship-page__share-label">Ссылка для игрока 2:</p>
          <code className="battleship-page__share-url">{opponentClientUrl}</code>
          <button type="button" className="battleship-page__secondary" onClick={() => void copyOpponentLink()}>
            Копировать
          </button>
        </div>
      )}

      {player === 2 && (
        <p className="battleship-page__hint">
          Ваша ссылка (можно сохранить): <code>{myPlayerClientUrl}</code>
        </p>
      )}

      <p className="battleship-page__status">{statusMessage(view)}</p>
      {actionError && <p className="battleship-page__error">{actionError}</p>}

      {showPlacementUi && (
        <section className="battleship-page__section battleship-page__placement">
          <p className="battleship-page__rules">
            Выберите размер корабля и направление, наведите курсор на клетку носа корабля и кликните, чтобы поставить.
            Корабли не должны соприкасаться (включая углы). Осталось расставить:{' '}
            <strong>{remaining.length}</strong> из 10.
          </p>

          <div className="battleship-page__toolbar">
            <div className="battleship-page__toolbar-row">
              <span className="battleship-page__toolbar-label">Корабль:</span>
              <div className="battleship-page__ship-buttons">
                {[4, 3, 2, 1].map((len) => {
                  const n = lengthCounts.get(len) ?? 0;
                  if (n === 0) return null;
                  const label =
                    len === 1 ? `1 × ${n}` : len === 2 ? `2 палубы × ${n}` : len === 3 ? `3 палубы × ${n}` : `4 палубы × ${n}`;
                  return (
                    <button
                      key={len}
                      type="button"
                      className={
                        selectedLen === len
                          ? 'battleship-page__chip battleship-page__chip--active'
                          : 'battleship-page__chip'
                      }
                      disabled={placementLoading}
                      onClick={() => {
                        setSelectedLen(len);
                        setActionError(null);
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="battleship-page__toolbar-row">
              <span className="battleship-page__toolbar-label">Направление:</span>
              <div className="battleship-page__ship-buttons">
                <button
                  type="button"
                  className={
                    !vertical ? 'battleship-page__chip battleship-page__chip--active' : 'battleship-page__chip'
                  }
                  disabled={placementLoading}
                  onClick={() => setVertical(false)}
                >
                  Горизонтально →
                </button>
                <button
                  type="button"
                  className={
                    vertical ? 'battleship-page__chip battleship-page__chip--active' : 'battleship-page__chip'
                  }
                  disabled={placementLoading}
                  onClick={() => setVertical(true)}
                >
                  Вертикально ↓
                </button>
              </div>
            </div>
          </div>

          {!selectedLen && remaining.length > 0 && (
            <p className="battleship-page__hint-inline">Сначала выберите корабль из списка выше.</p>
          )}

          <BattleshipBoard
            title="Ваше поле — расстановка"
            mode="place"
            grid={placementDisplayGrid}
            disabled={placementLoading}
            onCellHover={(r, c) => setHoverPos([r, c])}
            onCellHoverLeave={() => setHoverPos(null)}
            onCellClick={(r, c) => onPlacementClick(r, c)}
          />

          <div className="battleship-page__placement-actions">
            <button
              type="button"
              className="battleship-page__secondary"
              onClick={undoLastShip}
              disabled={placementLoading || placedShips.length === 0}
            >
              Отменить последний
            </button>
            <button type="button" className="battleship-page__secondary" onClick={clearFleet} disabled={placementLoading}>
              Очистить поле
            </button>
            <button type="button" className="battleship-page__secondary" onClick={randomFill} disabled={placementLoading}>
              Случайная расстановка
            </button>
            <button
              type="button"
              className="battleship-page__primary"
              onClick={() => void confirmPlacement()}
              disabled={placementLoading || !fleetComplete}
            >
              {placementLoading ? 'Отправка...' : 'Подтвердить расстановку'}
            </button>
          </div>
        </section>
      )}

      {view && view.iHavePlaced && view.phase === 'placement' && (
        <section className="battleship-page__section">
          <BattleshipBoard title="Ваше поле" mode="own" grid={view.myBoard} />
        </section>
      )}

      {showBattleBoards && view && (
        <section className="battleship-page__boards">
          <BattleshipBoard title="Ваше поле" mode="own" grid={view.myBoard} />
          <BattleshipBoard
            title="Поле соперника"
            mode="radar"
            grid={view.enemyBoard}
            onCellClick={(r, c) => void onFire(r, c)}
            disabled={fireLoading || !view.isMyTurn || view.phase !== 'battle'}
          />
        </section>
      )}

      <div className="battleship-page__footer">
        <Link to="/battleship">Новая игра</Link>
        <span className="battleship-page__footer-sep">·</span>
        <Link to="/">На главную</Link>
      </div>
    </main>
  );
}
