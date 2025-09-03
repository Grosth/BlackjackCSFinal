import React from 'react';
import { Card as CardType } from '../types/game';
import { getCardSymbol, getCardColor } from '../utils/cardUtils';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ card, faceDown = false, className = "" }) => {
  if (faceDown) {
    return (
      <div className={`w-20 h-28 bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-700 rounded-lg flex items-center justify-center shadow-lg ${className}`}>
        <div className="w-10 h-14 bg-red-600 rounded opacity-60"></div>
      </div>
    );
  }

  return (
    <div className={`w-20 h-28 bg-white border-2 border-black rounded-lg shadow-lg transition-transform hover:scale-105 relative ${className}`}>
      {/* Top left corner */}
      <div className="absolute top-1 left-1">
        <div className={`text-sm font-bold ${getCardColor(card.suit)}`}>
          {card.value}
        </div>
        <div className={`text-xs ${getCardColor(card.suit)}`}>
          {getCardSymbol(card.suit)}
        </div>
      </div>
      
      {/* Center symbol */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${getCardColor(card.suit)}`}>
        {getCardSymbol(card.suit)}
      </div>
      
      {/* Bottom right corner (rotated) */}
      <div className="absolute bottom-1 right-1 transform rotate-180">
        <div className={`text-sm font-bold ${getCardColor(card.suit)}`}>
          {card.value}
        </div>
        <div className={`text-xs ${getCardColor(card.suit)}`}>
          {getCardSymbol(card.suit)}
        </div>
      </div>
    </div>
  );
};