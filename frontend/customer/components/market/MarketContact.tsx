import {
  makeStyles,
  Typography,
}                     from '@material-ui/core';
import { IApiMarket } from '@my-old-startup/common/interfaces/IApiMarket';
import clsx           from 'clsx';
import * as React     from 'react';

const useStyles = makeStyles(() => (
  {
    iconGridItem:      {
      'color': 'red',
      '& > *': {
        paddingTop: 0,
      },
    },
    marketContactLine: {
      fontStyle: 'italic',
      '&.first': {
        paddingTop: 0,
      },
    },
  }
));

type Props = { market: IApiMarket };

const _MarketContact: React.SFC<Props> = (props: Props) => {
  const { market } = props;
  const classes    = useStyles();

  return (
    <>
      <Typography variant="caption" className={clsx(classes.marketContactLine, 'first')}>
        {market.address}
      </Typography>
    </>
  );
};

export const MarketContact = (_MarketContact);
