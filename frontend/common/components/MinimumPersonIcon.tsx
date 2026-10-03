import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                 from '@material-ui/core';
import { Person } from '@material-ui/icons';
import clsx       from 'clsx';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
                 person:        {
                   fontSize: '2em',
                 },
                 furtherPerson: {
                   marginLeft: theme.spacing(-1),
                 },
                 moreText:      {
                   display:  'inline',
                   bottom:   theme.spacing(0.5),
                   position: 'relative',
                 },
               });

type Props = {
  minPersonCount: number;
} & WithStyles<typeof styles>;

const _MinimumPersonIcon: React.SFC<Props> = (props: Props) => {
  const { classes, minPersonCount } = props;

  if (minPersonCount >= 5) {
    return (
      <>
        <Person className={classes.person}/>
        <Typography variant="overline" className={classes.moreText}>
          x {minPersonCount}
        </Typography>
      </>
    );
  }

  return (
    <>
      {new Array(minPersonCount).fill(0).map((x, i) => <Person
        className={clsx(classes.person, { [classes.furtherPerson]: i !== 0 })} key={i}/>)}
    </>
  );
};

export const MinimumPersonIcon = withStyles(styles)(_MinimumPersonIcon);
