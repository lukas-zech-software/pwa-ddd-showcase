import {
  Avatar,
  Chip,
  createStyles,
  Theme,
  Tooltip,
  Typography,
  withStyles,
  WithStyles,
}                           from '@material-ui/core';
import {
  Edit,
  Warning,
}                           from '@material-ui/icons';
import { Timestamp }        from '@my-old-startup/common/interfaces';
import { alertColors }      from '@my-old-startup/frontend-common/style';
import { ValidationError }  from 'class-validator';
import clsx                 from 'clsx';
import moment               from 'moment';
import * as React           from 'react';
import { TimePickerDialog } from './TimePickerDialog';

const styles = (theme: Theme) => createStyles(
  {
    chip:              {
      margin: theme.spacing(1),
    },
    chipLabel:         {
      display:    'inline-block',
      fontWeight: theme.typography.fontWeightMedium,
    },
    errorTooltip:      {
      backgroundColor: 'rgba(0,0,0,0)',
      color:           alertColors(theme).error,
      fontSize:        theme.typography.pxToRem(7),
      fontWeight:      400,
      marginTop:       0,
    },
    timePicker:        {
      margin:    theme.spacing(1),
      '& input': {
        cursor: 'pointer',
      },
    },
    timePickerSummary: {
      fontSize: theme.typography.pxToRem(15),
    },
  },
);

type Props = WithStyles<typeof styles> & {
  error: ValidationError | undefined;
  timestamp: Timestamp;
  label: string;
  spanningDay?: boolean;

  chipClass?: string;
  onChange: (timestamp: Timestamp) => void;
};

type State = {
  isDialogOpen: boolean;
};

class _TimePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isDialogOpen: false,
    };
  }

  public render(): React.ReactNode {
    const { classes, label, error, timestamp, chipClass } = this.props;

    const labelText = (
      <span>
        <Typography className={classes.chipLabel}>{label} </Typography> {this.formatTimestamp(timestamp)}
      </span>
    );

    const errorMessage = error ? Object.values<string>(error.constraints)[0] : undefined;

    const makeAvatar = () => {
      if (error !== undefined) {
        return (<Avatar><Warning/></Avatar>);
      }
    };

    return (
      <div>
        <TimePickerDialog label={label}
                          timestamp={timestamp}
                          open={this.state.isDialogOpen}
                          onSubmit={(t) => this.onChange(t)}
                          onAbort={() => this.setState({ isDialogOpen: false })}
        />
        <Tooltip placement="bottom" classes={{ tooltip: classes.errorTooltip }} title={errorMessage || ''}
                 open={error !== undefined}>
          <Chip label={labelText}
                avatar={makeAvatar()}
                className={clsx(classes.chip, chipClass)}
                color="primary"
                deleteIcon={<Edit/>}
                onDelete={() => this.displayDialog()}
          />
        </Tooltip>
      </div>
    );
  }

  private formatTimestamp(timestamp: Timestamp): string {
    if (this.props.spanningDay) {
      return moment(timestamp).format('DD.MM HH:mm');

    }
    return moment(timestamp).format('HH:mm');
  }

  private onChange(timestamp: Timestamp): void {
    this.setState({ isDialogOpen: false });

    this.props.onChange(timestamp);
  }

  private displayDialog(): void {
    this.setState({ isDialogOpen: true });
  }
}

export const TimePicker = withStyles(styles)(_TimePicker);
