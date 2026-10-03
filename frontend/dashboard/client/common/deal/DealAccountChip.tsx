import { Avatar, Chip, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import { Add }                                                       from '@material-ui/icons';
import { observer }                                                  from 'mobx-react';
import * as React                                                    from 'react';
import { dealAccountStore }                                          from '../../stores/DealAccountStore';
import { locale }                                                    from '../locales';

const styles = (theme: Theme) => createStyles({
  chip: {
    margin: theme.spacing(0.5),
  },
});

type Props = WithStyles<typeof styles> & {
  onClick?: () => void;
};

@observer
class _DealAccountChip extends React.Component<Props> {

  public async componentDidMount(): Promise<void> {
    return this.refreshStore();
  }

  public render(): React.ReactNode {
    const { classes, onClick } = this.props;
    const dealsRemaining       = dealAccountStore.dealsRemaining;

    return (
      <Chip avatar={<Avatar>{dealsRemaining}</Avatar>}
            label={locale.dashboard.cards.aboInfo.remaining.deals}
            className={classes.chip}
            color="secondary"
            deleteIcon={<Add/>}
            clickable={onClick !== undefined}
            onClick={onClick}
      />
    );
  }

  private async refreshStore(): Promise<void> {
    return dealAccountStore.refresh();
  }
}

export const DealAccountChip = withStyles(styles)(_DealAccountChip);
