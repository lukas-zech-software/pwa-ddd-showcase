export const nothing = 0;
/*
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

import { Breakpoint }        from '@material-ui/core/styles/createBreakpoints';
import {
  isWidthUp,
  WithWidth,
}                            from '@material-ui/core/withWidth';
import {
  ArrowBackIos,
  ArrowForwardIos,
}                            from '@material-ui/icons';
import clsx                  from 'clsx';
import * as React            from 'react';
import {
  APP_HEADER_HEIGHT,
  BOTTOM_NAV_HEIGHT,
} from '../../common/constants';
import {
  MapLocation,
  MapType,
  MarketMapLocation,
}                            from '../../common/types';
import { CompanyMapCard }    from '../company/CompanyMapCard';
import { DealMapCard }       from '../deal/DealMapCard';
import { MarketMapCard }     from '../market/MarketMapCard';
import { NewsMapCard }       from '../news/NewsMapCard';

const styles = (theme: Theme) => createStyles(
  {
    '@global':           {
      '::-webkit-scrollbar': { display: 'none' },
    },
    'rootPreview':       {
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .3) 75%)',
      position:   'absolute',
      top:        `${theme.spacing(APP_HEADER_HEIGHT - 1)}px`,
      height:     `calc(100% - ${theme.spacing(APP_HEADER_HEIGHT + BOTTOM_NAV_HEIGHT)}px)`,
      width:      `100%`,
      overflowY:  'auto',
      overflowX:  'hidden',
    },
    'itemContainer':     {
      'width':       '100vw',
      'height':       '130vh',
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
      'position': 'fixed',
      '&:hover':  {
        backgroundColor: 'transparent',
      },
    },
  },
);

type Props = {
  mapLocation: MapLocation | undefined;
  marketLocation: MarketMapLocation | undefined;
  onClose: () => void;
  type: MapType;
} & WithStyles<typeof styles> & WithWidth;

type State = {
  width: Breakpoint;
};

class _MapCardList extends React.Component<Props, State> {
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

  public getDealCards(): React.ReactNode {
    const { classes, mapLocation, onClose } = this.props;
    if (mapLocation === undefined) {
      return null;
    }

    const isDesktop = isWidthUp('sm', this.state.width);

    return (
      <>
        {isDesktop && this.getScrollButtons()}
        {mapLocation.deals.map(deal => (
                                 <div className={clsx(classes.item)} key={deal.id}>
                                   <DealMapCard
                                     onClose={onClose}
                                     deal={deal}
                                     company={mapLocation.company}
                                     distance={mapLocation.distance}
                                   />
                                 </div>
                               ),
        )}
      </>
    );
  }

  public getNewsCards(): React.ReactNode {
    const { classes, mapLocation, onClose, type } = this.props;
    if (mapLocation === undefined) {
      return null;
    }

    const isDesktop = isWidthUp('sm', this.state.width);

    return (
      <>
        {isDesktop && this.getScrollButtons()}
        {mapLocation.news.map(deal => (
                                <div className={clsx(classes.item)} key={deal.id}>
                                  <NewsMapCard
                                    onClose={onClose}
                                    deal={deal}
                                    company={mapLocation.company}
                                    distance={mapLocation.distance}
                                  />
                                </div>
                              ),
        )}
      </>
    );
  }

  public getCompanyCards(): React.ReactNode {
    const { mapLocation, onClose } = this.props;
    if (mapLocation === undefined) {
      return null;
    }

    return (
      <CompanyMapCard
        onClose={onClose}
        company={mapLocation.company}
        distance={mapLocation.distance}
      />
    );
  }

  public getMarketMapCard(): React.ReactNode {
    const { marketLocation, onClose } = this.props;
    if (marketLocation === undefined) {
      return null;
    }

    return (
      <MarketMapCard
        onClose={onClose}
        market={marketLocation.market}
      />
    );
  }

  private getCards(): React.ReactNode {
    const { mapLocation, type } = this.props;

    if (!mapLocation) {
      return null;
    }

    if (type === MapType.DEALS) {
      if (mapLocation.deals.length !== 0) {
        return this.getDealCards();
      }
      if (mapLocation.news.length !== 0) {
        return this.getNewsCards();
      }
    }

    if (type === MapType.NEWS) {
      if (mapLocation.news.length !== 0) {
        return this.getNewsCards();
      }

      if (mapLocation.deals.length !== 0) {
        return this.getDealCards();
      }
    }

    return this.getCompanyCards();
  }

  public render(): React.ReactNode {
    const { classes, onClose } = this.props;
    const isDesktop            = isWidthUp('sm', this.state.width);

    return (
      <Paper
        elevation={0}
        onClick={onClose}
        className={clsx(classes.rootPreview)}
      >
        <RootRef rootRef={ref => this.domRef = ref}>
          <div className={clsx(classes.itemContainer, { isDesktop })}
               onClick={onClose}>
            {this.getCards()}
            {this.getMarketMapCard()}
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

export const MapCardList = withWidth()(withStyles(styles)(_MapCardList));
*/
