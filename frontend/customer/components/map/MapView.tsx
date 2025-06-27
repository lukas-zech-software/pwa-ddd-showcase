import {
  createStyles,
  IconButton,
  Snackbar,
  Theme,
  WithStyles,
  withStyles,
  withWidth,
}                         from '@material-ui/core';
import { WithWidthProps } from '@material-ui/core/withWidth';
import { MyLocation }     from '@material-ui/icons';
import { LatLng }         from '@my-old-startup/common/interfaces/common';
import { Loading }        from '@my-old-startup/frontend-common/components';
import {
  IS_IOS,
  IS_PWA,
}                         from '@my-old-startup/frontend-common/constants';
import { observer }       from 'mobx-react';
import * as React         from 'react';
import { RefObject }      from 'react';

import {
  APP_HEADER_HEIGHT,
  BOTTOM_NAV_HEIGHT,
}                          from '../../common/constants';
import { MapType }         from '../../common/types';
import { searchService }   from '../../services/SearchService';
import { locationStore }   from '../../store/LocationStore';
import { searchStore }     from '../../store/SearchStore';
import { EmptyCardCorona } from './EmptyCardCorona';
import { MapCardCompany }  from './MapCardCompany';
import {
  getInstance,
  mapService,
}                          from './MapService';

function getLatLngString({ lat, lng }: LatLng): string {
  return lat.toString() + lng.toString();
}

function getCompanyLocationString({ lat, lng }: LatLng, companyId: string): string {
  return companyId + lat.toString() + lng.toString();
}

const iOSFix = (IS_IOS && IS_PWA) ? -14 : 0;
const styles = (theme: Theme) => createStyles(
  {
    suggestionListPaper: {
      padding: 0,
    },
    button:              {
      width:   '100%',
      padding: 0,
    },
    root:                {
      height: '100%',
    },
    mapsRoot:            {
      width:    '100%',
      height:   '100%',
      margin:   0,
      padding:  0,
      position: 'relative',
    },
    snackbar:            {
      maxWidth: 400,
      top:      (APP_HEADER_HEIGHT + 2) * theme.spacing(1) + 'px !important',
    },
    backToLocation:      {
      background:                     theme.palette.background.paper + ' !important',
      borderRadius:                   '50%',
      position:                       'absolute',
      bottom:                         theme.spacing(BOTTOM_NAV_HEIGHT + 14),
      right:                          6,
      [theme.breakpoints.down('sm')]: {
        bottom: theme.spacing(BOTTOM_NAV_HEIGHT + 2),
      },
    },
  },
);

type Props = {
  type: MapType;
};

type State = {
  selectedCompanyId: string | undefined;
  hideSuggestionCard: boolean;
};

@observer
// eslint-disable-next-line @typescript-eslint/class-name-casing
class _MapView extends React.Component<Props & WithStyles<typeof styles> & WithWidthProps,
  State> {
  private mapRef: RefObject<HTMLDivElement>;

  constructor(props: Readonly<Props & WithStyles<typeof styles>>) {
    super(props);
    this.state  = {
      hideSuggestionCard: false,
      selectedCompanyId:  undefined,
    };
    this.mapRef = React.createRef();
  }

  async componentDidMount(): Promise<void> {
    const mapElement = await getInstance(this.props.width, (companyId) => {
      this.onMarkerClick(companyId);
    });

    if (this.mapRef.current) {
      this.mapRef.current.appendChild(mapElement);
    }

    if (mapService && mapService.isInit) {
      mapService.isMounted = true;
    }

    if (searchService.isMapExtendedSearch === false) {
      void searchService.search();
    }
  }

  public componentWillUnmount(): void {
    mapService.isMounted = false;
  }

  public render(): React.ReactNode {
    // const takenLocations                                        = new Set<string>();
    const { classes }           = this.props;
    const { selectedCompanyId } = this.state;

    return (
      <>
        <div
          ref={this.mapRef}
          className={classes.mapsRoot}
          onClick={(e) => {
            if ((e.target as any).no_click) {
              return;
            }
            this.setSelected(undefined);
          }}
        />

        <IconButton key={`BackToLocation`}
                    className={classes.backToLocation}
                    onClick={() => mapService.panTo(locationStore.location.coordinates)}>
          <MyLocation/>
        </IconButton>


        {searchStore.hasLoadedOnce === false || searchStore.isLoading === true && (
          <Loading center/>
        )}

        {searchStore.hasLoadedOnce === true && searchStore.isSearchOpen === false && searchStore.currentCompanyResults.length === 0 && searchStore.isLoading === false && (
          <Snackbar
            className={classes.snackbar}
            anchorOrigin={{
              horizontal: 'center',
              vertical:   'top',
            }}
            open
          >
            <EmptyCardCorona/>
          </Snackbar>
        )}

        {selectedCompanyId && (
          <MapCardCompany
            onClose={() => this.setSelected(undefined)}
            companyId={selectedCompanyId}/>
        )}
      </>
    );
  }

  private onMarkerClick(companyId: string): void {
    const { selectedCompanyId } = this.state;

    const isAlreadySelected = selectedCompanyId && selectedCompanyId === companyId;

    if (isAlreadySelected) {
      this.setSelected(undefined);
    } else {
      this.setSelected(companyId);
    }
  }

  private setSelected(selectedCompanyId: string | undefined) {
    this.setState({ selectedCompanyId });
  }
}

export default withWidth()(withStyles(styles)(_MapView));
