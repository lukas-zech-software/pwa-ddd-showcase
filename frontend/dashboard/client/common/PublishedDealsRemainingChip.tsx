import {
  Avatar,
  Chip,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
}                      from '@material-ui/core';
import { IApiCompany } from '@my-old-startup/common/interfaces/IApiCompany';
import * as React      from 'react';
import { dealStore }   from '../stores/DealStore';
import { locale }      from './locales';

const styles = (theme: Theme) => createStyles(
  {
    chip: {
      margin: theme.spacing(0.5),
    },
  },
);

type Props = WithStyles<typeof styles> & {
  company: IApiCompany;
  onClick?: () => void;
};

class _PublishedDealsRemainingChip extends React.Component<Props> {

  public render(): React.ReactElement {
    const { classes, onClick } = this.props;

    const avatar = () => {

      if (dealStore.nextPublishedDeals === undefined) {
        return (
          <Avatar>&hellip;</Avatar>
        );
      }

      return (
        <Avatar>{dealStore.nextPublishedDeals.length}</Avatar>
      );
    };

    return (
      <Chip avatar={avatar()}
            className={classes.chip}
            color="primary"
            label={locale.dashboard.cards.aboInfo.publishedUpcoming}
            clickable={onClick !== undefined}
            onClick={onClick}
      />
    );
  }
}

export const PublishedDealsRemainingChip = withStyles(styles)(_PublishedDealsRemainingChip);
