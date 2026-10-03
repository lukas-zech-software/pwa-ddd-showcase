import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  withStyles,
  WithStyles,
}                                  from '@material-ui/core';
import WarningIcon                 from '@material-ui/icons/Warning';
import { IHubApiCompany }          from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDealAccount }         from '@my-old-startup/common/interfaces/IApiDealAccount';
import { ErrorMessage }            from '@my-old-startup/frontend-common/components/ErrorMessage';
import { BooleanCell }             from '@my-old-startup/frontend-common/components/table/BooleanCell';
import { locale as commonLocale }  from '@my-old-startup/frontend-common/locales';
import { alertColors }             from '@my-old-startup/frontend-common/style';
import clsx                        from 'clsx';
import * as React                  from 'react';
import {
  RouteComponentProps,
  withRouter,
}                                  from 'react-router';
import { locale }                  from '../../common/locales';
import { hubCompanyFacade }        from '../../facade/HubCompanyFacade';
import { hubDealAccountFacade }    from '../../facade/HubDealAccountFacade';
import { CompanyTableOptionsMenu } from './CompanyTableOptionsMenu';

const styles = (theme: Theme) => createStyles({
                                                topicHeader: {
                                                  backgroundColor: theme.palette.background.default,
                                                  '& th':          {
                                                    textAlign:  'center',
                                                    fontWeight: 'bold',
                                                  },
                                                },
                                                centered:    {
    textAlign: 'center',
  },
  cardContent: {
    overflow: 'scroll',
  },
  actions: {
    flexDirection: 'row-reverse',
  },
  highlighted: {
    backgroundColor: theme.palette.primary.light,
    '& th,td':       {
      color: theme.palette.getContrastText(theme.palette.primary.light),
    },
  },
  table: {
    width: '100%',
  },
  actingWarning: {
    color: alertColors(theme).warning,
    width: 1,
  },
});

type Props = WithStyles<typeof styles> & RouteComponentProps<{ companyId?: string }>;

type State = {
  allCompanies: IHubApiCompany[] | undefined;
  error: string | undefined;
  dealAccounts: IApiDealAccount[] | undefined;
};

class _CompanyTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      allCompanies: undefined,
      error:        undefined,
      dealAccounts: undefined,
    };
  }

  public componentDidMount(): void {
    void this.loadData();
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    const { allCompanies, error } = this.state;

    if (error !== undefined) {
      return (
        <ErrorMessage error={error.toString()}/>
      );
    }

    if (allCompanies === undefined) {
      return (
        <CircularProgress/>
      );
    }

    const sortedCompanies = allCompanies.sort((a, b) => b.created - a.created);

    const highlightedId = this.props.match.params.companyId;
    if (highlightedId !== undefined) {
      setTimeout(() => {
        const element = document.getElementById(highlightedId);
        if (element) {
          element.scrollIntoView();
        }
      },
                 500);
    }

    const getSignupMethod = (company: IHubApiCompany): string => {
      if (company.owners.length === 0) {
        return 'No owner assigend!';
      }

      switch (company.owners[0].split('|')[0]) {
        case 'auth0':
          return 'Email';
        case 'facebook':
          return 'Facebook';
        case 'google-oauth2':
          return 'Google';
        default:
          return 'unknown';
      }
    };

    const showDealsRemaining = (companyId: string) => {
      const { dealAccounts } = this.state;

      if (dealAccounts === undefined) {
        return <CircularProgress/>;
      } else {
        const found = dealAccounts.find((a) => a.companyId === companyId);
        return found ? found.dealsRemaining : -1;
      }
    };

    const formatTelephone = (value: string | undefined): string => value ? `+49 ${value}` : '-';

    return (
      <Card>
        <CardHeader title={`${locale.dashboard.header.companies} (Total ${allCompanies ? allCompanies.length : 'xxx'})`}/>
        <CardContent className={classes.cardContent}>
          <Table className={classes.table}>
            <TableHead className={classes.topicHeader}>
              <TableRow>
                <TableCell colSpan={6}>{locale.dashboard.table.headerTopics.contact}</TableCell>
                <TableCell colSpan={2}>{locale.dashboard.table.headerTopics.details}</TableCell>
                <TableCell colSpan={1}>{locale.dashboard.table.headerTopics.status}</TableCell>
                <TableCell align="right" colSpan={2}>{locale.dashboard.table.headerTopics.options}</TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell>{locale.dashboard.table.header.created}</TableCell>
                <TableCell>{locale.dashboard.table.header.title}</TableCell>
                <TableCell>{locale.dashboard.table.header.address}</TableCell>
                <TableCell>{locale.dashboard.table.header.telephone}</TableCell>
                <TableCell>{locale.dashboard.table.header.email}</TableCell>

                <TableCell>{locale.dashboard.table.header.type}</TableCell>

                <TableCell className={classes.centered}>{locale.dashboard.table.header.isApproved}</TableCell>
                <TableCell className={classes.centered}>{locale.dashboard.table.header.hasAcceptedTerms}</TableCell>
                <TableCell className={classes.centered}>{locale.dashboard.table.header.isBlocked}</TableCell>

                <TableCell>Deals Remaining</TableCell>

                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCompanies.map((company, i) => {
                const isHighlighted = company.id === highlightedId;

                return (
                  <TableRow key={i} className={clsx({ [classes.highlighted]: isHighlighted })} id={company.id}>
                    <TableCell>{locale.format.dateTime(company.created)} via {getSignupMethod(company)}</TableCell>
                    <TableCell component="th" scope="row">
                      {company.contact.title}
                    </TableCell>
                    <TableCell>{company.contact.address}, {company.contact.zipCode} {company.contact.city}</TableCell>
                    <TableCell>{formatTelephone(company.contact.telephone)}</TableCell>
                    <TableCell>{company.contact.email || '-'}</TableCell>

                    <TableCell>{commonLocale.company.types[company.contact.type]}</TableCell>

                    <BooleanCell value={company.status.isApproved}/>
                    <BooleanCell value={company.contact.hasAcceptedTerms}/>
                    <BooleanCell value={company.status.isBlocked}/>

                    <TableCell align="right">{showDealsRemaining(company.id)}</TableCell>

                    <TableCell align="right" padding={'none'}>
                      <CompanyTableOptionsMenu onActionDone={() => void this.loadData()}
                                               company={company}/>
                    </TableCell>

                    <TableCell padding={'none'} className={classes.actingWarning}>
                      {company.isActingAsOwner &&
                       <Tooltip title="Currently acting as owner if this company"><WarningIcon/></Tooltip>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
      allCompanies: undefined,
      error:        undefined,
      dealAccounts: undefined,
    });

    try {
      const allCompanies = await hubCompanyFacade.getAll();
      const dealAccounts = await hubDealAccountFacade.getAll();

      this.setState({ allCompanies, dealAccounts });
    } catch (error) {
      this.setState({ error });
    }
  }
}

export const CompanyTable = withStyles(styles)(withRouter(_CompanyTable));
