import { Card } from '../types/game';

export const createDeck = (): Card[] => {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values: Card['value'][] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  suits.forEach(suit => {
    values.forEach(value => {
      let numericValue: number;
      if (value === 'A') {
        numericValue = 11; // Will be adjusted for aces later
      } else if (['J', 'Q', 'K'].includes(value)) {
        numericValue = 10;
      } else {
        numericValue = parseInt(value);
      }

      deck.push({ suit, value, numericValue });
    });
  });

  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateHandValue = (hand: Card[]): number => {
  let value = 0;
  let aces = 0;

  hand.forEach(card => {
    if (card.value === 'A') {
      aces++;
      value += 11;
    } else {
      value += card.numericValue;
    }
  });

  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
};

export const getCardSymbol = (suit: Card['suit']): string => {
  const symbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };
  return symbols[suit];
};

export const getCardColor = (suit: Card['suit']): string => {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
};