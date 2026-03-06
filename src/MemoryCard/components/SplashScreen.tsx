import React, { forwardRef } from 'react';
import guitaristImg from '../img/guitarist.png';
import coderImg from '../img/coder.png';
import hackerImg from '../img/hacker.png';
import ghostImg from '../img/ghost.png';
import './SplashScreen.less';

export interface SplashScreenProps {
  onDone: () => void;
}

const CHARS = [guitaristImg, coderImg, hackerImg, ghostImg];

const SplashScreen = React.memo(
  forwardRef<HTMLDivElement, SplashScreenProps>(function SplashScreen({ onDone }, ref) {
    return (
      <div className="mc-splash" ref={ref} onAnimationEnd={onDone}>
        <div className="mc-splash__card">
          {/* Title */}
          <div className="mc-splash__title">
            <span className="mc-splash__title-word">FLIP</span>
            <span className="mc-splash__title-amp">&amp;</span>
            <span className="mc-splash__title-word">MATCH</span>
          </div>

          {/* Character grid */}
          <div className="mc-splash__chars">
            {CHARS.map((src, i) => (
              <div key={i} className="mc-splash__char">
                <img src={src} alt="" draggable={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  })
);

SplashScreen.displayName = 'SplashScreen';
export default SplashScreen;
