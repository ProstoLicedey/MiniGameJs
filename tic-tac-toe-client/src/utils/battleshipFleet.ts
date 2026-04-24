import type { ShipCells } from '../types/battleship';

/** Классический флот: 1×4, 2×3, 3×2, 4×1 */
export const CLASSIC_SHIP_LENGTHS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1] as const;

export const BOARD_SIZE = 10;

/** Мультимножество оставшихся длин (копия для стейта). */
export function initialRemainingLengths(): number[] {
  return [...CLASSIC_SHIP_LENGTHS];
}

export function remainingLengthsAfterPlaced(placed: ShipCells[]): number[] {
  const need = initialRemainingLengths();
  for (const ship of placed) {
    const idx = need.indexOf(ship.length);
    if (idx === -1) return need;
    need.splice(idx, 1);
  }
  return need;
}

export function getShipCellsFromAnchor(
  row: number,
  col: number,
  length: number,
  vertical: boolean,
): ShipCells | null {
  const cells: ShipCells = [];
  for (let i = 0; i < length; i++) {
    const r = vertical ? row + i : row;
    const c = vertical ? col : col + i;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
      return null;
    }
    cells.push([r, c]);
  }
  return cells;
}

/** Не пересекаются и не соприкасаются по стороне и по диагонали с уже стоящими. */
export function canPlaceShipClassic(placed: ShipCells[], candidate: ShipCells): boolean {
  const occupied = new Set<string>();
  for (const ship of placed) {
    for (const [r, c] of ship) {
      occupied.add(`${r},${c}`);
    }
  }
  for (const [r, c] of candidate) {
    if (occupied.has(`${r},${c}`)) return false;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (occupied.has(`${r + dr},${c + dc}`)) return false;
      }
    }
  }
  return true;
}

export function buildPlacementDisplayGrid(
  placed: ShipCells[],
  ghost: ShipCells | null,
  ghostValid: boolean,
): number[][] {
  const g = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  for (const ship of placed) {
    for (const [r, c] of ship) {
      g[r][c] = 1;
    }
  }
  if (ghost) {
    if (ghostValid) {
      for (const [r, c] of ghost) {
        if (g[r][c] === 0) g[r][c] = 2;
      }
    } else {
      for (const [r, c] of ghost) {
        g[r][c] = 3;
      }
    }
  }
  return g;
}

function tryPlaceFleetRandom(): ShipCells[] | null {
  const ships: ShipCells[] = [];
  const lengths = [...CLASSIC_SHIP_LENGTHS].sort((a, b) => b - a);

  for (const len of lengths) {
    let placed = false;
    for (let attempt = 0; attempt < 600 && !placed; attempt++) {
      const vertical = Math.random() < 0.5;
      const r0 = Math.floor(Math.random() * BOARD_SIZE);
      const c0 = Math.floor(Math.random() * BOARD_SIZE);
      const cells = getShipCellsFromAnchor(r0, c0, len, vertical);
      if (cells && canPlaceShipClassic(ships, cells)) {
        ships.push(cells);
        placed = true;
      }
    }
    if (!placed) return null;
  }
  return ships;
}

/** Случайная расстановка по тем же классическим правилам, что на сервере. */
export function generateRandomFleet(): ShipCells[] {
  for (let i = 0; i < 120; i++) {
    const fleet = tryPlaceFleetRandom();
    if (fleet) return fleet;
  }
  throw new Error('Не удалось сгенерировать флот');
}

export function fleetToPreviewGrid(ships: ShipCells[]): number[][] {
  const grid = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  for (const ship of ships) {
    for (const [r, c] of ship) {
      grid[r][c] = 1;
    }
  }
  return grid;
}

/** Подсчёт оставшихся кораблей по длине для кнопок выбора. */
export function countByLength(remaining: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const L of remaining) {
    m.set(L, (m.get(L) ?? 0) + 1);
  }
  return m;
}
