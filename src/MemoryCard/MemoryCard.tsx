import React, { forwardRef, useState, useMemo } from 'react';
import type { MemoryCardProps } from './types';
import { useMemoryCard } from './hooks/useMemoryCard';
import { useLocale } from './i18n';
import GameBoard from './components/GameBoard';
import SplashScreen from './components/SplashScreen';
import guitaristImg from './img/guitarist.png';
import guitaristSideImg from './img/guitarist_side.png';
import coderImg from './img/coder.png';
import hackerImg from './img/hacker.png';
import ghostImg from './img/ghost.png';
import ghostSideImg from './img/ghost_side.png';
import './MemoryCard.less';

const CARD_DEFS = [
  { id: 'guitarist',      image: guitaristImg,     name: 'guitarist' },
  { id: 'coder',          image: coderImg,         name: 'coder' },
  { id: 'hacker',         image: hackerImg,        name: 'hacker' },
  { id: 'ghost',          image: ghostImg,         name: 'ghost' },
  { id: 'guitarist_side', image: guitaristSideImg, name: 'guitarist_side' },
  { id: 'ghost_side',     image: ghostSideImg,     name: 'ghost_side' },
];

const MemoryCard = React.memo(
  forwardRef<HTMLDivElement, MemoryCardProps>((_props, ref) => {
    const { t } = useLocale();
    const [showSplash, setShowSplash] = useState(true);

    const defs = useMemo(() => CARD_DEFS, []);
    const { cards, phase, moves, time, best, isNewRecord, matchedCount, totalPairs, startGame, resetGame, flipCard } =
      useMemoryCard(defs);

    const formatTime = (s: number) => `${s}${t('seconds')}`;

    return (
      <div className="mc" ref={ref}>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

        {/* Header */}
        {phase === 'playing' && (
          <div className="mc__header">
            <div className="mc__stat">
              <span className="mc__stat-label">{t('moves')}</span>
              <span className="mc__stat-value">{moves}</span>
            </div>
            <div className="mc__progress">
              {matchedCount} / {totalPairs}
            </div>
            <div className="mc__stat">
              <span className="mc__stat-label">{t('time')}</span>
              <span className="mc__stat-value">{formatTime(time)}</span>
            </div>
          </div>
        )}

        {/* Board */}
        {phase === 'playing' && (
          <div className="mc__board-wrap">
            <GameBoard cards={cards} onFlip={flipCard} />
          </div>
        )}

        {/* Start screen */}
        {phase === 'idle' && (
          <div className="mc__overlay">
            <div className="mc__modal">
              <div className="mc__modal-icon">🃏</div>
              <h1 className="mc__modal-title">{t('title')}</h1>
              <p className="mc__modal-sub">{t('subtitle')}</p>
              <div className="mc__modal-info">
                <span>{totalPairs} {t('pairs')} · 2×4</span>
              </div>
              {best && (
                <div className="mc__modal-best">
                  {t('best')}：{best.moves} {t('moves')} · {formatTime(best.time)}
                </div>
              )}
              <button className="mc__btn mc__btn--start" onClick={startGame}>
                {t('startBtn')}
              </button>
            </div>
          </div>
        )}

        {/* Win screen */}
        {phase === 'won' && (
          <div className="mc__overlay">
            <div className="mc__modal mc__modal--won">
              <div className="mc__modal-icon">🎉</div>
              <h2 className="mc__modal-title">{t('won')}</h2>
              {isNewRecord && <div className="mc__new-record">{t('newRecord')}</div>}
              <div className="mc__result">
                <div className="mc__result-row">
                  <span>{t('moves')}</span>
                  <strong>{moves}</strong>
                </div>
                <div className="mc__result-row">
                  <span>{t('time')}</span>
                  <strong>{formatTime(time)}</strong>
                </div>
                {best && (
                  <div className="mc__result-row mc__result-row--best">
                    <span>{t('best')}</span>
                    <strong>{best.moves} · {formatTime(best.time)}</strong>
                  </div>
                )}
              </div>
              <div className="mc__modal-actions">
                <button className="mc__btn mc__btn--start" onClick={startGame}>
                  {t('replayBtn')}
                </button>
                <button className="mc__btn mc__btn--back" onClick={resetGame}>
                  {t('homeBtn')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  })
);

MemoryCard.displayName = 'MemoryCard';
export default MemoryCard;
