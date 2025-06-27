import {
  createStyles,
  IconButton,
  NoSsr,
  Paper,
  Theme,
  Typography,
  WithStyles,
  withStyles,
  withWidth,
}                                             from '@material-ui/core';
import { WithWidthProps }                     from '@material-ui/core/withWidth';
import {
  MyLocation,
  NavigationOutlined,
}                                             from '@material-ui/icons';
import SearchIcon                             from '@material-ui/icons/Search';
import clsx                                   from 'clsx';
import {
  reaction,
  toJS,
  transaction,
} from 'mobx';
import { observer }                           from 'mobx-react';
import * as React                             from 'react';
import { locale }                             from '../../common/locales';
import { searchService }                      from '../../services/SearchService';
import { locationStore }                      from '../../store/LocationStore';
import { searchStore }                        from '../../store/SearchStore';
import { suggestionStore }                    from '../../store/SuggestionStore';
import { GoogleMapsAutoCompleteServiceBased } from '../GoogleMapsAutoCompleteServiceBased';
import { SearchInputSuggestions }             from './SearchInputSuggestions';
import { SearchNavigationButton }             from './SearchNavigationButton';

interface OverridableComponent {
  component: any;
}

const styles = (theme: Theme) => createStyles(
  {
    root:                 {
      padding:    '2px 4px',
      display:    'flex',
      alignItems: 'center',

      position: 'relative',
      margin:   `${theme.spacing(1)}px auto`,
      zIndex:   200,

      '&.simple': {
        paddingLeft: theme.spacing(1),
      },
    },
    input:                {
      marginLeft: theme.spacing(1),
      flex:       1,
    },
    simpleInputRoot:      {
      fontSize: theme.spacing(2.5),
    },
    iconButton:           {
      paddingTop: theme.spacing(2),

      '&:hover': {
        background: 'none',
      },

      '&.simple': {
        color:        theme.palette.grey[800],
        borderRadius: theme.spacing(1) / 2,
        padding:      theme.spacing(2),
        margin:       '-2px -4px -2px 0',
      },
    },
    navIconButton:        {
      marginTop: -4,
      transform: 'rotate(30deg)',
      fontSize:  '1.25rem',
    },
    locationSearchAvatar: {
      background: theme.palette.secondary.main,
    },
  },
);

type Props = {
  onMenuClick?: () => void;
  onSearchInputClick?: (isOpen: boolean) => void;
  simple?: boolean;
  isList?: boolean;
  paperClass?: string;
  iconButtonClass?: string;
} & WithStyles<typeof styles> & WithWidthProps;

type State = {
  isFocused: boolean;
  searchText?: string;
};

@observer
class _SearchInput extends React.Component<Props, State> {
  constructor(props: Readonly<Props & WithStyles<typeof styles>>) {
    super(props);
    this.state = {
      isFocused:    false,
      searchText:   '',
    };

    reaction(
      () => locationStore.location && locationStore.location.address,
      () => this.setState({ searchText: this.getState().searchText }),
    );
  }

  public render(): React.ReactNode {
    const { classes, onMenuClick, simple, paperClass, iconButtonClass, isList } = this.props;

    if (searchStore.isSearchOpen === false) {
      return (
        <>
          <IconButton
            disableRipple
            disableFocusRipple
            disableTouchRipple
            className={clsx(iconButtonClass, classes.iconButton, { simple })}
            onClick={() => this.openSearch()}
            aria-label="Search"
          >
            <NavigationOutlined className={clsx(classes.navIconButton)}/>
            <Typography variant="h6" component={(isList ? 'h1' : 'h2') as any}>
              {this.getState().searchText}
            </Typography>
          </IconButton>
        </>
      );
    }

    return (
      <>
        <Paper className={clsx(paperClass, classes.root, { simple })} elevation={1}>
          {onMenuClick && <SearchNavigationButton onMenuClick={() => {
            searchStore.setIsSearchOpen(false);
            onMenuClick();
          }}/>}

          <GoogleMapsAutoCompleteServiceBased
            initialAddress={locationStore.location.address}
            onValueChange={(searchText) => {
              this.setState({ searchText }, () => {
                this.closeSearch();
                void this.searchByText();
              });
            }}
            onSuggestions={(suggestions, isLoading, getSuggestionItemProps) => {
              transaction(() => {
                suggestionStore.setCurrentSuggestions(suggestions, getSuggestionItemProps);
                suggestionStore.setLoading(isLoading);
              });
            }}
            textFieldProps={{
              disabled:    searchStore.isLoading,
              placeholder: locale.search.input,
              onSelect:    () => this.openSearch(),
              classes:     { root: clsx({ [classes.simpleInputRoot]: simple }) },
            }}
          />


          <NoSsr>
            {!simple && (
              <IconButton
                className={clsx(iconButtonClass, classes.iconButton, { simple })}
                onClick={() => this.searchByText()}
                aria-label="Search"
              >
                <SearchIcon/>
              </IconButton>
            )}

            {simple && (
              <IconButton
                className={clsx(iconButtonClass, classes.iconButton, { simple })}
                onClick={() => searchService.searchByLocation()}
              >
                <MyLocation/>
              </IconButton>
            )}
          </NoSsr>
        </Paper>

        {searchStore.isSearchOpen && (
          <SearchInputSuggestions
            simple={simple}
            onClose={() => this.closeSearch()}
          />
        )}
      </>
    );
  }

  private getState(): State {
    // If a city was search, address and city will be the same
    if (locationStore.location.city != undefined &&locationStore.location.city === locationStore.location.address) {
      return {
        isFocused:  false,
        searchText: `${locationStore.location.city}`,
      };
    }

    const { width } = this.props;

    let address = locationStore.location.address || '';
    if (width === 'xs' && address.length > 15) {
      address = address.slice(0, 15) + '...';
    }

    let searchText = address.replace(', Deutschland', '');
    if (locationStore.location.city != undefined && locationStore.location.city.length !== 0) {
      searchText = `${locationStore.location.city}, ${address}`;
    }
    // If both are empty the search was done by coordinates and we do not have address information
    if (searchText === undefined || searchText.length === 0) {
      return {
        isFocused:  false,
        searchText: locale.search.surrounding,
      };
    }
    return {
      isFocused:    false,
      searchText:   searchText,
    };
  }

  private openSearch(): void {
    if (this.props.onSearchInputClick) {
      this.props.onSearchInputClick(true);
    }
    searchStore.setIsSearchOpen(true);
  }

  private closeSearch(): void {
    if (this.props.onSearchInputClick) {
      this.props.onSearchInputClick(false);
    }

    searchStore.setIsSearchOpen(false);
  }

  private async searchByText(): Promise<void> {
    if (this.state.searchText) {
      await searchService.searchByText(this.state.searchText);
    }
    this.closeSearch();
  }
}

export const SearchInput = withWidth()(withStyles(styles)(_SearchInput));
