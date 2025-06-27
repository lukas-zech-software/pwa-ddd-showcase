import {
  Avatar,
  Chip,
  createStyles,
  Theme,
  WithStyles,
  withStyles,
}                   from '@material-ui/core';
import {
  DateRange,
  Timer,
}                   from '@material-ui/icons';
import { TimeInMs } from '@my-old-startup/common/datetime/TimeInMs';
import { IApiDeal } from '@my-old-startup/common/interfaces/IApiDeal';
import clsx         from 'clsx';
import  dayjs                      from 'dayjs';
import * as React   from 'react';
import { locale }   from '../../../common/locales';
import {
  ACTIVE_COLOR_RGBA,
  LATER_COLOR_RGBA,
  OVER_COLOR_RGBA,
  PRIMARY_COLOR_RGBA,
}                   from '../../../styles/theme';

function getSingularOrPluralLabel(value: number, label: string): string {
  if (value > 0) {
    if (value === 1) {
      label = label.slice(0, -1);
    }
    return `${value} ${label} `;
  }
  return '';
}

function getCountDownLabel(timestamp: number): string {

  const time    = dayjs(timestamp),
        now     = dayjs(),
        days    = time.diff(now, 'd'),
        hours   = time.subtract(days, 'd').diff(now, 'h'),
        minutes = time.subtract(days, 'd').subtract(hours, 'h').diff(now, 'm');

  if (days !== 0) {
    // eslint-disable-next-line @typescript-eslint/tslint/config
    return getSingularOrPluralLabel(days, locale.common.date.days)
      + ' '
      + getSingularOrPluralLabel(hours, locale.common.date.hours);
  }

  if (hours !== 0) {
    // eslint-disable-next-line @typescript-eslint/tslint/config
    return getSingularOrPluralLabel(hours, locale.common.date.hours)
      + ' '
      + getSingularOrPluralLabel(minutes, locale.common.date.minutes);
  }

  if (minutes !== 0) {
    return getSingularOrPluralLabel(minutes, locale.common.date.minutes);
  }

  return locale.common.date.lessThanOneMinute;
}

const styles = (theme: Theme) => createStyles({
                                                avatar:     {
                                                  'height':          theme.spacing(3),
                                                  'width':           theme.spacing(3),
                                                  'borderRadius':    0,
                                                  'backgroundColor': 'transparent',
                                                  'color':           '#fff',
                                                  '&.big':           {
                                                    height:              theme.spacing(5),
                                                    width:               theme.spacing(5),
                                                    borderTopLeftRadius: theme.spacing(1),
                                                  },
                                                },
                                                label:      {
                                                  paddingLeft: 6,
                                                },
                                                icon:       {
                                                  'height': theme.spacing(2),
                                                  'width':  theme.spacing(2),
                                                  '&.big':  {
                                                    height: theme.spacing(3),
                                                    width:  theme.spacing(3),
                                                  },
                                                },
                                                chip:       {
                                                  'height':                  theme.spacing(3),
                                                  'borderRadius':            0,
                                                  'borderBottomRightRadius': theme.spacing(1),
                                                  'color':                   '#fff',
                                                  'fontWeight':              500,
                                                  'zIndex':                  10,

                                                  '&.big': {
                                                    'height':              theme.spacing(5),
                                                    'borderTopLeftRadius': theme.spacing(1),
                                                    'fontWeight':          500,
                                                    'fontSize':            '105%',
                                                    'opacity':             1,

                                                    'boxShadow': theme.shadows[24],

                                                    '&>span': {
                                                      paddingLeft: theme.spacing(2),
                                                    },
                                                  },
                                                },
                                                activeChip: {
                                                  backgroundColor: ACTIVE_COLOR_RGBA,
                                                },
                                                soonChip:   {
                                                  backgroundColor: PRIMARY_COLOR_RGBA,
                                                },
                                                laterChip:  {
                                                  backgroundColor: LATER_COLOR_RGBA,
                                                },
                                                overChip:   {
                                                  backgroundColor: OVER_COLOR_RGBA,
                                                },
                                              });

type Props = {
  deal: IApiDeal;
  small?: boolean;
  big?: boolean;
};

type State = {
  timestamp: number;
};

class _CountDownChip extends React.Component<Props & WithStyles<typeof styles>, State> {
  private interval: any;

  constructor(props: Readonly<Props & WithStyles<typeof styles>>) {
    super(props);
    this.state = {
      timestamp: Date.now(),
    };
  }

