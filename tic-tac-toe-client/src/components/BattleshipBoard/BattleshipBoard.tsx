import './BattleshipBoard.scss';

export type BattleshipBoardMode = 'own' | 'radar' | 'preview' | 'place';

export interface BattleshipBoardProps {
  title: string;
  mode: BattleshipBoardMode;
  /** Для place: 0 вода, 1 корабль, 2 призрак (можно), 3 призрак (нельзя) */
  grid: number[][];
  onCellClick?: (row: number, col: number) => void;
  /** Ручная расстановка: наведение для превью */
  onCellHover?: (row: number, col: number) => void;
  onCellHoverLeave?: () => void;
  disabled?: boolean;
}

function cellClass(mode: BattleshipBoardMode, value: number): string {
  if (mode === 'place') {
    switch (value) {
      case 1:
        return 'battleship-board__cell--ship-preview';
      case 2:
        return 'battleship-board__cell--ghost-ok';
      case 3:
        return 'battleship-board__cell--ghost-bad';
      default:
        return 'battleship-board__cell--water';
    }
  }
  if (mode === 'preview') {
    return value === 1 ? 'battleship-board__cell--ship-preview' : 'battleship-board__cell--water';
  }
  if (mode === 'own') {
    switch (value) {
      case 1:
        return 'battleship-board__cell--ship';
      case 2:
        return 'battleship-board__cell--hit';
      case 3:
        return 'battleship-board__cell--miss';
      default:
        return 'battleship-board__cell--water';
    }
  }
  switch (value) {
    case 1:
      return 'battleship-board__cell--radar-miss';
    case 2:
      return 'battleship-board__cell--radar-hit';
    default:
      return 'battleship-board__cell--fog';
  }
}

export function BattleshipBoard({
  title,
  mode,
  grid,
  onCellClick,
  onCellHover,
  onCellHoverLeave,
  disabled,
}: BattleshipBoardProps) {
  const isPlace = mode === 'place';

  return (
    <div className="battleship-board">
      <h2 className="battleship-board__title">{title}</h2>
      <div
        className="battleship-board__grid"
        role="grid"
        aria-label={title}
        onMouseLeave={isPlace ? () => onCellHoverLeave?.() : undefined}
      >
        {grid.map((row, r) =>
          row.map((value, c) => {
            const radarClickable =
              mode === 'radar' && value === 0 && onCellClick && !disabled;
            const placeClickable = isPlace && onCellClick && !disabled;

            const cls = [
              'battleship-board__cell',
              cellClass(mode, value),
              radarClickable || placeClickable ? 'battleship-board__cell--clickable' : '',
            ]
              .filter(Boolean)
              .join(' ');

            if (radarClickable) {
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  className={cls}
                  aria-label={`Выстрел ${r + 1}, ${c + 1}`}
                  disabled={!!disabled}
                  onClick={() => onCellClick(r, c)}
                />
              );
            }

            if (isPlace) {
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  className={cls}
                  aria-label={`Клетка ${r + 1}, ${c + 1}`}
                  disabled={!!disabled}
                  onMouseEnter={() => onCellHover?.(r, c)}
                  onClick={() => onCellClick?.(r, c)}
                />
              );
            }

            return <div key={`${r}-${c}`} className={cls} role="gridcell" />;
          }),
        )}
      </div>
    </div>
  );
}
