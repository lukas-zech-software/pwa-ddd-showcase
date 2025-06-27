import {
  IconButton,
  makeStyles,
  Paper,
  Theme,
  Tooltip,
}                       from '@material-ui/core';
import { LensTwoTone }  from '@material-ui/icons';
import clsx             from 'clsx';
import * as React       from 'react';
import {
  IApiDeal,
  LatLng,
} from '../../../../common/interfaces';
import { locale }       from '../../common/locales';
import { MapType }      from '../../common/types';
import { ACTIVE_COLOR } from '../../styles/theme';
import {
  BinocularIcon,
  DealsIcon,
  MarketIcon,
  RestaurantIcon,
}                       from '../icons/icons';

const MAP_MARKER_SIZE = 120;
let i                 = 0;

const useStyles = makeStyles((theme: Theme) => (
  {
    root:            {
      position: 'relative',
      top:      -MAP_MARKER_SIZE / 2,
      left:     -MAP_MARKER_SIZE / 2,

      backgroundColor: 'transparent',
      width:           MAP_MARKER_SIZE,
      verticalAlign:   'middle',
      textAlign:       'center',
    },
    textPaper:       {
      padding:         2,
      backgroundColor: theme.palette.background.paper,
      fontSize:        '0.7rem',
    },
    icon:            {
      zIndex:           50,
      position:         'relative',
      width:            MAP_MARKER_SIZE / 2,
      height:           MAP_MARKER_SIZE / 2,
      color:            theme.palette.secondary.main,
      '-webkit-filter': 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))',
      'filter':         'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))',

      '&.deal': {
        color:    theme.palette.secondary.main,
        '& path': {
          fill: theme.palette.secondary.main,
        },
      },

      '&.news': {
        color:  theme.palette.secondary.main,
        width:  MAP_MARKER_SIZE / 2.5,
        height: MAP_MARKER_SIZE / 2.5,

        '& path': {
          fill: theme.palette.secondary.main,
        },
      },

      '&.restaurant': {
        width:            MAP_MARKER_SIZE / 3,
        height:           MAP_MARKER_SIZE / 3,
        zIndex:           10,
        color:            'rgba(95,178,204,0.8)',
        '& path':         {
          fill: 'rgba(95,178,204)',
        },
        // no filter for RGBA colors
        '-webkit-filter': 'none',
        'filter':         'none',

        '&.mapTypeCompany': {
          color:  theme.palette.secondary.main,
          width:  MAP_MARKER_SIZE / 2.5,
          height: MAP_MARKER_SIZE / 2.5,

          '& path': {
            fill: theme.palette.secondary.main,
          },
        },
      },
    },
    secondaryMarker: {
      color:   theme.palette.primary.main + ' !important',
      opacity: .65,

      '& path': {
        fill: theme.palette.primary.main + ' !important',
      },
    },
    avatar:          {
      backgroundColor: theme.palette.background.paper,
      color:           theme.palette.text.secondary,
      zIndex:          110,
      position:        'relative',
      top:             -32,
      left:            MAP_MARKER_SIZE / 2 - 10,
      height:          MAP_MARKER_SIZE / 6,
      width:           MAP_MARKER_SIZE / 6,
      fontSize:        '1.25em',
    },
    selectedAvatar:  {
      fontWeight: 'bold',
      zIndex:     1010,
    },
    selected:        {
      // should override "active"
      color:          theme.palette.primary.main + '!important',
      '& path':       {
        fill: theme.palette.primary.main + '!important',
      },
      '&.restaurant': {
        zIndex: 5000,
      },
      zIndex:         1000,
    },
    active:          {
      color:  ACTIVE_COLOR,
      zIndex: 100,
    },
    location:        {
      color:              'rgba(0, 0, 0, .5)',
      width:              20,
      height:             20,
      '&.isUserLocation': {
        color: 'rgba(84,159,184,0.5)',

        width:  40,
        height: 40,
      },
    },
    iconButton: {
      //zIndex:   1000111,
      position: 'relative',
      top:      -20,
      left:     -20,
    },
  }
));

