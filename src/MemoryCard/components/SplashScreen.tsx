import React, { forwardRef } from 'react';
import posterImg from '../img/poster.png';
import './SplashScreen.less';

export interface SplashScreenProps {
  onDone: () => void;
}

const SplashScreen = React.memo(
  forwardRef<HTMLDivElement, SplashScreenProps>(function SplashScreen({ onDone }, ref) {
    return (
      <div className="mc-splash" ref={ref}>
        <img
          className="mc-splash__img"
          src={posterImg}
          alt="Memory Card"
          draggable={false}
          onAnimationEnd={onDone}
        />
      </div>
    );
  })
);

SplashScreen.displayName = 'SplashScreen';
export default SplashScreen;
