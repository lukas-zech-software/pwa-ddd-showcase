import {
  Avatar,
  Chip,
  createStyles,
  Theme,
  WithStyles,
  withStyles,
}                 from '@material-ui/core';
import ErrorIcon  from '@material-ui/icons/Error';
import * as React from 'react';

const styles = (theme: Theme) => createStyles({
                                                chip: {
                                                  fontSize: theme.typography.fontSize,
                                                },
                                              });

type Props = {
  error: string;
} & WithStyles<typeof styles>;

export const ErrorMessage = withStyles(styles)(
  class ErrorMessage extends React.Component<Props> {
    public render(): React.ReactNode {
      return <Chip color="secondary" label={this.props.error} avatar={<Avatar><ErrorIcon/></Avatar>}/>;
    }
  },
);
