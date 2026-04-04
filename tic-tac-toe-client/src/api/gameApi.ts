import type { Board, CreateGameResponse, GameDto, GameMode } from '../types/game';

function gameBaseUrl(): string {
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/game`;
}

async function parseError(response: Response): Promise<string> {
  if (response.status === 502) {
    return 'Прокси/шлюз вернул 502. Проверь, что Nest запущен и VITE_API_URL в .env.development совпадает с PORT API.';
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
    // ignore parse issues and fallback to generic message
  }
  return `HTTP ${response.status}`;
}

export async function createGame(options?: { mode?: GameMode }): Promise<CreateGameResponse> {
  const query = options?.mode === 'two_player' ? '?mode=two_player' : '';
  const response = await fetch(`${gameBaseUrl()}${query}`);
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<CreateGameResponse>;
}

export async function makeMove(id: string, board: Board): Promise<GameDto> {
  const response = await fetch(`${gameBaseUrl()}/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(board),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<GameDto>;
}

export async function getGame(id: string): Promise<GameDto> {
  const response = await fetch(`${gameBaseUrl()}/${id}`);
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<GameDto>;
}
