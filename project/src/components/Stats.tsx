import React from 'react';
import { Trophy, TrendingUp, Target, DollarSign } from 'lucide-react';
import { User } from '../types/game';

interface StatsProps {
  user: User;
  onClose: () => void;
}

export const Stats: React.FC<StatsProps> = ({ user, onClose }) => {
  const totalGames = user.wins + user.losses + user.ties;
  const winRate = totalGames > 0 ? Math.round((user.wins / totalGames) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-red-600 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-black mb-2">Estadísticas</h2>
          <p className="text-red-600 font-semibold text-lg">{user.username}</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-black rounded-lg border-2 border-gray-300">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">Fichas</span>
            </div>
            <span className="text-yellow-400 font-bold text-xl">${user.chips}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-black rounded-lg border-2 border-gray-300">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-white" />
              <span className="text-white font-semibold">Partidas Ganadas</span>
            </div>
            <span className="text-white font-bold text-xl">{user.wins}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-black rounded-lg border-2 border-gray-300">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-red-400" />
              <span className="text-white font-semibold">Partidas Perdidas</span>
            </div>
            <span className="text-red-400 font-bold text-xl">{user.losses}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-black rounded-lg border-2 border-gray-300">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-white" />
              <span className="text-white font-semibold">Tasa de Victoria</span>
            </div>
            <span className="text-white font-bold text-xl">{winRate}%</span>
          </div>

          <div className="text-center text-black text-sm font-medium">
            Total de partidas: {totalGames} | Empates: {user.ties}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-4 rounded-lg transition-all transform hover:scale-105 text-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};