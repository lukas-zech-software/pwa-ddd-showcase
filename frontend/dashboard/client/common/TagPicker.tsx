import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  createStyles,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  Theme,
  withStyles,
  WithStyles,
}                               from '@material-ui/core';
import { SearchRounded }        from '@material-ui/icons';
import AddIcon                  from '@material-ui/icons/Add';
import {
  DealTags,
  DealTagsDish,
  DealTagsDrinks,
  DealTagsRegion,
  DealTagsType,
}                               from '@my-old-startup/common/enums/DealTags';
import { EnumUtils }            from '@my-old-startup/common/enums/EnumUtils';
import { IObject }              from '@my-old-startup/common/interfaces/types';
import { alertColors }          from '@my-old-startup/frontend-common/style';
import clsx                     from 'clsx';
import { isEqual }              from 'lodash';
import React, { PureComponent } from 'react';
import { locale }               from '../../../common/locales';

const MAX_TAG_COUNT = 5;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 600,
    },
  },
};

const styles = (theme: Theme) => createStyles(
  {
    root:              {
      display:  'flex',
      flexWrap: 'wrap',
    },
    label:             {
      color: alertColors(theme).error,
    },
    formControl:       {
      margin:   theme.spacing(1),
      minWidth: 120,
    },
    chips:             {
      display:  'flex',
      flexWrap: 'wrap',
    },
    chip:              {
      margin: theme.spacing(0.25),
    },
    selectRoot: {
      height:    'auto',
      '&:focus': {
        backgroundColor: 'inherit',
      },
    },
    searchInput:       {
      backgroundColor: 'white !important',
    },
    drawerCardContent: {
      height:        '90vh',
      overflowY:     'scroll',
      paddingBottom: 0,
    },
    drawerCardActions: {
      backgroundColor: theme.palette.background.paper,
      boxShadow:       '0px -5px 10px 0px rgba(0,0,0,0.2)',
      flexDirection:   'column-reverse',
      alignItems:      'flex-end',
    },
  },
);

export type Props = {
  selectedTags: DealTags[];

  error?: boolean;

  onTagsChange(tags: DealTags[]): void;
} & WithStyles<typeof styles>;

type State = {
  selectedTags: Set<DealTags>;
  searchText: string;
  isOpen: boolean;
};

