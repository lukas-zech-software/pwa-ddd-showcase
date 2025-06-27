import { createStyles, Paper, Theme, Tooltip, Typography, withStyles, WithStyles } from '@material-ui/core';
import { TimeInMs }                                                                from '@my-old-startup/common/datetime';
import {
  IApiCompany,
  IApiDeal,
}                       from '@my-old-startup/common/interfaces';
import { BooleanCell2 } from '@my-old-startup/frontend-common/components/table/BooleanCell2';
import clsx             from 'clsx';
import * as React       from 'react';
import { View }         from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { locale }                          from '../../../common/locales';
import { NotPublishedIcon, PublishedIcon } from '../../../styles/common';
import { DealsOptionsMenu }                from '../common/DealsOptionsMenu';

const styles = (theme: Theme) => createStyles({
  paper: {
    padding:  theme.spacing(0.5),
    height:   `calc(100% - ${theme.spacing(1)}px)`,
    overflow: 'hidden',
  },
  text: {
    marginLeft: theme.spacing(3),
  },
  'block_with_text': {
    whiteSpace: 'pre-wrap',
    overflow:   'hidden',
    lineHeight: '1.5em',
    height:     '90%',
    width:      '98%',
    display:    'block',
    position:   'relative',
    '&:after':  {
      content:    '""',
      textAlign:  'right',
      position:   'absolute',
      bottom:     '.5em',
      right:      '0',
      width:      '20%',
      height:     '1.5em',
      background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)',
    },
  },
  cell: {
    float: 'left',
  },
  miniCell: {
    marginTop:       2,
    marginLeft:      2,
    backgroundColor: theme.palette.background.paper,
    borderRadius:    '50%',
    height:          15,
  },
  miniText: {
    fontSize:    14,
    paddingLeft: theme.spacing(1),
    width:       'auto',
    '&:after':   {
      height: 19,
      bottom: 0,
    },
  },
  mini: {
    height:  19,
    '& svg': {
      height: 15,
      width:  15,
    },
  },
  notPublishedEvent: {
    color: theme.palette.grey[500],
  },
});

type Props = WithStyles<typeof styles> & {
  deal: IApiDeal & { handleClick?(event: any): void };
  company: IApiCompany;
  view: View;
};

type State = { anchorEl: any };

export class _DealsCalendarEvent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  public componentDidMount = (): void => {
    // TODO: We probably shouldn't be assigning to a prop
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.props.deal.handleClick = (e) => {
      if (this.state.anchorEl !== null || e === undefined) {
        return;
      }

      this.handleClick(e);
    };
  }

  public render(): React.ReactNode {
    const { deal, company, view, classes } = this.props;

    const is1HourOrLess = (deal.date.validTo - deal.date.validFrom) <= TimeInMs.ONE_HOUR + 1;
    const isMonthView   = view === 'month';
    const mini          = is1HourOrLess || isMonthView;
    const isPublished   = deal.published !== null;
    const publishLabel  = isPublished
      ? locale.dashboard.dealsPage.table.tooltips.published(deal.published || 0)
      : locale.dashboard.dealsPage.table.tooltips.notPublished;

    return (
      <>
        <Tooltip title={`${deal.description.title} - ${publishLabel}`}>
          <Paper id={deal.id}
                 onClick={(e) => this.handleClick(e)}
                 className={clsx({ [classes.paper]: !mini, [classes.mini]: mini })}>

            <BooleanCell2 value={deal.published !== null}
                          className={clsx(classes.cell, { [classes.miniCell]: mini })}
                          CheckedIcon={<PublishedIcon/>}
                          NotCheckedIcon={<NotPublishedIcon className={classes.notPublishedEvent}/>}/>

            {/*Title is too long for month or very short deals*/}
            <Typography className={clsx(classes.block_with_text, { [classes.miniText]: mini })}
                        variant={mini ? 'caption' : 'body2'}>
              {deal.description.title}
            </Typography>

          </Paper>
        </Tooltip>

        {this.state.anchorEl !== null && (
          <DealsOptionsMenu company={company}
                            deal={deal}
                            menuAnchorEl={this.state.anchorEl}
                            onClose={() => this.handleClose()}/>
        )}
      </>
    );
  }

  private handleClick(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ anchorEl: event.currentTarget });
  }

  private handleClose(): void {
    this.setState({ anchorEl: null });
  }
}

export const DealsCalendarEvent = withStyles(styles)(_DealsCalendarEvent);
