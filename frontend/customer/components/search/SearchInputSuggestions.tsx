import {
  Avatar,
  CircularProgress,
  createStyles,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper,
  Slide,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                          from '@material-ui/core';
import {
  ArrowBack,
  LocationSearching,
  Place,
}                          from '@material-ui/icons';
import { IS_SERVER }       from '@my-old-startup/frontend-common/constants';
import clsx                from 'clsx';
import { observer }        from 'mobx-react';
import * as React          from 'react';
import { locale }          from '../../common/locales';
import { searchService }   from '../../services/SearchService';
import { suggestionStore } from '../../store/SuggestionStore';

const styles = (theme: Theme) => createStyles(
  {
    suggestionListPaper:  {
      marginBottom: theme.spacing(1),
    },
    suggestionItemList:   {
      background:   theme.palette.background.paper,
      boxShadow:    theme.shadows[4],
      marginBottom: theme.spacing(1),
    },
    suggestionItemPaper:  {
      borderRadius: theme.shape.borderRadius,
      background:   theme.palette.background.paper,
      '&.last':     {},
    },
    suggestionContainer:  {
      height:     '100vh',
      marginTop:  theme.spacing(2),
      background: theme.palette.background.paper,
      '&.simple': {
        height:     'auto',
        background: 'transparent',
      },
    },
    locationSearchAvatar: {
      background: theme.palette.secondary.main,
    },
    button:               {
      width: '100%',
    },
    loadingPaper:         {
      padding: theme.spacing(1),
      height:  theme.spacing(20),
    },
    loadingText:          {
      paddingTop: theme.spacing(2),
      padding:    theme.spacing(1),
    },
    loadingPaperGrid:     {
      height: theme.spacing(20),
    },
  },
);

type Props = {
  onClose: () => void;
  simple?: boolean;
};

type State = {
  isSearching: boolean;
};

@observer
// eslint-disable-next-line @typescript-eslint/class-name-casing
class _SearchInputSuggestions extends React.Component<Props & WithStyles<typeof styles>, State> {

  constructor(props: Readonly<Props & WithStyles<typeof styles>>) {
    super(props);
    this.state = {
      isSearching: false,
    };
  }

  public render(): React.ReactNode {
    const { classes, onClose, simple } = this.props;

    if (simple && suggestionStore.currentSuggestions.length === 0) {
      return null;
    }

    if (IS_SERVER === false) {
      setTimeout(
        () => {
          // Always scroll to top to view the search bar
          window.scrollTo(0, 0);
        },
        100,
      );
    }

    return (
      <Slide in mountOnEnter unmountOnExit direction="up">
        <div
          className={clsx(classes.suggestionContainer, {
            simple,
          })}
          onClick={() => onClose()}
        >
          {this.getPapers()}
        </div>
      </Slide>
    );
  }

  private async searchByLocation(): Promise<void> {
    this.setState({ isSearching: true });

    await searchService.searchByLocation();

    this.setState({ isSearching: false });
    this.props.onClose();
  }

  private getLoadingPaper(): React.ReactNode {
    const { classes } = this.props;

    return (
      <Paper elevation={1} className={classes.loadingPaper} onClick={e => e.stopPropagation()}>
        <Grid container justify="center" alignContent="center" className={classes.loadingPaperGrid}>
          <Grid item>
            <CircularProgress/>
          </Grid>
          <Grid item xs={12}/>
          <Grid item>
            <Typography className={classes.loadingText} variant="subtitle2">
              {/*TODO:localize:en*/}
              Suche ...
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  private getLocationPaper(): React.ReactNode {
    const { classes, simple } = this.props;

    if (simple) {
      return null;
    }

    return (
      <Paper elevation={1}
             className={classes.suggestionListPaper}
             onClick={e => e.stopPropagation()}>
        <List>
          <ListItem onClick={() => this.searchByLocation()}>
            <ListItemAvatar>
              <Avatar alt="Location search" className={classes.locationSearchAvatar}>
                <LocationSearching/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={locale.search.suggestions.location.primary}
              secondary={locale.search.suggestions.location.secondary}
            />
          </ListItem>
        </List>
      </Paper>
    );
  }

  private getSuggestionPapers(): React.ReactNode {
    const { classes, simple } = this.props;
    const hasResults          = suggestionStore.currentSuggestions.length !== 0;
    const maxResults          = simple ? 2 : suggestionStore.currentSuggestions.length - 1;

    return hasResults && (
      <List className={classes.suggestionItemList}>
        {suggestionStore.currentSuggestions.slice(0, maxResults).map((suggestion, i) => (
          <ListItem
            key={i}
            button
            {...suggestionStore.SuggestionItemProps(suggestion)}
            className={clsx(classes.suggestionItemPaper, { last: i === maxResults - 1 })}>
            <ListItemIcon>
              <Place/>
            </ListItemIcon>
            <ListItemText primary={suggestion.description.replace(', Deutschland', '')}/>
          </ListItem>
        ))}
      </List>
    );
  }

  private getBackPaper(): React.ReactNode {
    const { classes, onClose, simple } = this.props;

    if (simple) {
      return null;
    }

    return (
      <Paper elevation={1}
             className={classes.suggestionListPaper}
             onClick={e => e.stopPropagation()}>
        <List>
          <ListItem onClick={() => onClose()}>
            <ListItemAvatar>
              <Avatar alt="Back">
                <ArrowBack/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={locale.search.suggestions.back}
            />
          </ListItem>
        </List>
      </Paper>
    );
  }

  private getPapers(): React.ReactNode {
    if (suggestionStore.isLoading === true || this.state.isSearching) {
      return this.getLoadingPaper();
    }

    return (
      <>
        {this.getLocationPaper()}

        <div>
          {this.getSuggestionPapers()}
        </div>

        {this.getBackPaper()}
      </>
    );
  }
}

export const SearchInputSuggestions = withStyles(styles)(_SearchInputSuggestions);
