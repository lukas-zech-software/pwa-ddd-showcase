import {
  Card,
  CardContent,
  Checkbox,
  createStyles,
  Grid,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Theme,
  withStyles,
  WithStyles,
}                    from '@material-ui/core';
import {
  DealTags,
  DealTagsDish,
  DealTagsDrinks,
  DealTagsRegion,
  DealTagsType,
}                    from '@my-old-startup/common/enums/DealTags';
import { EnumUtils } from '@my-old-startup/common/enums/EnumUtils';
import { IObject }   from '@my-old-startup/common/interfaces/types';
import { locale }    from '@my-old-startup/frontend-common/locales';
import * as React    from 'react';

const styles = (theme: Theme) => createStyles({
  drawer: {
    width:    '85vw',
    maxWidth: 500,
  },
  heading: {
    fontSize:   theme.typography.pxToRem(15),
    flexBasis:  '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color:    theme.palette.text.secondary,
  },
  listItem: {
    paddingLeft:  0,
    paddingRight: 0,
  },
  listItemText: {
    padding: 0,
  },
  tagGridContent: {
    paddingBottom: '0 !important',
  },
  tagGrid: {
    minHeight:                    theme.spacing(44),
    [theme.breakpoints.up('md')]: {
      minHeight: theme.spacing(22),
    },
  },
  buttonItem: {
    textAlign: 'center',
  },
  categoryButton: {
    width: '100%',
  },
  applyButton: {
    width: '100%',
  },
  itemCardContent: {
    padding: 0,
  },
});

type Props = WithStyles<typeof styles> & {
  selectedTags: DealTags[];
  onTagsChange(deal: DealTags[]): void;
};

type Category = 'region' | 'dish' | 'type' | 'drinks';

type State = {
  category: Category;
};

class _TagPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      category: 'region',
    };
  }

  public getCategoryItems(): React.ReactNode {
    const { category } = this.state;

    switch (category) {
      default:
      case 'region':
        return this.getMenuItems(DealTagsRegion, locale.tags.DealTagsRegion);
      case 'dish':
        return this.getMenuItems(DealTagsDish, locale.tags.DealTagsDish);
      case 'type':
        return this.getMenuItems(DealTagsType, locale.tags.DealTagsType);
      case 'drinks':
        return this.getMenuItems(DealTagsDrinks, locale.tags.DealTagsDrinks);
    }
  }

  public render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <Card elevation={0}>
        <CardContent className={classes.itemCardContent}>
          <Tabs
            value={this.state.category}
            onChange={(e, v) => {
              this.setCategory(v);
            }}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label={locale.tags.DealTagsRegion.header} value="region"/>
            <Tab label={locale.tags.DealTagsDish.header} value="dish"/>
            <Tab label={locale.tags.DealTagsType.header} value="type"/>
            <Tab label={locale.tags.DealTagsDrinks.header} value="drinks"/>
          </Tabs>
        </CardContent>
        <CardContent className={classes.tagGridContent}>
          {this.getCategoryItems()}
        </CardContent>
      </Card>
    );
  }

  private setCategory(category: Category): void {
    this.setState({
      category,
    });
  }

  private selectTag(tag: DealTags, index: number): void {
    const { selectedTags, onTagsChange } = this.props;

    if (index !== -1) {
      const array = [...selectedTags];
      array.splice(index, 1);
      onTagsChange(array as any);
    } else {
      onTagsChange([...selectedTags, tag] as any);
    }
  }

  private getMenuItems(
    kind: object,
    tagLocale: { header: string; values: IObject<string> },
  ): React.ReactNode {
    const tags                      = EnumUtils.getKeys(kind).sort((a, b) => tagLocale.values[a].localeCompare(tagLocale.values[b]));
    const { classes, selectedTags } = this.props;

    if (tags.length === 0) {
      return null;
    }

    return (
      <Grid container spacing={0} className={classes.tagGrid}>
        {tags
          .map((tag: any, i) => {
            const checkedIndex = selectedTags.indexOf(tag);
            const isChecked = checkedIndex !== -1;
            const maxSelected = selectedTags.length >= 3;
            const disabled = maxSelected && isChecked === false;

            return (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <ListItem
                  key={tag}
                  value={tag}
                  className={classes.listItem}
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }

                    this.selectTag(tag, checkedIndex);
                  }}>
                  <Checkbox color="secondary" checked={isChecked}/>
                  <ListItemText
                    primary={tagLocale.values[tag]}
                    className={classes.listItemText}
                  />
                </ListItem>
              </Grid>
            );
          })}

      </Grid>
    );
  }
}

export const TagPicker = withStyles(styles)(_TagPicker);
