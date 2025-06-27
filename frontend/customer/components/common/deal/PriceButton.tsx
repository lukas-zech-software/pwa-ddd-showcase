import {
  createStyles,
  makeStyles,
  Theme,
}                   from '@material-ui/core';
import { Star }     from '@material-ui/icons';
import { IApiDeal } from '@my-old-startup/common/interfaces/IApiDeal';
import * as React   from 'react';
import { locale }   from '../../../common/locales';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        button: {
          color:           theme.palette.text.primary,
          lineHeight:      2,
          borderRadius:    theme.spacing(.5),
          letterSpacing:   '0.02857em',
          textTransform:   'uppercase',
          cursor:          'default',
          position:        'relative',
          top:             theme.spacing(1),
          right:           5,
          marginTop:       0,
          paddingBottom:   0,
          paddingTop:      1,
          paddingRight:    6,
          paddingLeft:     11,
          fontSize:        '1.05rem',
          fontWeight:      'bold',
          backgroundColor: '#fff',
          boxShadow:       '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14)',
        },
        star:   {
          top:      4,
          position: 'relative',
          left:     -2,
        },
      }));

type Props = {
  value: number;
};

export const PriceButton: React.SFC<Props> = (props: Props) => {
  const classes = useStyles();

  const { value } = props;
  return (
    <div className={classes.button} onClick={(e: any) => e.preventDefault()}>
      {locale.format.currency(value)} &euro;
    </div>
  );
};

export const DiscountButton: React.SFC = () => {
  const classes = useStyles();

  return (
    <div className={classes.button} onClick={(e: any) => e.preventDefault()}>
      <Star  className={classes.star}/>
    </div>
  );
};



export const SpecialButton: React.SFC = () => {
  const classes = useStyles();

  return (
    <div className={classes.button} onClick={(e: any) => e.preventDefault()}>
      SPECIAL
    </div>
  );
};

