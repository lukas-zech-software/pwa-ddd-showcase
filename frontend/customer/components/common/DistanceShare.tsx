import {
  createStyles,
  Grid,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                           from '@material-ui/core';
import clsx                 from 'clsx';
import * as React           from 'react';
import { getDistance }      from '../../utils/mapUtils';
import { MultiPhoneButton } from './PhoneButton';

const styles = (theme: Theme) => createStyles(
  {
    alignRight: {
      textAlign: 'right',
    },
    flexEnd:    {
      'display':        'flex',
      'alignSelf':      'flex-end',
      'justifyContent': 'flex-end',
      '& > *':          {
        // share icons
        bottom: -8,
      },
    },
    content:    {
      alignSelf: 'flex-end',
    },
    flexEndMd:  {
      marginTop:                      theme.spacing(-2),
      [theme.breakpoints.down('md')]: {
        marginTop:     theme.spacing(-4.75),
        '& a, button': {
          paddingTop: 4,
        },
      },
    },
    alignStart: {
      alignSelf: 'flex-start',
      display:   'flex',
    },
    address:    {
      fontStyle:     'italic',
      paddingBottom: theme.spacing(0.5),
    },
    header:     {
      lineHeight: 1,
    },
  },
);

type Props = {
  shareButton: React.ReactNode;
  title: string;
  telephone?: string;
  secondaryTelephone?: string;
  secondaryTelephoneReason?: string;
  distance?: number;
  children: React.ReactNode;
  address?: string | undefined;
  component?: string;
  isCompany?: boolean;
} & WithStyles<typeof styles>;

function _DistanceShare(props: Props): JSX.Element {
  const { classes, title, telephone, secondaryTelephone, secondaryTelephoneReason, shareButton, children, distance, address, isCompany, component } = props;

  return (
    <Grid container alignItems="center" spacing={0}>
      <Grid item xs={12}>
        <Typography variant="h6" component={component || 'h1' as any} className={classes.header}>
          {title}
        </Typography>
      </Grid>

      {address && (
        <Grid item xs={12}>
          <Typography variant="caption" component={'address' as any} className={classes.address}>
            {address}, {distance !== undefined ? getDistance(distance) : ''}
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8} className={classes.content}>
        {children}
      </Grid>

      <Grid item xs={12} md={4} className={clsx(classes.flexEnd, { [classes.flexEndMd]: isCompany })}>
        {telephone && <MultiPhoneButton telephone={telephone}
                                        secondaryTelephone={secondaryTelephone}
                                        secondaryTelephoneReason={secondaryTelephoneReason}/>}
        {shareButton}
      </Grid>

    </Grid>
  );
}

export const DistanceShare = withStyles(styles)(_DistanceShare);
