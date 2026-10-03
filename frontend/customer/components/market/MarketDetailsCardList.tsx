import {
  createStyles,
  IconButton,
  Paper,
  RootRef,
  Theme,
  WithStyles,
  withStyles,
  withWidth,
} from '@material-ui/core';

import { Breakpoint }           from '@material-ui/core/styles/createBreakpoints';
import {
  isWidthUp,
  WithWidth,
}                               from '@material-ui/core/withWidth';
import {
  ArrowBackIos,
  ArrowForwardIos,
}                               from '@material-ui/icons';
import clsx                     from 'clsx';
import * as React               from 'react';
import { IApiCompany }          from '../../../../common/interfaces';
import { MarketCompanyMapCard } from '../market/MarketCompanyMapCard';

const styles = (theme: Theme) => createStyles(
  {
    '@global':           {
      '::-webkit-scrollbar': { display: 'none' },
    },
    'rootPreview':       {
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .3) 75%)',
      width:      `100%`,
      overflowY:  'auto',
      overflowX:  'hidden',
    },
    'itemContainer':     {
      'width':       '100vw',
      'overflowX':   'scroll',
      'overflowY':   'hidden',
      'whiteSpace':  'nowrap',
      '&.isDesktop': {
        width:      `calc(100vw - ${theme.spacing(12)}px)`,
        marginLeft: theme.spacing(5),
      },
    },
    'item':              {
      display: 'inline-block',
    },
    'scrollButtonIcon':  {
      height: theme.spacing(5),
      width:  theme.spacing(5),
    },
    'scrollButtonLeft':  {
      left: theme.spacing(-0.5),
    },
    'scrollButtonRight': {
      right: -theme.spacing(1),
    },
    'scrollButton':      {
      'bottom':   theme.spacing(27),
      'position': 'absolute',
      zIndex:     9999,
    },

    [theme.breakpoints.up('md')]: {
      'itemContainer': {
        paddingLeft: theme.spacing(4),
      },
    },

    [theme.breakpoints.down('sm')]: {
      'scrollButton':      {
        'bottom':        0,
        backgroundColor: 'rgba(255,255,255,0.7)',
      },
      'scrollButtonLeft':  {
        left: theme.spacing(2),
      },
      'scrollButtonRight': {
        right: theme.spacing(2),
      },
      'scrollButtonIcon':  {
        height: theme.spacing(3),
        width:  theme.spacing(3),
      },
    },
  },
);

type Props = {
  companies: IApiCompany[];
} & WithStyles<typeof styles> & WithWidth;

type State = {
  width: Breakpoint;
};

class _MarketDetailsCardList extends React.Component<Props, State> {
  private domRef: any;

  constructor(props: Readonly<Props>) {
    super(props);
    this.domRef = React.createRef();
    this.state  = {
      width: 'xs',
    };
  }

  public componentDidMount(): void {
    this.setState({ width: this.props.width });
  }

  public getScrollButtons(): React.ReactNode {
    const { classes } = this.props;
    return (
      <div>
        <IconButton disableRipple disableTouchRipple
                    className={clsx(classes.scrollButton, classes.scrollButtonLeft)}
                    onClick={() => this.scrollLeft()}>
          <ArrowBackIos className={clsx(classes.scrollButtonIcon)}/>
        </IconButton>

        <IconButton disableRipple disableTouchRipple
                    className={clsx(classes.scrollButton, classes.scrollButtonRight)}
                    onClick={() => this.scrollRight()}>
          <ArrowForwardIos className={clsx(classes.scrollButtonIcon)}/>
        </IconButton>
      </div>
    );
  }

  public render(): React.ReactNode {
    const { classes, companies } = this.props;

    const isDesktop = isWidthUp('sm', this.state.width);

    return (
      <Paper
        elevation={0}
        className={clsx(classes.rootPreview)}
      >
        <RootRef rootRef={ref => this.domRef = ref}>
          <div className={clsx(classes.itemContainer, { isDesktop })}>
            <>
              {this.getScrollButtons()}
              {companies.map(company => (
                               <div className={clsx(classes.item)} key={company.id}>
                                 <MarketCompanyMapCard
                                   company={company}
                                 />
                               </div>
                             ),
              )}
            </>
          </div>
        </RootRef>

      </Paper>
    );
  }

  private scrollLeft(): void {
    this.domRef.scrollLeft = this.domRef.scrollLeft - 300;
  }

  private scrollRight(): void {
    this.domRef.scrollLeft = this.domRef.scrollLeft + 300;
  }
}

export const MarketDetailsCardList = withWidth()(withStyles(styles)(_MarketDetailsCardList));
