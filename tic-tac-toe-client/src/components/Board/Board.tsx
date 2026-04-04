import type { Board as BoardType, CellValue } from '../../types/game';
import './Board.scss';

interface BoardProps {
  board: BoardType;
  disabled: boolean;
  onCellClick: (row: number, col: number) => void;
}

function renderCellValue(value: CellValue): string {
  if (value === 1) return 'X';
  if (value === 0) return 'O';
  return '';
}

export function Board({ board, disabled, onCellClick }: BoardProps) {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            type="button"
            key={`${rowIndex}-${colIndex}`}
            className="board__cell"
            disabled={disabled || cell !== null}
            onClick={() => onCellClick(rowIndex, colIndex)}
          >
            {renderCellValue(cell)}
          </button>
        )),
      )}
    </div>
  );
}
