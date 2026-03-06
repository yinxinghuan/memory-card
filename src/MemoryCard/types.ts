export interface CardDef {
  id: string;
  image: string;
  name: string;
}

export interface CardInstance {
  instanceId: number;
  def: CardDef;
  isFlipped: boolean;
  isMatched: boolean;
}

export type GamePhase = 'idle' | 'playing' | 'won';

export interface MemoryCardProps {
  onScore?: (score: number) => void;
  onGameStart?: () => void;
  onGameEnd?: (score: number) => void;
}
