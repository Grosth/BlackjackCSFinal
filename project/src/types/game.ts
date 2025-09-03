export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
  numericValue: number;
}

export interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  deck: Card[];
  playerScore: number;
  dealerScore: number;
  gameStatus: 'waiting' | 'playing' | 'playerWon' | 'dealerWon' | 'tie';
  bet: number;
  canHit: boolean;
  canStand: boolean;
  canDouble: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  chips: number;
  wins: number;
  losses: number;
  ties: number;
  created_at: string;
}

export interface GameRecord {
  id: string;
  user_id: string;
  bet_amount: number;
  result: 'win' | 'loss' | 'tie';
  player_score: number;
  dealer_score: number;
  created_at: string;
}