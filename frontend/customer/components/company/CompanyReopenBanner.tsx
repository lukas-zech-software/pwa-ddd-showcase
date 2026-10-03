import {
  createStyles,
  NoSsr,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                 from '@material-ui/core';
import clsx       from 'clsx';
import React      from 'react';
import { locale } from '../../common/locales';

const styles = (theme: Theme) => createStyles(
  {
    banner:    {
      padding:         `${theme.spacing(0.5)}px ${theme.spacing(8)}px`,
      color:           'white',
      fontSize:        '1.1rem',
      fontWeight:      500,
      transform:       'rotate(-45deg)',
      position:        'absolute',
      textAlign:       'center',
      backgroundColor: 'rgba(41, 110, 1, 0.7)',
    },
    deBanner:  {
      top:                            45,
      left:                           -66,
      [theme.breakpoints.down('sm')]: {
        top:      38,
        left:     -71,
        fontSize: '1rem',
      },

    },
    enBanner:  {
      top:                            37,
      left:                           -44,
      [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
      },

    },
    container: {
      position: 'relative',
    },
  },
);

type Props = { offersReopen: boolean | undefined } & WithStyles<typeof styles>;

const _CompanyReopenBanner: React.FC<Props> = ({ classes, offersReopen }) => !!offersReopen ? (
  <div className={classes.container}>
    <NoSsr>
      <Typography className={clsx(classes.banner, {
                                    [classes.deBanner]: locale.name === 'de',
                                    [classes.enBanner]: locale.name === 'en',
                                  },
      )}
                  variant="caption">
        {locale.restaurantView.offersReopenHeader}
      </Typography>
    </NoSsr>
  </div>
) : null;

export const CompanyReopenBanner = withStyles(styles)(_CompanyReopenBanner);
