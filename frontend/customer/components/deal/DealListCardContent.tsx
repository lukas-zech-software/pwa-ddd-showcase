import {
  createStyles,
  Grid,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                         from '@material-ui/core';
import { DirectionsWalk } from '@material-ui/icons';

import { IApiCompany } from '@my-old-startup/common/interfaces';
import * as React      from 'react';
import { getDistance } from '../../utils/mapUtils';

const styles = (theme: Theme) => createStyles(
  {
    address:  {
      fontStyle:     'italic',
      paddingBottom: theme.spacing(0.5),
    },
    header:   {
      lineHeight: 1,
    },
    walkIcon: {
      top:      1,
      position: 'relative',
      fontSize: '0.75rem',
    },
  },
);

type Props = {
  company: IApiCompany;
  distance: number;
  address?: string | undefined;
} & WithStyles<typeof styles>;

function _DealListCardContent(props: Props): JSX.Element {
  const { classes, company, distance, address } = props;

  let addressText = address;
  if (distance !== 0) {
    addressText = `${address}, ${getDistance(distance)}`;
  }

  return (
    <Grid container alignItems="center" spacing={0}>
      <Grid item xs={11}>
        <Typography variant="h6" component={'h2' as any} className={classes.header}>
          {company.contact.title}
        </Typography>
      </Grid>

      {address && (
        <Grid item xs={12}>
          <Typography variant="caption" className={classes.address}>
            {addressText}
            {distance !== 0 && <DirectionsWalk className={classes.walkIcon}/>}
          </Typography>
        </Grid>
      )}

    </Grid>
  );
}

export const DealListCardContent = withStyles(styles)(_DealListCardContent);
