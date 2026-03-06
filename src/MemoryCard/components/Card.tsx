import React from 'react';
import type { CardInstance } from '../types';
import './Card.less';

interface CardProps {
  card: CardInstance;
  onClick: (instanceId: number) => void;
}

const Card = React.memo(function Card({ card, onClick }: CardProps) {
  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) onClick(card.instanceId);
  };

  return (
    <div
      className={`mc-card ${card.isFlipped || card.isMatched ? 'mc-card--flipped' : ''} ${card.isMatched ? 'mc-card--matched' : ''}`}
      onClick={handleClick}
    >
      <div className="mc-card__inner">
        <div className="mc-card__back">
          <div className="mc-card__back-pattern" />
          <span className="mc-card__back-logo">Aigram</span>
        </div>
        <div className="mc-card__front">
          <img
            src={card.def.image}
            alt={card.def.name}
            className="mc-card__img"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
});

export default Card;
