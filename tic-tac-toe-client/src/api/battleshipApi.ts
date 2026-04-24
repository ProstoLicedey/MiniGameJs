import type {
  BattleshipCreateResponse,
  BattleshipPlayerView,
  ShipCells,
} from '../types/battleship';

function battleshipBaseUrl(): string {
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/battleship`;
}

async function parseError(response: Response): Promise<string> {
  if (response.status === 502) {
    return 'Сервер недоступен (502). Проверь, что API запущен и VITE_API_URL верный.';
  }
  try {
    const data = await response.json();
    if (typeof data?.message === 'string') {
      return data.message;
    }
    if (Array.isArray(data?.message)) {
      return data.message.join(', ');
    }
  } catch {
    // ignore
  }
  return `HTTP ${response.status}`;
}

export async function createBattleshipGame(): Promise<BattleshipCreateResponse> {
  const response = await fetch(battleshipBaseUrl());
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<BattleshipCreateResponse>;
}

export async function getBattleshipPlayerView(
  gameId: string,
  player: 1 | 2,
): Promise<BattleshipPlayerView> {
  const response = await fetch(`${battleshipBaseUrl()}/${gameId}/player/${player}`);
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<BattleshipPlayerView>;
}

export async function submitBattleshipPlacement(
  gameId: string,
  player: 1 | 2,
  ships: ShipCells[],
): Promise<BattleshipPlayerView> {
  const response = await fetch(`${battleshipBaseUrl()}/${gameId}/player/${player}/placement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ships }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<BattleshipPlayerView>;
}

export async function battleshipFire(
  gameId: string,
  player: 1 | 2,
  row: number,
  col: number,
): Promise<BattleshipPlayerView> {
  const response = await fetch(`${battleshipBaseUrl()}/${gameId}/player/${player}/fire`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ row, col }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<BattleshipPlayerView>;
}
