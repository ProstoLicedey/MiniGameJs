import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createGame } from '../api/gameApi';
import './HomePage.scss';

export function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startVsComputer = async () => {
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

  const startTwoPlayer = async () => {
    setLoading(true);
    setError(null);
    try {
      const { id } = await createGame({ mode: 'two_player' });
      navigate(`/local/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать игру');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home-page">
      <h1>Крестики-нолики</h1>
      <p className="home-page__intro">
        Выбери режим: против компьютера или два игрока за одним экраном (партия сохраняется на сервере).
      </p>
      {error && <p className="home-page__error">{error}</p>}
      <div className="home-page__modes">
        <button type="button" onClick={startVsComputer} disabled={loading}>
          {loading ? 'Создаем игру...' : 'Против компьютера'}
        </button>
        <button type="button" className="home-page__button-secondary" onClick={startTwoPlayer} disabled={loading}>
          Два игрока
        </button>
        <Link to="/battleship" className="home-page__link-battleship">
          Морской бой (два устройства)
        </Link>
      </div>
    </main>
  );
}
