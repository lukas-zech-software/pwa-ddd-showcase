import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                  from '@material-ui/core';
import { AttachMoney, TrendingUp } from '@material-ui/icons';
import { IApiAggregateDeal }       from '@my-old-startup/common/interfaces/IApiDeal';
import { ErrorMessage }            from '@my-old-startup/frontend-common/components/ErrorMessage';
import { alertColors }             from '@my-old-startup/frontend-common/style';
import * as React                  from 'react';
import { locale }                  from '../../common/locales';
import { hubDealFacade }           from '../../facade/HubDealFacade';
import { ChartCard }               from './ChartCard';

const CHART_CARD_IMAGE = 'http://big-elephants.com/images/2014-06-10-unrolling-line-charts-d3js/adjust-graphs-1.png';

const styles = (theme: Theme) => createStyles({
  topicHeader: {
    backgroundColor: theme.palette.background.default,
    '& th':          {
      textAlign:  'center',
      fontWeight: 'bold',
    },
  },
  centered: {
    textAlign: 'center',
  },
  card:    {},
  actions: {
    flexDirection: 'row-reverse',
  },
  table: {
    minWidth: 700,
  },
  actingWarning: {
    color: alertColors(theme).warning,
    width: 1,
  },
});

type Props = WithStyles<typeof styles>;

type State = {
  allDeals: IApiAggregateDeal[] | undefined;
  error: string | undefined;
};

class _DealsOverview extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      allDeals: undefined,
      error:    undefined,
    };
  }

  public componentDidMount(): void {
    void this.loadData();
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    const { allDeals, error } = this.state;

    if (error !== undefined) {
      return (
        <ErrorMessage error={error.toString()}/>
      );
    }

    if (allDeals === undefined) {
      return (
        <CircularProgress/>
      );
    }

    const totalDiscountedValue = allDeals.reduce((total, deal) => total + deal.discountValue, 0);
    return (
      <Card className={classes.card}>
        <CardHeader title={locale.dashboard.header.deals}/>
        <CardContent>
          <Grid container spacing={10} style={{ height: '100vh', width: '100%' }}>

            <Grid item xs={6}>
              <ChartCard icon={<TrendingUp/>}
                         image={CHART_CARD_IMAGE}
                         subheader={'01.12.2018 - 31.12.2018'}
                         header="Total number of published deals">
                <Typography gutterBottom variant="h2">
                  {allDeals.length} Deals
                </Typography>
              </ChartCard>
            </Grid>

            <Grid item xs={6}>
              <ChartCard icon={<AttachMoney/>}
                         subheader={'01.12.2018 - 31.12.2018'}
                         image="https://qph.fs.quoracdn.net/main-qimg-0672b6232c651ba384e3c0f07e0b5da4"
                         header="Total discounted value">
                <Typography gutterBottom variant="h2">
                  {locale.format.currency(totalDiscountedValue)} €
                </Typography>
              </ChartCard>
            </Grid>

          </Grid>

        </CardContent>
        <CardActions className={classes.actions}>
          <Button color="primary"
                  variant="contained"
                  onClick={() => void this.loadData()}
                  aria-label={locale.dashboard.buttons.refresh}>
            {locale.dashboard.buttons.refresh}
          </Button>
        </CardActions>
      </Card>

    );
  }

  private async loadData(): Promise<void> {
    this.setState({
      allDeals: undefined,
      error:    undefined,
    });

    try {
      const allDeals = await hubDealFacade.getAllForCurrentMonth();
      this.setState({ allDeals });
    } catch (error) {
      this.setState({ error });
    }
  }
}

export const DealsOverview = withStyles(styles)(_DealsOverview);
