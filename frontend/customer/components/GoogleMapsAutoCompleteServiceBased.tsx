/* eslint-disable @typescript-eslint/tslint/config */
import {
  createStyles,
  TextField,
  withStyles,
  WithStyles,
}                                         from '@material-ui/core';
import { grey }                           from '@material-ui/core/colors';
import { TextFieldProps }                 from '@material-ui/core/TextField';
import { Loading }                        from '@my-old-startup/frontend-common/components/Loading';
import { locale }                         from '@my-old-startup/frontend-common/locales';
import { globalMessageService }           from '@my-old-startup/frontend-common/services/GlobalMessageService';
import clsx                               from 'clsx';
import * as React                         from 'react';
import PlacesAutocomplete, { Suggestion } from 'react-places-autocomplete';
import { loadGoogleMapsApi }              from '../common/GoogleMapsLoaderService';
import { locale as customerLocale }       from '../common/locales';

const styles = () => createStyles(
  {
    loading:        {
      position: 'relative',
      left:     '50%',
    },
    center:         {
      position: 'absolute',
      left:     '50%',
      top:      '40%',
    },
    locationSearch: {
      '& .MuiInputBase-input': { color: grey[600] + ' !important' },
    },
  },
);

type PropsWithStyles = WithStyles<typeof styles> & {
  initialAddress?: string;
  textFieldProps?: Partial<TextFieldProps>;
  onSuggestions: (suggestions: readonly Suggestion[], isLoading: boolean, suggestionItemProps: Function) => void;
  onValueChange(address: string | undefined): void;
};

type State = {
  address: string;
  retry: number;
  mounted: boolean;
};

class _GoogleMapsAutoCompleteServiceBased extends React.Component<PropsWithStyles, State> {
  constructor(props: PropsWithStyles) {
    super(props);
    this.state = {
      address: props.initialAddress || '',
      retry:   0,
      mounted: false,
    };
  }

  public componentDidMount(): void {
    loadGoogleMapsApi().then(() => {
      this.setState({ mounted: true });
    });
  }

  public componentDidUpdate(prevProps: PropsWithStyles): void {
    if (prevProps.initialAddress !== this.props.initialAddress) {
      this.setState({ address: this.props.initialAddress || '' });
    }
  }

  public render(): React.ReactNode {
    if (!this.state.mounted) {
      return <Loading/>;
    }

    const { textFieldProps, classes } = this.props;
    const isLocationSearch            = customerLocale.search.surrounding === this.state.address;

    let address = this.state.address;
    if (!address || address === 'undefined') {
      address = '';
    }
    return (
      <PlacesAutocomplete
        value={address}
        onChange={(address: string) => this.setState({ address })}
        onError={() => {
          globalMessageService.pushMessage({
                                             message: locale.common.errors.autoCompleteError,
                                             variant: 'disabled',
                                           });
        }}
        onSelect={address => {
          this.props.onValueChange(address);
          this.setState({ address });
        }}
        debounce={500}
        shouldFetchSuggestions={this.state.address.length >= 2}
        searchOptions={{
          componentRestrictions: {
            country: ['de'],
          },
          // do not use sessionTokens. per request is cheaper with debounce
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          this.props.onSuggestions(suggestions, loading, getSuggestionItemProps);

          return (
            <TextField
              className={clsx({ [classes.locationSearch]: isLocationSearch })}
              InputProps={{
                disableUnderline: true,
                ...textFieldProps,
              } as unknown as any}
              fullWidth
              autoFocus
              onFocus={(e) => {
                this.setState({ address: '' });
              }}
              {...getInputProps()}
              type="search"
            />
          );
        }}
      </PlacesAutocomplete>
    );
  }
}

export const GoogleMapsAutoCompleteServiceBased = withStyles(styles)(_GoogleMapsAutoCompleteServiceBased);
