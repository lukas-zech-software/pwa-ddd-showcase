import {
  ClickAwayListener,
  createStyles,
  InputAdornment,
  Theme,
  Tooltip,
  withStyles,
  WithStyles,
}                 from '@material-ui/core';
import { Help }   from '@material-ui/icons';
import clsx       from 'clsx';
import * as React from 'react';

const styles = (theme: Theme) => createStyles({
  input: {
    margin: theme.spacing(1),
  },
  tooltip: {
    cursor: 'pointer',
  },
  tooltipPopper: {
    fontSize: '.8rem',
    maxWidth: 500,
  },
  tooltipIcon: {
    height:        '100%',
    color:         theme.palette.grey[400],
    verticalAlign: 'sub',
    '&.form':      {
      float:    'right',
      position: 'relative',
      width:    theme.spacing(3),
      height:   theme.spacing(3),
    },
  },
  inputAdornmentInline: {
    display: 'inline',
  },
  inputAdornment: {
    height: 'auto',
  },
});

type Props = WithStyles<typeof styles> & {
  title: any;
  className?: string;
  inline?: boolean;
  form?: boolean;
  width?: number;
};

type State = {
  isTooltipOpen: boolean;
};

class _FormTooltip extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isTooltipOpen: false,
    };
  }

  public render(): React.ReactNode {
    const { classes, title, className, inline, width, form } = this.props;
    const { isTooltipOpen }                                  = this.state;

    return (
      <ClickAwayListener touchEvent="onTouchStart" onClickAway={() => this.setState({ isTooltipOpen: false })}>
        <InputAdornment position="end" classes={{ root: classes.inputAdornment }}
                        className={clsx({ [classes.inputAdornmentInline]: inline })}>
          <Tooltip style={{ maxWidth: width || 500 }}
                   title={title}
                   disableFocusListener
                   disableTouchListener
                   open={isTooltipOpen}
                   onOpen={() => this.setState({ isTooltipOpen: true })}
                   onClose={() => this.setState({ isTooltipOpen: false })}
                   className={clsx(classes.tooltip, className, { ['form']: form })}
                   classes={{ tooltip: classes.tooltipPopper }}>
            <Help className={classes.tooltipIcon}
                  onClick={() => this.setState({ isTooltipOpen: true })}
                  onMouseOver={() => this.setState({ isTooltipOpen: true })}
            />
          </Tooltip>
        </InputAdornment>
      </ClickAwayListener>
    );
  }
}

export const FormTooltip = withStyles(styles)(_FormTooltip);
