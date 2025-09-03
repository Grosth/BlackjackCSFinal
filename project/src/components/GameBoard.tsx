import React from 'react';
import { Card } from './Card';
import { GameState } from '../types/game';
import { calculateHandValue } from '../utils/cardUtils';

interface GameBoardProps {
  gameState: GameState;
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onNewGame: () => void;
  userChips: number;
  onBetChange: (bet: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onHit,
  onStand,
  onDouble,
  onNewGame,
  userChips,
  onBetChange
}) => {
  const dealerVisibleScore = gameState.gameStatus === 'playing' 
    ? calculateHandValue([gameState.dealerHand[0]])
    : gameState.dealerScore;

  const getStatusMessage = () => {
    switch (gameState.gameStatus) {
      case 'playerWon':
        return '¡Ganaste! 🎉';
      case 'dealerWon':
        return 'La casa gana 😔';
      case 'tie':
        return 'Empate 🤝';
      case 'waiting':
        return 'Haz tu apuesta para empezar';
      default:
        return 'Tu turno';
    }
  };

  const getStatusColor = () => {
    switch (gameState.gameStatus) {
      case 'playerWon':
        return 'text-green-400';
      case 'dealerWon':
        return 'text-red-400';
      case 'tie':
        return 'text-yellow-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-2xl p-6 shadow-2xl border-4 border-red-600">
      {/* Status Bar */}
      <div className="text-center mb-6">
        <h2 className={`text-3xl font-bold ${getStatusColor()}`}>
          {getStatusMessage()}
        </h2>
        <div className="flex justify-center items-center gap-6 mt-2 text-white">
          <span className="text-lg">Fichas: <span className="text-yellow-400 font-bold">${userChips}</span></span>
          <span className="text-lg">Apuesta: <span className="text-yellow-400 font-bold">${gameState.bet}</span></span>
        </div>
      </div>

      {/* Dealer Section */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Casa ({dealerVisibleScore})
          </h3>
          <div className="flex justify-center gap-2">
            {gameState.dealerHand.map((card, index) => (
              <Card
                key={index}
                card={card}
                faceDown={index === 1 && gameState.gameStatus === 'playing'}
                className="transform -rotate-1 hover:rotate-0 transition-transform"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Player Section */}
      <div className="mb-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Tú ({gameState.playerScore})
          </h3>
          <div className="flex justify-center gap-2">
            {gameState.playerHand.map((card, index) => (
              <Card
                key={index}
                card={card}
                className="transform rotate-1 hover:rotate-0 transition-transform"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bet Controls */}
      {gameState.gameStatus === 'waiting' && (
        <div className="text-center mb-6">
          <h4 className="text-white text-lg mb-4">Selecciona tu apuesta:</h4>
          <div className="flex justify-center gap-2 mb-4">
            {[10, 25, 50, 100].map(amount => (
              <button
                key={amount}
                onClick={() => onBetChange(amount)}
                disabled={amount > userChips}
                className={`px-6 py-3 rounded-full font-bold transition-all text-lg ${
                  amount <= userChips
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-black hover:scale-110 shadow-lg'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                } ${gameState.bet === amount ? 'ring-4 ring-yellow-300 scale-110' : ''}`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="flex justify-center gap-4">
        {gameState.gameStatus === 'waiting' ? (
          <button
            onClick={onNewGame}
            disabled={gameState.bet > userChips}
            className={`px-10 py-4 rounded-lg font-bold text-xl transition-all ${
              gameState.bet <= userChips
                ? 'bg-red-600 hover:bg-red-500 text-white hover:scale-105 shadow-lg'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Repartir Cartas
          </button>
        ) : gameState.gameStatus === 'playing' ? (
          <>
            <button
              onClick={onHit}
              disabled={!gameState.canHit}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                gameState.canHit
                  ? 'bg-white hover:bg-gray-100 text-black hover:scale-105 shadow-lg border-2 border-black'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              Pedir
            </button>
            <button
              onClick={onStand}
              disabled={!gameState.canStand}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                gameState.canStand
                  ? 'bg-red-600 hover:bg-red-500 text-white hover:scale-105 shadow-lg'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              Plantarse
            </button>
            <button
              onClick={onDouble}
              disabled={!gameState.canDouble || gameState.bet * 2 > userChips}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                gameState.canDouble && gameState.bet * 2 <= userChips
                  ? 'bg-yellow-600 hover:bg-yellow-500 text-black hover:scale-105 shadow-lg'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              Doblar
            </button>
          </>
        ) : (
          <button
            onClick={onNewGame}
            className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xl transition-all hover:scale-105 shadow-lg"
          >
            Nueva Partida
          </button>
        )}
      </div>
    </div>
  );
};