import { Button, createStyles, Paper, Theme, WithStyles, withStyles } from '@material-ui/core';
import { ChevronLeft }                                                from '@material-ui/icons';
import * as React                                                     from 'react';
import { locale }                                                     from '../../common/locales';

const styles = (theme: Theme) => createStyles(
  {
    button: {
      width: '100%',
    },
    paper: {
      margin: theme.spacing(1),
    },
  },
);

type Props = {
  onClick: () => void;
};

const _DealDetailCloseItem = (props: Props & WithStyles<typeof styles>) => {
  const { classes, onClick } = props;

  return (
    <Paper elevation={1}
           className={classes.paper}
           onClick={e => e.stopPropagation()}>
      <Button color="primary" className={classes.button} onClick={() => onClick()}>
        <ChevronLeft/>
        {locale.search.suggestions.back}
      </Button>
    </Paper>
  );
};

export const DealDetailCloseItem = withStyles(styles)(_DealDetailCloseItem);
