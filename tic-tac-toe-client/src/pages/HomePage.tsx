import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../api/gameApi';
import './HomePage.scss';

export function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const { id } = await createGame();
      navigate(`/game/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать игру');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home-page">
      <h1>Крестики-нолики</h1>
      <p>Ты играешь за X, компьютер играет за O.</p>
      {error && <p className="home-page__error">{error}</p>}
      <button type="button" onClick={startGame} disabled={loading}>
        {loading ? 'Создаем игру...' : 'Начать новую игру'}
      </button>
    </main>
  );
}
