import React from 'react';
import type { CardInstance } from '../types';
import Card from './Card';
import './GameBoard.less';

interface GameBoardProps {
  cards: CardInstance[];
  onFlip: (instanceId: number) => void;
}

const GameBoard = React.memo(function GameBoard({ cards, onFlip }: GameBoardProps) {
  return (
    <div className="mc-board">
      {cards.map((card) => (
        <Card key={card.instanceId} card={card} onClick={onFlip} />
      ))}
    </div>
  );
});

export default GameBoard;
