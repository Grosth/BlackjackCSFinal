import { createDeck, calculateHandValue } from '../utils/cardUtils';
import { GameState, Card } from '../types/game';

export class GameService {
  static initializeGame(bet: number = 10): GameState {
    const deck = createDeck();
    const playerHand = [deck.pop()!, deck.pop()!];
    const dealerHand = [deck.pop()!, deck.pop()!];

    return {
      playerHand,
      dealerHand,
      deck,
      playerScore: calculateHandValue(playerHand),
      dealerScore: calculateHandValue([dealerHand[0]]), // Only first card visible
      gameStatus: 'playing',
      bet,
      canHit: true,
      canStand: true,
      canDouble: playerHand.length === 2
    };
  }

  static hit(gameState: GameState): GameState {
    if (!gameState.canHit) return gameState;

    const newCard = gameState.deck.pop()!;
    const newPlayerHand = [...gameState.playerHand, newCard];
    const newPlayerScore = calculateHandValue(newPlayerHand);

    let newGameStatus = gameState.gameStatus;
    let canHit = true;
    let canStand = true;
    let canDouble = false;

    if (newPlayerScore > 21) {
      newGameStatus = 'dealerWon';
      canHit = false;
      canStand = false;
    } else if (newPlayerScore === 21) {
      canHit = false;
    }

    return {
      ...gameState,
      playerHand: newPlayerHand,
      playerScore: newPlayerScore,
      gameStatus: newGameStatus,
      canHit,
      canStand,
      canDouble
    };
  }

  static stand(gameState: GameState): GameState {
    if (!gameState.canStand) return gameState;

    let dealerHand = [...gameState.dealerHand];
    let deck = [...gameState.deck];
    let dealerScore = calculateHandValue(dealerHand);

    // Dealer hits on 16 and below, stands on 17 and above
    while (dealerScore < 17) {
      const newCard = deck.pop()!;
      dealerHand.push(newCard);
      dealerScore = calculateHandValue(dealerHand);
    }

    let gameStatus: GameState['gameStatus'];
    if (dealerScore > 21) {
      gameStatus = 'playerWon';
    } else if (dealerScore > gameState.playerScore) {
      gameStatus = 'dealerWon';
    } else if (dealerScore < gameState.playerScore) {
      gameStatus = 'playerWon';
    } else {
      gameStatus = 'tie';
    }

    return {
      ...gameState,
      dealerHand,
      dealerScore,
      deck,
      gameStatus,
      canHit: false,
      canStand: false,
      canDouble: false
    };
  }

  static double(gameState: GameState): GameState {
    if (!gameState.canDouble) return gameState;

    // Hit once and then stand
    const hitResult = this.hit({
      ...gameState,
      bet: gameState.bet * 2,
      canDouble: false
    });

    if (hitResult.gameStatus === 'playing') {
      return this.stand(hitResult);
    }

    return {
      ...hitResult,
      bet: gameState.bet * 2
    };
  }
}