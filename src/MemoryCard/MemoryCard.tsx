import React, { forwardRef, useState } from 'react';
import type { MemoryCardProps } from './types';
import { useMemoryCard } from './hooks/useMemoryCard';
import { useLocale } from './i18n';
import GameBoard from './components/GameBoard';
import SplashScreen from './components/SplashScreen';
import guitaristImg from './img/guitarist.png';
import guitaristHappyImg from './img/guitarist_happy.png';
import guitaristSadImg from './img/guitarist_sad.png';
import guitaristShyImg from './img/guitarist_shy.png';
import guitaristSurprisedImg from './img/guitarist_surprised.png';
import coderImg from './img/coder.png';
import coderHappyImg from './img/coder_happy.png';
import coderSadImg from './img/coder_sad.png';
import coderShyImg from './img/coder_shy.png';
import coderSurprisedImg from './img/coder_surprised.png';
import hackerImg from './img/hacker.png';
import hackerHappyImg from './img/hacker_happy.png';
import hackerSadImg from './img/hacker_sad.png';
import hackerShyImg from './img/hacker_shy.png';
import hackerSurprisedImg from './img/hacker_surprised.png';
import ghostImg from './img/ghost.png';
import ghostHappyImg from './img/ghost_happy.png';
import ghostSadImg from './img/ghost_sad.png';
import ghostShyImg from './img/ghost_shy.png';
import ghostSurprisedImg from './img/ghost_surprised.png';
import aigramLogo from './img/aigram.svg';
import './MemoryCard.less';

// Full pool of 20 cards — 6 are randomly selected each game
const CARD_POOL = [
  { id: 'guitarist',           image: guitaristImg,          name: 'guitarist' },
  { id: 'guitarist_happy',     image: guitaristHappyImg,     name: 'guitarist_happy' },
  { id: 'guitarist_sad',       image: guitaristSadImg,       name: 'guitarist_sad' },
  { id: 'guitarist_shy',       image: guitaristShyImg,       name: 'guitarist_shy' },
  { id: 'guitarist_surprised', image: guitaristSurprisedImg, name: 'guitarist_surprised' },
  { id: 'coder',               image: coderImg,              name: 'coder' },
  { id: 'coder_happy',         image: coderHappyImg,         name: 'coder_happy' },
  { id: 'coder_sad',           image: coderSadImg,           name: 'coder_sad' },
  { id: 'coder_shy',           image: coderShyImg,           name: 'coder_shy' },
  { id: 'coder_surprised',     image: coderSurprisedImg,     name: 'coder_surprised' },
  { id: 'hacker',              image: hackerImg,             name: 'hacker' },
  { id: 'hacker_happy',        image: hackerHappyImg,        name: 'hacker_happy' },
  { id: 'hacker_sad',          image: hackerSadImg,          name: 'hacker_sad' },
  { id: 'hacker_shy',          image: hackerShyImg,          name: 'hacker_shy' },
  { id: 'hacker_surprised',    image: hackerSurprisedImg,    name: 'hacker_surprised' },
  { id: 'ghost',               image: ghostImg,              name: 'ghost' },
  { id: 'ghost_happy',         image: ghostHappyImg,         name: 'ghost_happy' },
  { id: 'ghost_sad',           image: ghostSadImg,           name: 'ghost_sad' },
  { id: 'ghost_shy',           image: ghostShyImg,           name: 'ghost_shy' },
  { id: 'ghost_surprised',     image: ghostSurprisedImg,     name: 'ghost_surprised' },
];

// Character previews shown on start screen
const PREVIEW_CHARS = [guitaristImg, coderImg, hackerImg, ghostImg];

const MemoryCard = React.memo(
  forwardRef<HTMLDivElement, MemoryCardProps>((_props, ref) => {
    const { t } = useLocale();
    const [showSplash, setShowSplash] = useState(true);

    const { cards, phase, moves, time, best, isNewRecord, matchedCount, totalPairs, startGame, resetGame, flipCard } =
      useMemoryCard(CARD_POOL, 6);

    const formatTime = (s: number) => `${s}${t('seconds')}`;

    return (
      <div className="mc" ref={ref}>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

        <img className="mc__watermark" src={aigramLogo} alt="Aigram" draggable={false} />

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
              {/* Title — always English */}
              <div className="mc__modal-hero">
                <h1 className="mc__modal-title">
                  <span className="mc__modal-title-line">FLIP</span>
                  <span className="mc__modal-title-amp">&</span>
                  <span className="mc__modal-title-line">MATCH</span>
                </h1>
              </div>

              {/* Character preview */}
              <div className="mc__modal-chars">
                {PREVIEW_CHARS.map((img, i) => (
                  <div key={i} className="mc__modal-char">
                    <img src={img} alt="" draggable={false} />
                  </div>
                ))}
              </div>

              {/* Rules */}
              <p className="mc__modal-rule">{t('rule')}</p>

              {best && (
                <div className="mc__modal-best">
                  {t('best')}：{best.moves} {t('moves')} · {formatTime(best.time)}
                </div>
              )}

              <button
                className="mc__btn mc__btn--start"
                onClick={startGame}
              >
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
              <h2 className="mc__modal-title mc__modal-title--won">{t('won')}</h2>
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
