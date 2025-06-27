/* eslint-disable */
import { CardMedia }         from '@material-ui/core/CardMedia';
import { CardMediaClassKey } from '@material-ui/core/CardMediaCardMedia';
import * as React            from 'react';

declare module '@material-ui/core' {
  export interface CardMediaTypeMap<P, D extends React.ElementType> {
    props: P & {
      image?: string;
      src?: string;
      component?: string;
      alt?: string;
    };
    defaultComponent: D;
    classKey: CardMediaClassKey;
  }
}
