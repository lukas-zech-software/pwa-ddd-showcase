import {
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Theme,
  withStyles,
  WithStyles,
}                                 from '@material-ui/core';
import { TextFieldProps }         from '@material-ui/core/TextField';
import { Place }                  from '@material-ui/icons';
import React                      from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
}                                 from 'react-places-autocomplete';
import { DASHBOARD_MAPS_OPTIONS } from '../constants';
import { locale }                 from '../locales';
import { globalMessageService }   from '../services/GlobalMessageService';
import { logService }             from '../services/LogService';
import { Loading }                from './Loading';

export function installGoogleMaps(): void {
  if ((window as any).google) {
    return;
  }

  const script = document.createElement('script');
  const mapKey = DASHBOARD_MAPS_OPTIONS.key;

  script.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places&language=de-DE`);
  script.setAttribute('async', 'true');
  document.body.appendChild(script);
}

const styles = (theme: Theme) => createStyles({
                                                loading:  {
                                                  position: 'relative',
                                                  left:     '50%',
                                                },
                                                center:   {
                                                  position: 'absolute',
                                                  left:     '50%',
                                                  top:      '40%',
                                                },
                                                menuItem: {
                                                  border: `1px solid ${theme.palette.divider}`,
                                                },
                                              });

type Props = {
  city?: string | undefined;
  errorMessage?: string | undefined;
  types?: string[];
  textFieldProps?: Partial<TextFieldProps>;
  onValueChange(address: string | undefined, zipCode: string | undefined, city: string | undefined): void;
};

type PropsWithStyles = Props & WithStyles<typeof styles>;

type State = {
  address: string;
  error: string | undefined;
  retry: number;
};

// eslint-disable-next-line @typescript-eslint/class-name-casing
class _GoogleMapsAutoCompleteInput extends React.Component<PropsWithStyles, State> {
  private _ref: any;

  /**
   * Scroll to the form field the first time it shows a validation error
   */
  private scrollToError(errorMessage: string | undefined): void {
    if (errorMessage !== undefined && this._ref.current) {
      setTimeout(
        () => {
          this._ref.current.scrollIntoView(
            {
              behavior: 'smooth',
              block:    'center',
            },
          );
        },
        200,
      );
    }
  }

  constructor(props: PropsWithStyles) {
    super(props);
    this.state = {
      address: '',
      retry:   0,
      error:   undefined,
    };
    this._ref  = React.createRef();
  }

  public componentDidMount(): void {
    installGoogleMaps();
  }

  public render(): React.ReactNode {
    if (!(window as any).google) {
      setTimeout(
        () => {
          this.setState({ retry: this.state.retry + 1 });
        },
        500);

      return <Loading/>;
    }

    const { classes, types, textFieldProps } = this.props;

    this.scrollToError(this.props.errorMessage);

    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={(address: string) => this.setState({ address })}
        onError={(error: string) => {
          logService.error('AutoComplete', error);
          this.setState({ error });
        }}
        onSelect={(x, placeId) => this.handleSelect(x, placeId)}
        debounce={750}
        shouldFetchSuggestions={this.state.address.length >= 4}
        searchOptions={{
          componentRestrictions: {
            country: ['de'],
          },
          types,
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          let errorMessage = this.props.errorMessage;

          if (this.state.error !== undefined) {
            errorMessage = locale.common.errors.autoCompleteError;
          }

          return (
            <>
              <TextField
                ref={this._ref}
                fullWidth
                error={errorMessage !== undefined}
                helperText={errorMessage}
                /*disable autofill dropdown from chrome*/
                {...textFieldProps as any}
                {...getInputProps()}
                autoComplete="new-password"
                type="search"
              />

              {loading && (
                <List>
                  <ListItem className={classes.menuItem}>
                    <ListItemIcon>
                      <Loading/>
                    </ListItemIcon>
                  </ListItem>
                </List>
              )}

              {suggestions.length !== 0 && (
                <List>
                  {suggestions.map((suggestion, i) => (
                                     <ListItem
                                       key={i}
                                       button
                                       className={classes.menuItem} {...getSuggestionItemProps(suggestion)}>
                                       <ListItemIcon>
                                         <Place/>
                                       </ListItemIcon>
                                       <ListItemText primary={suggestion.description}/>
                                     </ListItem>
                                   ),
                  )}
                </List>
              )}
            </>
          );
        }}
      </PlacesAutocomplete>
    );
  }

  protected handleSelect(address: string, placeId: string): void {
    this.setState({ error: undefined });
    let searchPromise: Promise<google.maps.GeocoderResult[]>;

    // prefer placeId if provided
    if (placeId !== undefined) {
      searchPromise = geocodeByPlaceId(placeId);
    } else {
      searchPromise = geocodeByAddress(address);
    }
    searchPromise
      .then(results => {
        const geocoderAddressComponents = results[0].address_components;
        const routeComponent            = geocoderAddressComponents.find(x => x.types.includes('route'));
        const streetNumberComponent     = geocoderAddressComponents.find(x => x.types.includes('street_number'));
        const zipCodeComponent          = geocoderAddressComponents.find(x => x.types.includes('postal_code'));
        const cityComponent             = geocoderAddressComponents.find(x => x.types.includes('locality'));

        const route        = routeComponent ? routeComponent.long_name : undefined;
        const streetNumber = streetNumberComponent ? streetNumberComponent.long_name : '';
        const zipCode      = zipCodeComponent ? zipCodeComponent.long_name : undefined;
        const city         = cityComponent ? cityComponent.long_name : undefined;
        const fullAddress  = `${route} ${streetNumber}`;
        this.props.onValueChange(fullAddress, zipCode, city);
        this.setState({ address: fullAddress });
      })
      .catch(error => {
        logService.error('AutoComplete', error);
        globalMessageService.pushMessage(
          {
            message: locale.common.errors.autoCompleteError,
            variant: 'error',
          },
        );
      });
  }
}

export const GoogleMapsAutoCompleteInput = withStyles(styles)(_GoogleMapsAutoCompleteInput);