function hasActiveDeal(deals: IApiDeal[]): boolean {
  return deals.some(deal => {
    const { validFrom, validTo } = deal.date,
          now                    = Date.now();

    return validFrom < now && validTo > now;
  });
}

type Props = {
  selected: boolean;
  lat: number;
  lng: number;
  deals: IApiDeal[];
  news: IApiDeal[];
  onClick: () => void;
  type: MapType;
};

const SwitchMapMarker: React.FunctionComponent<Props> = (
  props: Props,
): React.ReactElement<Props> => {
  const { selected, type, deals, news } = props;
  const active                          = hasActiveDeal(deals);
  const classes                         = useStyles();

  let zIndex = 100 + i++;
  if (selected) {
    zIndex += 1000;
  }

  if ((type === MapType.DEALS && deals.length !== 0) || (type === MapType.NEWS && news.length === 0 && deals.length !== 0)) {
    return (
      <>
        <DealsIcon
          style={{ zIndex: zIndex }}
          className={
            clsx(classes.icon,
                 'deal',
                 {
                   [classes.secondaryMarker]: type !== MapType.DEALS,
                   [classes.selected]:        selected,
                   [classes.active]:          active,
                 })}
        />
      </>
    );
  }

  if ((type === MapType.NEWS && news.length !== 0) || (type === MapType.DEALS && deals.length === 0 && news.length !== 0)) {
    return (
      <BinocularIcon
        style={{ zIndex: zIndex }}
        className={
          clsx(classes.icon,
               'news',
               {
                 [classes.secondaryMarker]: type !== MapType.NEWS,
                 [classes.selected]:        selected,
                 [classes.active]:          active,
               })}
      />
    );
  }

  return (
    <RestaurantIcon
      className={
        clsx(classes.icon,
             'restaurant',
             {
               [classes.selected]: selected,
               [classes.active]:   active,
               'mapTypeCompany':   type === MapType.COMPANIES,
             })}
    />
  );

};

export const MapMarker: React.FunctionComponent<Props> = (
  props: Props,
): React.ReactElement<Props> => {
  const { onClick } = props;
  const classes     = useStyles();

  return (
    <Paper
      elevation={0}
      className={classes.root}
      onClick={e => {
        e.stopPropagation();
        return onClick();
      }}>

      <SwitchMapMarker {...props}/>
    </Paper>
  );
};

export const MarketMapMarker: React.FunctionComponent<Props> = (
  props: Props,
): React.ReactElement<Props> => {
  const { onClick, type, selected } = props;
  const classes                     = useStyles();

  return (
    <Paper
      elevation={0}
      className={classes.root}
      onClick={e => {
        e.stopPropagation();
        return onClick();
      }}>

      <MarketIcon
        className={
          clsx(classes.icon,
               'restaurant',
               {
                 [classes.selected]: selected,
                 'mapTypeCompany':   type === MapType.MARKETS,
               })}
      />
    </Paper>
  );
};

type SearchLocationMarkerProps = LatLng & { isUserLocation?: boolean };

export const SearchLocationMarker: React.FunctionComponent<SearchLocationMarkerProps> = (
  props: SearchLocationMarkerProps,
): React.ReactElement<LatLng> => {
  const { isUserLocation } = props;
  const [isOpen, setOpen]  = React.useState(false);
  const classes            = useStyles();

  return (
    <Tooltip open={isOpen}
             onClose={() => setTimeout(() => setOpen(false), 1000)}
             title={isUserLocation ? locale.mapView.marker.yourLocation : locale.mapView.marker.searchLocation}>
      <IconButton className={clsx(classes.iconButton)} onClick={() => setOpen(!isOpen)}
                  disableRipple>
        <LensTwoTone className={clsx(classes.icon, classes.location, { isUserLocation })}/>
      </IconButton>
    </Tooltip>
  );
};
