import {
  CircularProgress,
  createStyles,
  withStyles,
  WithStyles,
}                 from '@material-ui/core';
import clsx       from 'clsx';
import * as React from 'react';

const styles = () => createStyles({
                                    loading: {
                                      position: 'relative',
                                      left:     '50%',
                                    },
                                    center:  {
                                      position: 'absolute',
                                      left:     '50%',
                                      top:      '40%',
                                    },
                                  });

type PropsWithStyles = { center?: boolean } & WithStyles<typeof styles>;

const _Loading: React.FC<PropsWithStyles> = ({ classes, center }) => <CircularProgress className={clsx({
                                                                                                         [classes.loading]: !center,
                                                                                                         [classes.center]:  center,
                                                                                                       })}/>;

export const Loading = withStyles(styles)(_Loading);
