import { Paper, Tab, Tabs, withStyles, WithStyles } from '@material-ui/core';
import { IApiCompany }                              from '@my-old-startup/common/interfaces';
import { observer }                                 from 'mobx-react';
import * as React                                   from 'react';
import { locale }                                   from '../../../common/locales';
import { DealsTable, DealTableVariant }             from './DealsTable';

type Props = WithStyles<{}> & {
  currentCompany: IApiCompany;
};

type State = {
  selectedTab: DealTableVariant;
};

@observer
class _DealsTableTabs extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = { selectedTab: DealTableVariant.Upcoming };
  }

  public render(): React.ReactNode {
    const { currentCompany } = this.props;
    const { selectedTab }    = this.state;

    return (
      <Paper>
        <Tabs indicatorColor="secondary"
              value={selectedTab}
              onChange={(event, n) => this.selectTab(n)}
        >
          <Tab key={'archive'} label={locale.dashboard.dealsPage.tabs[DealTableVariant.Archive]}
          />
          <Tab key={'upcoming'} label={locale.dashboard.dealsPage.tabs[DealTableVariant.Upcoming]}
          />
        </Tabs>
        <DealsTable variant={selectedTab}
                    currentCompany={currentCompany}
        />
      </Paper>
    );
  }

  private selectTab(n: 0 | 1): void {
    this.setState({ selectedTab: n });
  }
}

export const DealsTableTabs = withStyles({})(_DealsTableTabs);
