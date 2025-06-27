import { createStyles, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
import { RawHtml }                                                 from '@my-old-startup/frontend-common/components';
import React                                                       from 'react';
import { locale }                                                  from '../../../common/locales';

const styles = (theme: Theme) => createStyles(
  {
    banner: {
      padding:                        `${theme.spacing(0.5)}px ${theme.spacing(8)}px`,
      color:                          'white',
      backgroundColor:                'transparent',
      [theme.breakpoints.down('sm')]: {
        lineHeight: '0.75rem',
      },
    },
  },
);

type Props = WithStyles<typeof styles>;

const _ReservationRequiredBanner: React.FC<Props> = ({ classes }) => (
  <Typography className={classes.banner}
              variant="caption"
  >
    <RawHtml>{locale.deal.reservationRequiredHtml}</RawHtml>
  </Typography>
);

export const ReservationRequiredBanner = withStyles(styles)(_ReservationRequiredBanner);
