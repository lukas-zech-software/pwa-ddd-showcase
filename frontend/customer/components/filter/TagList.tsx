import { Chip, createStyles, Grid, Paper, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { DealTags }
                                                                                      from '@my-old-startup/common/enums/DealTags';
import { locale }                                                                     from '@my-old-startup/frontend-common/locales';
import React, { PureComponent }                                                       from 'react';
import { MuiButtonContainedSecondary }                                                from '../../styles/theme';

const styles = (theme: Theme) => createStyles({
  root: {
    width:     '100%',
    textAlign: 'center',
  },
  fab: {
    borderRadius: theme.spacing(2),
  },
  formControl: {
    'margin':   theme.spacing(2),
    '& :focus': {
      backgroundColor: 'inherit',
    },
  },
  chips: {
    display:       'flex',
    flexWrap:      'wrap',
    paddingBottom: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.25),
          ...MuiButtonContainedSecondary
  },
  searchInput: {
    backgroundColor: 'white !important',
  },
});

type Props = WithStyles<typeof styles> & {
  selectedTags: DealTags[];
  error?: boolean;
  onTagsChange(tags: DealTags[]): void;
};

class _TagList extends PureComponent<Props> {

  public render(): React.ReactNode {
    const { classes, selectedTags } = this.props;
    const hasMaxSize = selectedTags.length >= 3;

    return (
      <Paper elevation={0} className={classes.root}>
        <Grid container spacing={1} justify="center">

          <Grid item xs={12}>
            {this.getSelectedChips()}
          </Grid>


          {hasMaxSize && (
            <Grid item xs={12}>
              <Typography variant="caption" color="error">
                {locale.tags.maxTags}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  }

  private getSelectedChips(): React.ReactNode {
    const {
      classes,
      selectedTags,
    } = this.props;

    return (
      <div className={classes.chips} onClick={e => e.stopPropagation()}>
        {selectedTags.map((value, index) => (
          <Chip
            key={index}
            label={locale.deals.table.tags[value]}
            className={classes.chip}
            color="primary"
            onDelete={() => {
              const array = [...selectedTags];
              array.splice(index, 1);
              this.props.onTagsChange(array);
            }}
          />
        ))}
      </div>
    );
  }
}

export const TagList = withStyles(styles)(_TagList);
