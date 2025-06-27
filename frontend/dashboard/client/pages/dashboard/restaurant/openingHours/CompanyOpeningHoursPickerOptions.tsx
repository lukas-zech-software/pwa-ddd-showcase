import { Button, createStyles, Menu, MenuItem, Theme, Tooltip, withStyles, WithStyles } from '@material-ui/core';
import { Add, Clear, MoreVert, Replay }
  from '@material-ui/icons';
import { OpeningHoursWeek } from '@my-old-startup/common/interfaces';
import clsx                 from 'clsx';
import * as React           from 'react';
import { locale }           from '../../../../common/locales';
import { getYesterday }     from '../../../../common/utils/utils';

const styles = (theme: Theme) => createStyles({
  tooltip: {
    marginTop: theme.spacing(2.5),
  },
  '@keyframes first': {
    '0%': {
      opacity: .7,
    },
    '50%': {
      opacity:         1,
      backgroundColor: theme.palette.primary.light,

    },
    '100%': {
      opacity: .7,
    },
  },
  firstTooltip: {
    animationName:           '$first',
    animationDuration:       '1s',
    animationIterationCount: 3,
  },
  button: {
    width:    '100%',
    minWidth: 'auto',
  },
  paper: {
    color: theme.palette.secondary.main,
  },
});

type Props = {
  currentDay: keyof OpeningHoursWeek;
  label: string;
  firstOpen: boolean;

  removeAllEntries(currentDay: keyof OpeningHoursWeek): void;

  cloneDay(currentDay: keyof OpeningHoursWeek): void;

  openDialog(): void;
} & WithStyles<typeof styles>;

type State = {
  anchorEl: any | null;
};

class _CompanyOpeningHoursPickerOptions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  public render(): React.ReactNode {
    const { classes, currentDay, label, cloneDay, removeAllEntries, openDialog, firstOpen } = this.props;
    const { anchorEl }                                                                      = this.state;

    return (
      <div>
        <Button className={clsx(classes.button, { [classes.firstTooltip]: firstOpen })}
                onClick={(event: any) => this.setState({ anchorEl: event.currentTarget })}>
          <Tooltip classes={{ tooltip: this.props.classes.tooltip }}
                   title={locale.forms.apiCompanyDetails.openingHoursForm.initTooltip}>
            <MoreVert/>
          </Tooltip>
        </Button>

        {anchorEl && (
          <Menu open
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                onClose={() => this.setState({ anchorEl: null })}
                classes={{ paper: classes.paper }}
          >
            <MenuItem onClick={openDialog}>
              <Tooltip classes={{ tooltip: this.props.classes.tooltip }}
                       title={locale.forms.apiCompanyDetails.openingHoursForm.tooltip(label)}>
                <Add/>
              </Tooltip>
            </MenuItem>

            <MenuItem onClick={() => removeAllEntries(currentDay)}>
              <Tooltip classes={{ tooltip: this.props.classes.tooltip }}
                       title={locale.forms.apiCompanyDetails.openingHoursForm.tooltipClear}>
                <Clear/>
              </Tooltip>
            </MenuItem>

            {currentDay !== 'monday' && (
              <MenuItem onClick={() => cloneDay(currentDay)}>
                <Tooltip classes={{ tooltip: classes.tooltip }}
                         title={locale.forms.apiCompanyDetails.openingHoursForm.tooltipClone(getYesterday(currentDay))}>
                  <Replay/>
                </Tooltip>
              </MenuItem>)}

          </Menu>)}
      </div>
    );
  }
}

export const CompanyOpeningHoursPickerOptions = withStyles(styles)(_CompanyOpeningHoursPickerOptions);

