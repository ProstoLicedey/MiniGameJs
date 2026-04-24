import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { LocalGamePage } from './pages/LocalGamePage';
import { BattleshipGamePage, BattleshipLobbyPage } from './pages/BattleshipPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/local/:gameId" element={<LocalGamePage />} />
      <Route path="/game/:gameId" element={<GamePage />} />
      <Route path="/battleship" element={<BattleshipLobbyPage />} />
      <Route path="/battleship/:gameId/player/:playerId" element={<BattleshipGamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