class _TagPicker extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedTags: new Set(props.selectedTags),
      searchText:   '',
      isOpen:       false,
    };
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    const selectedTagsProps = Array.from(this.props.selectedTags);
    const selectTagsState   = Array.from(prevState.selectedTags.values());

    if (!isEqual(selectedTagsProps, selectTagsState)) {
      this.setState({ selectedTags: new Set(selectedTagsProps) });
    }
  }

  public render(): React.ReactNode {
    const { classes, error }                   = this.props;
    const { selectedTags, searchText, isOpen } = this.state;
    const noneSelected                         = selectedTags.size === 0;
    const hasMaxSize                           = selectedTags.size >= MAX_TAG_COUNT;

    return (
      <FormControl className={classes.formControl}>
        <FormLabel className={clsx({ [classes.label]: !!error })}
                   htmlFor="select-tags">
          {locale.tags.label}
        </FormLabel>
        <Select
          classes={{ root: classes.selectRoot }}
          multiple
          value={Array.from(selectedTags.values())}
          renderValue={() => this.getSelectedChips()}
          input={<Input id="select-tags"/>}
          open={false}
          MenuProps={MenuProps}
          IconComponent={AddIcon}
          onOpen={() => this.setState({ isOpen: true })}
          onClose={() => this.setState({ isOpen: false })}
        >

        </Select>
        {hasMaxSize && <FormHelperText error>{locale.tags.maxTags}</FormHelperText>}
        {error && noneSelected && <FormHelperText error>{locale.tags.minTags}</FormHelperText>}


        <Drawer
          variant="temporary"
          anchor="right"
          onBackdropClick={() => this.setState({ isOpen: false })}
          open={isOpen}
        >
          <Card elevation={0}>
            <CardContent className={classes.drawerCardContent}>
              <MenuItem
                disableGutters
                key="search"
                className={classes.searchInput}
              >
                <FormControl className={classes.formControl} fullWidth>
                  <Input
                    value={searchText}
                    onChange={e => this.setState({ searchText: e.target.value })}
                    placeholder={locale.tags.placeholder}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchRounded/>
                      </InputAdornment>
                    }/>
                </FormControl>
              </MenuItem>
              <Grid container>
                <Grid item xs={6}>
                  {this.getMenuItems(DealTagsRegion, locale.tags.DealTagsRegion)}
                </Grid>

                <Grid item xs={6}>
                  {this.getMenuItems(DealTagsDish, locale.tags.DealTagsDish)}
                </Grid>

                <Grid item xs={6}>
                  {this.getMenuItems(DealTagsType, locale.tags.DealTagsType)}
                </Grid>

                <Grid item xs={6}>
                  {this.getMenuItems(DealTagsDrinks, locale.tags.DealTagsDrinks)}
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className={classes.drawerCardActions}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.setState({ isOpen: false })}
              >
                Ok
              </Button>
            </CardActions>
          </Card>
        </Drawer>

      </FormControl>
    );
  }

  private handleChange(tag: DealTags): void {
    const selectedTagsSet = this.state.selectedTags;

    if (selectedTagsSet.has(tag)) {
      selectedTagsSet.delete(tag);
    } else {

      if (selectedTagsSet.size >= MAX_TAG_COUNT) {
        return;
      }

      selectedTagsSet.add(tag);
    }

    let selectedTags = Array.from(selectedTagsSet.values());
    selectedTags     = selectedTags.filter(x => x !== undefined);
    this.props.onTagsChange(selectedTags);
    this.setState(
      {
        selectedTags: new Set(selectedTags),
        isOpen:       selectedTags.length < MAX_TAG_COUNT,
      },
    );
  }

  private getSelectedChips(): React.ReactNode {
    const { classes }      = this.props;
    const { selectedTags } = this.state;

    return (
      <div className={classes.chips} onClick={(x) => x.stopPropagation()}>
        {Array.from(selectedTags.values()).map((value, index) => (
          <Chip
            key={index}
            label={locale.deals.table.tags[value]}
            className={classes.chip}
            color="primary"
            onDelete={() => {
              this.handleChange(value);
            }}
          />
        ))}
      </div>
    );
  }

  private getFilteredTags(tagEnum: object): string[] {
    const tagValues = EnumUtils.getKeys(tagEnum);
    return tagValues.filter((x: DealTags) => (
      locale.deals.table.tags[x]
        .toLowerCase()
        .includes(this.state.searchText.toLowerCase())))
      .sort((a, b) => a.localeCompare(b));
  }

  private getMenuItems(kind: object, tagLocale: { header: string; values: IObject<string> }): React.ReactNode {
    const { selectedTags } = this.state;
    const filteredTags     = this.getFilteredTags(kind);
    const hasMaxSize       = selectedTags.size >= MAX_TAG_COUNT;

    if (filteredTags.length === 0) {
      return null;
    }

    return [
      <MenuItem key={tagLocale.header}
                disabled
                divider>
        <ListItemText primary={tagLocale.header}/>
        <Divider/>
      </MenuItem>,
      ...filteredTags.map((tag: any) => (
        <MenuItem key={tag} onClick={() => this.handleChange(tag)}>
          <Checkbox color="primary" disabled={hasMaxSize && !selectedTags.has(tag)}
                    checked={selectedTags.has(tag)}/>
          <ListItemText primary={tagLocale.values[tag]}/>
        </MenuItem>
      )),
    ];

  }
}

export const TagPicker = withStyles(styles)(_TagPicker);
