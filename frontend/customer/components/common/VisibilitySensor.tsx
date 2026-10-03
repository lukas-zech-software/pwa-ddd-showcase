import React                 from 'react';
import ReactVisibilitySensor from 'react-visibility-sensor';

type Props = {
  onChange?: (isVisible: boolean) => void;
  scrollThrottle?:number;
  partialVisibility?: boolean;
  active?: boolean;
  delayedCall?: boolean;
};

/**
 * Pass default visibility logic to ReactVisibilitySensor
 * @param children - the elements to be tracked
 * @param props - other props to be passed on to ReactVisibilitySensor
 * @constructor
 */
export const VisibilitySensor: React.FC<Props> = ({ children, ...props }) => (
  <ReactVisibilitySensor intervalCheck={false}
                         scrollCheck
                         scrollDelay={500}
                         {...props}
  >
    {children}
  </ReactVisibilitySensor>
);
