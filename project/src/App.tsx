import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { GameBoard } from './components/GameBoard';
import { Stats } from './components/Stats';
import { useAuth } from './hooks/useAuth';
import { GameService } from './services/gameService';
import { GameState } from './types/game';
import { LogOut, BarChart3 } from 'lucide-react';

function App() {
  const { user, loading, error, login, register, logout, updateUser, saveGameRecord } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [gameState, setGameState] = useState<GameState>(() => 
    GameService.initializeGame(10)
  );
  const [showStats, setShowStats] = useState(false);

  const handleAuth = (email: string, password: string, username?: string) => {
    if (isLogin) {
      login(email, password);
    } else {
      register(email, password, username!);
    }
  };

  const handleGameEnd = (result: 'win' | 'loss' | 'tie') => {
    if (!user) return;

    // Save game record to database
    saveGameRecord(gameState.bet, result, gameState.playerScore, gameState.dealerScore);

    let chipsChange = 0;
    let wins = user.wins;
    let losses = user.losses;
    let ties = user.ties;

    switch (result) {
      case 'win':
        chipsChange = gameState.bet;
        wins += 1;
        break;
      case 'loss':
        chipsChange = -gameState.bet;
        losses += 1;
        break;
      case 'tie':
        ties += 1;
        break;
    }

    const updatedUser = {
      ...user,
      chips: Math.max(0, user.chips + chipsChange),
      wins,
      losses,
      ties
    };

    updateUser(updatedUser);
  };

  const handleHit = () => {
    const newState = GameService.hit(gameState);
    setGameState(newState);
    
    if (newState.gameStatus === 'dealerWon') {
      handleGameEnd('loss');
    }
  };

  const handleStand = () => {
    const newState = GameService.stand(gameState);
    setGameState(newState);
    
    if (newState.gameStatus === 'playerWon') {
      handleGameEnd('win');
    } else if (newState.gameStatus === 'dealerWon') {
      handleGameEnd('loss');
    } else if (newState.gameStatus === 'tie') {
      handleGameEnd('tie');
    }
  };

  const handleDouble = () => {
    const newState = GameService.double(gameState);
    setGameState(newState);
    
    if (newState.gameStatus === 'playerWon') {
      handleGameEnd('win');
    } else if (newState.gameStatus === 'dealerWon') {
      handleGameEnd('loss');
    } else if (newState.gameStatus === 'tie') {
      handleGameEnd('tie');
    }
  };

  const handleNewGame = () => {
    if (gameState.gameStatus === 'waiting') {
      // Start new game with current bet
      setGameState(GameService.initializeGame(gameState.bet));
    } else {
      // Reset to waiting state
      setGameState({
        ...GameService.initializeGame(10),
        gameStatus: 'waiting'
      });
    }
  };

  const handleBetChange = (bet: number) => {
    setGameState({
      ...gameState,
      bet
    });
  };

  // Initialize game state when user logs in
  useEffect(() => {
    if (user) {
      setGameState({
        ...GameService.initializeGame(10),
        gameStatus: 'waiting'
      });
    }
  }, [user]);

  if (!user) {
    return (
      <AuthForm
        isLogin={isLogin}
        onSubmit={handleAuth}
        onToggle={() => setIsLogin(!isLogin)}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <div className="text-white">
          <h1 className="text-4xl font-bold text-red-500">BlackJack Casino</h1>
          <p className="text-xl">¡Bienvenido, <span className="text-yellow-400 font-semibold">{user.username}</span>!</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowStats(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-lg transition-all hover:scale-105 font-semibold border-2 border-black"
          >
            <BarChart3 className="w-5 h-5" />
            Estadísticas
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all hover:scale-105 font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Salir
          </button>
        </div>
      </div>

      {/* Game Board */}
      <GameBoard
        gameState={gameState}
        onHit={handleHit}
        onStand={handleStand}
        onDouble={handleDouble}
        onNewGame={handleNewGame}
        userChips={user.chips}
        onBetChange={handleBetChange}
      />

      {/* Low chips warning */}
      {user.chips < 10 && (
        <div className="text-center mt-6">
          <div className="bg-white border-4 border-red-600 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600 font-bold text-lg">
              ¡Te estás quedando sin fichas! 
            </p>
            <p className="text-black text-sm mt-2">
              En una aplicación real, aquí podrías comprar más fichas.
            </p>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && (
        <Stats
          user={user}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
}

export default App;