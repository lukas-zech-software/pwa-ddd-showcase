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
}                                          from '@material-ui/core';
import WarningIcon                         from '@material-ui/icons/Warning';
import { IHubApiCompany }                  from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDealAccount }                 from '@my-old-startup/common/interfaces/IApiDealAccount';
import { ErrorMessage }                    from '@my-old-startup/frontend-common/components/ErrorMessage';
import { BooleanCell }                     from '@my-old-startup/frontend-common/components/table/BooleanCell';
import { locale as commonLocale }          from '@my-old-startup/frontend-common/locales';
import { alertColors }                     from '@my-old-startup/frontend-common/style';
import clsx                                from 'clsx';
import * as React                          from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { locale }                          from '../../common/locales';
import { hubCompanyFacade }                from '../../facade/HubCompanyFacade';
import { hubDealAccountFacade }            from '../../facade/HubDealAccountFacade';
import { CompanyTableOptionsMenu }         from './CompanyTableOptionsMenu';

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
};

class _CompanyTableExport extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      allCompanies: undefined,
      error:        undefined,
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

    return (
      <Card>
        <CardHeader title={locale.dashboard.header.companies}/>
        <CardContent className={classes.cardContent}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{locale.dashboard.table.header.created}</TableCell>
                <TableCell>{locale.dashboard.table.header.title}</TableCell>
                <TableCell>{locale.dashboard.table.header.address}</TableCell>
                <TableCell>{locale.dashboard.table.header.zipCode}</TableCell>
                <TableCell>{locale.dashboard.table.header.type}</TableCell>
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
                    <TableCell>{company.contact.address}</TableCell>
                    <TableCell>{company.contact.zipCode} {company.contact.city}</TableCell>

                    <TableCell>{commonLocale.company.types[company.contact.type]}</TableCell>

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
    });

    try {
      const allCompanies = await hubCompanyFacade.getAll();

      this.setState({ allCompanies });
    } catch (error) {
      this.setState({ error });
    }
  }
}

export const CompanyTableExport = withStyles(styles)(withRouter(_CompanyTableExport));
