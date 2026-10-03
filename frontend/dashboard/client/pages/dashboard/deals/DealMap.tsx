import { createStyles, IconButton, InputBase, Paper, Theme, withStyles, WithStyles } from '@material-ui/core';
import { Search }                                                                    from '@material-ui/icons';
import { HttpStatusCode }
  from '@my-old-startup/common/http/HttpStatusCode';
import { IApiCompanyLocation }    from '@my-old-startup/common/interfaces';
import { GeoPoint }               from '@my-old-startup/common/interfaces/types';
import { DASHBOARD_MAPS_OPTIONS } from '@my-old-startup/frontend-common/constants';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { getJsonFromResponse }    from '@my-old-startup/frontend-common/services/RequestService';
import GoogleMapReact, { Coords } from 'google-map-react';
import React                      from 'react';
import { locale }                 from '../../../common/locales';

const SMALL_LOGO = 'https://storage.googleapis.com/static.my-old-startups-domain.de/images/deal_map_marker.png';

const MAP_STYLE = [
  {
    'featureType': 'administrative',
    'elementType': 'geometry',
    'stylers':     [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'poi',
    'stylers':     [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road',
    'elementType': 'labels.icon',
    'stylers':     [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'transit',
    'stylers':     [
      {
        'visibility': 'off',
      },
    ],
  },
];

const MAP_MARKER_SIZE = 40;
// TODO: Do we need to accept coords here?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MapMarker       = (props: Coords) => <img alt="my-old-startups-domain Logo"
                                                src={SMALL_LOGO}
                                                style={{
                                                  width:           MAP_MARKER_SIZE,
                                                  marginTop:       -MAP_MARKER_SIZE / 2,
                                                  marginLeft:      -MAP_MARKER_SIZE / 2,
                                                  backgroundColor: 'white',
                                                  borderRadius:    8,
                                                  padding:         4,
                                                }}/>;

const styles = (theme: Theme) => createStyles({
  searchContainer: {
    height: 0,
  },
  root: {
    padding:    '2px 4px',
    display:    'flex',
    alignItems: 'center',
    width:      '90%',

    position: 'relative',
    margin:   '0 auto',
    top:      theme.spacing(1),
    zIndex:   100,
  },
  input: {
    padding: theme.spacing(.5),
  },
  iconButton: {
    padding: 10,
  },

});

type State = {
  marker: GeoPoint | undefined;
  searchValue: string | undefined;
};

type Props = WithStyles<typeof styles> & {
  companyLocation: IApiCompanyLocation;

  dealLocation?: GeoPoint;

  onMarkerSet(geoPoint: GeoPoint, address: string): void;
};

class _DealMap extends React.Component<Props, State> {
  private geocoder: google.maps.Geocoder | undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      marker:      props.dealLocation,
      searchValue: '',
    };
  }

  public render(): JSX.Element {

    const { marker, searchValue }      = this.state;
    const { companyLocation, classes } = this.props;

    return (
      <>
        <div className={classes.searchContainer}>
          <Paper className={classes.root} elevation={1}>
            {/* TODO: Try to get autocomplete working */}
            <InputBase className={classes.input}
                       placeholder={locale.dashboard.dealsPage.location.searchInput}
                       value={searchValue}
                       onKeyPress={e => e.key === 'Enter' && this.onSearch()}
                       onChange={e => this.setState({ searchValue: e.target.value })}
                       fullWidth
                       endAdornment={(
                         <IconButton className={classes.iconButton} onClick={() => this.onSearch()}>
                           <Search/>
                         </IconButton>
                       )}
            />

          </Paper>
        </div>

        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={this.initGeocoder}
          defaultCenter={companyLocation}
          center={marker || companyLocation}
          defaultZoom={15}
          bootstrapURLKeys={DASHBOARD_MAPS_OPTIONS}
          onClick={(value) => this.setMarker(value.lat, value.lng)}
          options={{
            styles:                MAP_STYLE,
            fullscreenControl:     false,
            mapTypeControl:        true,
            mapTypeControlOptions: {
              mapTypeControlStyle: 2, // google.maps.MapTypeControlStyle.DROPDOWN_MENU
              position:            6, // google.maps.ControlPosition.LEFT_BOTTOM
            },
          }}
        >
          {marker && <MapMarker
            lat={marker.lat}
            lng={marker.lng}
          />}
        </GoogleMapReact>
      </>
    );
  }

  private initGeocoder = ({ maps }: any) => {
    (window as any).maps = maps;
    this.geocoder        = new maps.Geocoder();
  };

  private async setMarker(lat: number, lng: number, autoCompleteAddress?: string): Promise<void> {
    const address = autoCompleteAddress || await this.getAddress(lat, lng);
    this.props.onMarkerSet({ lat, lng }, address);
    this.setState({ marker: { lat, lng }, searchValue: address });
  }

  private async getAddress(lat: number, lng: number): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/tslint/config
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${DASHBOARD_MAPS_OPTIONS.key}&result_type=street_address|route|intersection`;

    const response = await fetch(url);
    if (response.status === HttpStatusCode.OK) {
      const json = await getJsonFromResponse<any>(response);
      if (json && json.status === 'OK' && json.results.length !== 0) {
        const results: google.maps.GeocoderResult[] = json.results;
        const geocoderAddressComponents             = results[0].address_components;

        const routeComponent        = geocoderAddressComponents.find(x => x.types.includes('route'));
        const streetNumberComponent = geocoderAddressComponents.find(x => x.types.includes('street_number'));

        const route        = routeComponent ? routeComponent.long_name : undefined;
        const streetNumber = streetNumberComponent ? streetNumberComponent.long_name : '';

        if (routeComponent && streetNumberComponent) {
          return `${route} ${streetNumber}`;
        }
      }
    }

    globalMessageService.pushMessage({
      message: commonLocale.common.errors.mapClickAddressError,
      variant: 'error',
    });

    return '';
  }

  private onSearch(): void {

    const request: google.maps.GeocoderRequest = {
      address:               this.state.searchValue,
      region:                'DE',
    };

    if (this.geocoder) {
      this.geocoder.geocode(request, (result, status: any) => {
        if (status === 'OK') {
          const location = result[0].geometry.location;
          const lat      = location.lat(), lng = location.lng();

          void this.setMarker(lat, lng, result[0].formatted_address);
        }
      });
    }
  }
}

export const DealMap = withStyles(styles)(_DealMap);
