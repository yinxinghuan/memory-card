import React, { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import posterImg from '../img/poster.png';

import guitaristImg from '../img/guitarist.png';
import guitaristHappyImg from '../img/guitarist_happy.png';
import guitaristSadImg from '../img/guitarist_sad.png';
import guitaristShyImg from '../img/guitarist_shy.png';
import guitaristSurprisedImg from '../img/guitarist_surprised.png';
import coderImg from '../img/coder.png';
import coderHappyImg from '../img/coder_happy.png';
import coderSadImg from '../img/coder_sad.png';
import coderShyImg from '../img/coder_shy.png';
import coderSurprisedImg from '../img/coder_surprised.png';
import hackerImg from '../img/hacker.png';
import hackerHappyImg from '../img/hacker_happy.png';
import hackerSadImg from '../img/hacker_sad.png';
import hackerShyImg from '../img/hacker_shy.png';
import hackerSurprisedImg from '../img/hacker_surprised.png';
import ghostImg from '../img/ghost.png';
import ghostHappyImg from '../img/ghost_happy.png';
import ghostSadImg from '../img/ghost_sad.png';
import ghostShyImg from '../img/ghost_shy.png';
import ghostSurprisedImg from '../img/ghost_surprised.png';
import aigramLogo from '../img/aigram.svg';

import './SplashScreen.less';

const GAME_IMAGES: string[] = [
  guitaristImg, guitaristHappyImg, guitaristSadImg, guitaristShyImg, guitaristSurprisedImg,
  coderImg, coderHappyImg, coderSadImg, coderShyImg, coderSurprisedImg,
  hackerImg, hackerHappyImg, hackerSadImg, hackerShyImg, hackerSurprisedImg,
  ghostImg, ghostHappyImg, ghostSadImg, ghostShyImg, ghostSurprisedImg,
  aigramLogo,
];

const MIN_MS = 2200;
const MAX_ASSET_MS = 10000;

export interface SplashScreenProps {
  onDone: () => void;
}

const SplashScreen = React.memo(
  forwardRef<HTMLDivElement, SplashScreenProps>(function SplashScreen({ onDone }, ref) {
    const [posterReady, setPosterReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fading, setFading] = useState(false);
    const [minDone, setMinDone] = useState(false);
    const [assetsDone, setAssetsDone] = useState(false);
    const doneCalledRef = useRef(false);

    // Min timer — starts when poster is ready
    useEffect(() => {
      if (!posterReady) return;
      const timer = setTimeout(() => setMinDone(true), MIN_MS);
      return () => clearTimeout(timer);
    }, [posterReady]);

    // Preload game images — starts when poster is ready
    useEffect(() => {
      if (!posterReady) return;

      const total = GAME_IMAGES.length;
      let loaded = 0;

      // Safety timeout
      const timeout = setTimeout(() => setAssetsDone(true), MAX_ASSET_MS);

      GAME_IMAGES.forEach((src) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded += 1;
          setProgress(loaded / total);
          if (loaded === total) {
            clearTimeout(timeout);
            setAssetsDone(true);
          }
        };
        img.src = src;
      });

      return () => clearTimeout(timeout);
    }, [posterReady]);

    // Fade out when both conditions are met
    const triggerFade = useCallback(() => {
      if (doneCalledRef.current) return;
      doneCalledRef.current = true;
      setFading(true);
      setTimeout(onDone, 500);
    }, [onDone]);

    useEffect(() => {
      if (minDone && assetsDone) triggerFade();
    }, [minDone, assetsDone, triggerFade]);

    return (
      <div className={`mc-splash${fading ? ' mc-splash--fading' : ''}`} ref={ref}>
        <img
          className={`mc-splash__img${posterReady ? ' mc-splash__img--visible' : ''}`}
          src={posterImg}
          alt="Flip & Match"
          draggable={false}
          onLoad={() => setPosterReady(true)}
        />
        <div className="mc-splash__bar-track">
          <div
            className="mc-splash__bar-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    );
  })
);

SplashScreen.displayName = 'SplashScreen';
export default SplashScreen;