  public componentDidMount(): void {
    this.interval = setInterval(() => this.setState({ timestamp: Date.now() }), TimeInMs.ONE_MINUTE);
  }

  public componentWillUnmount(): void {
    clearInterval(this.interval);
  }

  public getActiveChip(): React.ReactNode {
    const { classes, small, big } = this.props;
    const countDown               = getCountDownLabel(this.props.deal.date.validTo);
    const label                   = locale.format.countDownChip.active(countDown, small);

    return (
      <Chip
        className={clsx(classes.chip, classes.activeChip, { big })}
        classes={{ label: classes.label }}
        color="primary"
        avatar={
          <Avatar className={clsx(classes.avatar, { big })}>
            <Timer className={clsx(classes.icon, { big })}/>
          </Avatar>
        }
        label={label}
      />
    );
  }

  public getSoonChip(): React.ReactNode {
    const { classes, big } = this.props;
    const countDown        = getCountDownLabel(this.props.deal.date.validFrom);
    const label            = locale.format.countDownChip.future(countDown);

    return (
      <Chip
        className={clsx(classes.chip, classes.soonChip, { big })}
        classes={{ label: classes.label }}
        color="secondary"
        avatar={
          <Avatar className={clsx(classes.avatar, { big })}>
            <Timer className={clsx(classes.icon, { big })}/>
          </Avatar>
        }
        label={label}
      />
    );
  }

  public getLaterChip(): React.ReactNode {
    const { classes, big } = this.props;
    const countDown        = getCountDownLabel(this.props.deal.date.validFrom);
    const label            = locale.format.countDownChip.future(countDown);

    return (
      <Chip
        className={clsx(classes.chip, classes.laterChip, { big })}
        classes={{ label: classes.label }}
        avatar={
          <Avatar className={clsx(classes.avatar, { big })}>
            <DateRange className={clsx(classes.icon, { big })}/>
          </Avatar>
        }
        label={label}
      />
    );
  }

  public getOverChip(): React.ReactNode {
    const { classes, big } = this.props;
    const label            = locale.common.date.over;

    return (
      <Chip
        className={clsx(classes.chip, classes.overChip, { big })}
        classes={{ label: classes.label }}
        avatar={
          <Avatar className={clsx(classes.avatar, { big })}>
            <DateRange className={clsx(classes.icon, { big })}/>
          </Avatar>
        }
        label={label}
      />
    );
  }

  public render(): React.ReactNode {
    const { validFrom, validTo } = this.props.deal.date,
          now                    = Date.now(),
          isToday                = new Date(validFrom).getDate() === new Date(now).getDate(),
          isDealActive           = validFrom < now && validTo > now,
          isDealOver             = validTo <= now;

    if (isDealOver) {
      return this.getOverChip();
    }

    if (isDealActive) {
      return this.getActiveChip();
    }

    if (isToday) {
      return this.getSoonChip();
    }

    return this.getLaterChip();
  }
}

export const CountDownChip = withStyles(styles)(_CountDownChip);

class _NewsDateChip extends React.Component<Props & WithStyles<typeof styles>, State> {

  public getActiveChip(): React.ReactNode {
    const { classes, big } = this.props;
    const label            = locale.format.date(this.props.deal.date.validFrom);

    return (
      <Chip
        className={clsx(classes.chip, classes.activeChip, { big })}
        classes={{ label: classes.label }}
        color="primary"
        avatar={
          <Avatar className={clsx(classes.avatar, { big })}>
            <Timer className={clsx(classes.icon, { big })}/>
          </Avatar>
        }
        label={label}
      />
    );
  }

  public getSoonChip(): React.ReactNode {
    const { classes, big } = this.props;
    const countDown        = locale.format.date(this.props.deal.date.validFrom);
    const label            = locale.format.newsDateChip.soon(countDown);

    return (
      <Chip
        className={clsx(classes.chip, classes.activeChip, { big })}
        classes={{ label: classes.label }}
        color="primary"
        avatar={
          <Avatar className={clsx(classes.avatar, { big })}>
            <Timer className={clsx(classes.icon, { big })}/>
          </Avatar>
        }
        label={label}
      />
    );
  }

  public render(): React.ReactNode {
    const { validFrom } = this.props.deal.date,
          now           = Date.now(),
          isNotToday    = validFrom - now > TimeInMs.ONE_DAY;

    if (isNotToday) {
      return this.getSoonChip();
    }

    return this.getActiveChip();

  }
}

export const NewsDateChip = withStyles(styles)(_NewsDateChip);
