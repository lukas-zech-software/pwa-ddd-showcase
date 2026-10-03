import { createStyles, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
import { red }                                                     from '@material-ui/core/colors';
import * as React                                                  from 'react';

const styles = (theme: Theme) => createStyles({
  text: {
    height:   theme.spacing(5),
    maxWidth: theme.spacing(18),
    color:    red[700],
  },
});

type Props = WithStyles<typeof styles> & {
  message: string;
};

class _PickerError extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    return <Typography variant="body2" className={this.props.classes.text}>{this.props.message}</Typography>;
  }
}

export const PickerError = withStyles(styles)(_PickerError);
