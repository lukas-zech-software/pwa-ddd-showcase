import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Theme,
  WithStyles,
  withStyles,
}                                 from '@material-ui/core';
import {
  DateRange,
  Home,
  Restaurant,
}                                 from '@material-ui/icons';
import { DealTags }               from '@my-old-startup/common/enums/DealTags';
import {
  CompanyType,
  DateFilter,
}                                 from '@my-old-startup/common/enums/types';
import { CompanyFilter }          from '@my-old-startup/common/interfaces/common';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import clsx                       from 'clsx';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import { BOTTOM_NAV_HEIGHT }      from '../../common/constants';
import { locale }                 from '../../common/locales';
import { filterStore }            from '../../store/FilterStore';
import { TagList }                from './TagList';
import { TagPicker }              from './TagPicker';

const styles = (theme: Theme) => createStyles({
  root:              {
    width:    '100%',
    maxWidth: 800,
    margin:   '0 auto',
  },
  filterCard:        {
    width:        '100%',
    margin:       theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  filterCardContent: {
    paddingTop: 0,
  },
  filterCardTags:    {
    marginBottom: theme.spacing(15),
  },
  applyButton:       {
    width: '100%',
  },
  dateButton:        {
    width:  '100%',
    height: '100%',
  },
  findButton:        {
    width: '100%',
  },
  findCard:          {
    width:    '100%',
    maxWidth: 800 - theme.spacing(2),

    display:    'flex',
    alignItems: 'center',
    margin:     '0 auto',

    overflow: 'hidden',
    position: 'sticky',
    padding:  theme.spacing(2),
    bottom:   theme.spacing(BOTTOM_NAV_HEIGHT),
    border:   `1px solid ${theme.palette.divider}`,
  },
  dateGrid:          {
    flexGrow: 1,
  },
  formControl:       {
    margin: theme.spacing(1),
  },
});

type Props = WithStyles<typeof styles> & {};

@observer
class _FilterView extends React.Component<Props> {
  public componentWillUnmount(): void {
    if (filterStore.isDirty) {
      filterStore.showIsDirtyDialog = true;
    }
  }

  public getDateFilter(): React.ReactNode {
    const { classes } = this.props;

    return (
      <Card elevation={1} className={classes.filterCard}>
        <CardHeader
          avatar={
            <Avatar>
              <DateRange/>
            </Avatar>
          }
          title={locale.filterView.filters.date.title}
        />

        <CardContent>
          <Grid container spacing={2} justify={'center'}>
            <Grid item xs={4} className={classes.dateGrid}>
              <Button
                className={classes.dateButton}
                color={this.getDateButtonColor(DateFilter.TODAY)}
                onClick={() => this.setDateFilter(DateFilter.TODAY)}
                variant="contained"
              >
                {locale.filterView.filters.date.today}
              </Button>
            </Grid>
            <Grid item xs={4} className={classes.dateGrid}>
              <Button
                className={classes.dateButton}
                color={this.getDateButtonColor(DateFilter.TOMORROW)}
                onClick={() => this.setDateFilter(DateFilter.TOMORROW)}
                variant="contained"
              >
                {locale.filterView.filters.date.tomorrow}
              </Button>
            </Grid>
            <Grid item xs={4} className={classes.dateGrid}>
              <Button
                className={classes.dateButton}
                color={this.getDateButtonColor(DateFilter.REST_OF_WEEK)}
                onClick={() => this.setDateFilter(DateFilter.REST_OF_WEEK)}
                variant="contained"
              >
                {locale.filterView.filters.date.week}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  public getCompanyTypeFilter(): React.ReactNode {
    const { classes }       = this.props;
    const companyTypeFilter = this.getCurrentFilter().companyTypes || [];

    function CompanyTypeCheckbox(props: { type: CompanyType }): React.ReactElement<any> {
      const { type }     = props;
      const checkedIndex = companyTypeFilter.indexOf(type);

      return (
        <Checkbox
          checked={checkedIndex !== -1}
          onChange={() => {
            if (checkedIndex !== -1) {
              const array = [...companyTypeFilter];
              array.splice(checkedIndex, 1);
              filterStore.setCompanyType(array as any);
            } else {
              filterStore.setCompanyType([...companyTypeFilter, type] as any);
            }
          }}
        />
      );
    }

    return (
      <Card elevation={1} className={classes.filterCard}>
        <CardHeader
          avatar={
            <Avatar>
              <Home/>
            </Avatar>
          }
          title={locale.filterView.filters.companyType.title}
        />

        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    control={<CompanyTypeCheckbox type={CompanyType.RESTAURANT}/>}
                    label={commonLocale.company.types[CompanyType.RESTAURANT]}
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    control={<CompanyTypeCheckbox type={CompanyType.CAFE}/>}
                    label={commonLocale.company.types[CompanyType.CAFE]}
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    control={<CompanyTypeCheckbox type={CompanyType.FOODTRUCK}/>}
                    label={commonLocale.company.types[CompanyType.FOODTRUCK]}
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    control={<CompanyTypeCheckbox type={CompanyType.IMBISS}/>}
                    label={commonLocale.company.types[CompanyType.IMBISS]}
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    control={<CompanyTypeCheckbox type={CompanyType.BAR}/>}
                    label={commonLocale.company.types[CompanyType.BAR]}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  public getTagFilter(): React.ReactNode {
    const { classes } = this.props;

    const selectedTags = this.getCurrentFilter().dealTags || [];

    return (
      <Card elevation={1} className={clsx(classes.filterCard, classes.filterCardTags)}>
        <CardHeader
          avatar={
            <Avatar>
              <Restaurant/>
            </Avatar>
          }
          title={locale.filterView.filters.tags.title}
        />

        <CardContent className={classes.filterCardContent}>
          <TagPicker
            selectedTags={selectedTags}
            onTagsChange={tags => this.setTagFilter(tags)}
          />
          {selectedTags.length !== 0 && (
            <TagList
              selectedTags={selectedTags}
              onTagsChange={tags => this.setTagFilter(tags)}
            />)
          }
        </CardContent>
      </Card>
    );
  }

  public render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Grid
          container
          spacing={0}
          alignContent="center"
          justify="center"
          className={clsx(classes.root)}
        >
          <Card elevation={1} className={classes.filterCard}>
            <CardHeader
              title={locale.filterView.header.title}
              subheader={locale.filterView.header.subheader}
            />
          </Card>
          {/*CORONA*/}
          {/*this.getDateFilter()*/}

          {this.getCompanyTypeFilter()}

          {this.getTagFilter()}
        </Grid>

        <Paper elevation={0} className={classes.findCard}>
          <Grid container spacing={1} justify="center">
            <Grid item xs={6}>
              <Button
                color="secondary"
                variant="contained"
                className={classes.findButton}
                onClick={() => this.reset()}
              >
                {locale.filterView.buttons.reset}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                color="primary"
                variant="contained"
                className={classes.findButton}
                onClick={() => this.apply()}
              >
                {locale.filterView.buttons.apply}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }

  private reset(): void {
    void filterStore.reset();
  }

  private apply(): void {
    if (filterStore.isDirty) {
      void filterStore.apply();
    }
  }

  private setDateFilter(date: DateFilter): void {
    filterStore.setDate(date);
  }

  private setTagFilter(tags: DealTags[]): void {
    filterStore.setDealTags(tags);
  }

  private getDateButtonColor(date: DateFilter): 'default' | 'secondary' {
    return this.getCurrentFilter().date === date ? 'default' : 'secondary';
  }

  /**
   * get correct filter to set the state of the UI
   * Either the normal filter or the changed filter ir current state is dirty
   */
  private getCurrentFilter(): CompanyFilter {
    if (filterStore.isDirty) {
      return filterStore.newFilter;
    }

    return filterStore.filter;
  }
}

export const FilterView = withStyles(styles)(_FilterView);
