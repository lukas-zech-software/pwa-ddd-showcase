import * as React from 'react';


type Props = { center?: boolean };

export function SplashScreen(props: Props) {

  return (
    <div id="splash--root" className="splash--background">
      <div
        className="splash--loading MuiCircularProgress-root MuiCircularProgress-colorPrimary MuiCircularProgress-indeterminate"
        role="progressbar">
        <svg className="MuiCircularProgress-svg" viewBox="22 22 44 44">
          <circle className="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate" cx="44" cy="44"
                  r="20.2" fill="none" strokeWidth="3.6"/>
        </svg>
      </div>
    </div>
  );
}
