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
  withStyles,
  WithStyles,
}                                          from '@material-ui/core';
import { IHubApiCompany, IHubApiUser }     from '@my-old-startup/common/interfaces';
import { ErrorMessage }                    from '@my-old-startup/frontend-common/components';
import { alertColors }                     from '@my-old-startup/frontend-common/style';
import clsx                                from 'clsx';
import * as React                          from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { locale }                          from '../../common/locales';
import { hubCompanyFacade }                from '../../facade/HubCompanyFacade';
import { hubUserFacade }                   from '../../facade/HubUserFacade';
import { UserTableOptionsMenu }            from './UserTableOptionsMenu';

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
  card: {
    overflow: 'scroll',
  },
  actions: {
    flexDirection: 'row-reverse',
  },
  table: {
    minWidth: 700,
  },
  highlighted: {
    backgroundColor: theme.palette.primary.light,
    '& th,td':       {
      color: theme.palette.getContrastText(theme.palette.primary.light),
    },
  },
  actingWarning: {
    color: alertColors(theme).warning,
    width: 1,
  },
});

type Props = {} & RouteComponentProps<{ userId?: string }> & WithStyles<typeof styles>;

type State = {
  allUsers: IHubApiUser[] | undefined;
  allCompanies: IHubApiCompany[];
  error: string | undefined;
};

class _UserTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      allUsers:     undefined,
      allCompanies: [],
      error:        undefined,
    };
  }

  public componentDidMount(): void {
    void this.loadData();
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    const { allUsers, error } = this.state;

    if (error !== undefined) {
      return (
        <ErrorMessage error={error.toString()}/>
      );
    }

    if (allUsers === undefined) {
      return (
        <CircularProgress/>
      );
    }

    const sortedUsers = allUsers.sort((a, b) => b.created - a.created);
    const highlightedId = this.props.match.params.userId;
    if (highlightedId !== undefined) {
      setTimeout(
        () => {
          const element = document.getElementById(highlightedId);
          if (element) {
            element.scrollIntoView();
          }
        },
        500,
      );
    }

    const formatTelephone = (value: string | undefined): string => value ? `+49 ${value}` : '-';

    return (
      <Card className={classes.card}>
        <CardHeader title={locale.dashboard.header.users}/>
        <CardContent>
          <Table className={classes.table}>
            <TableHead className={classes.topicHeader}>
              <TableRow>
                <TableCell colSpan={3}>{locale.dashboard.table.headerTopics.details}</TableCell>
                <TableCell colSpan={3}>{locale.dashboard.table.headerTopics.contact}</TableCell>
                <TableCell>{locale.dashboard.table.headerTopics.options}</TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell>{locale.dashboard.table.header.created}</TableCell>
                <TableCell>{locale.dashboard.table.header.lastLogin}</TableCell>
                <TableCell>{locale.dashboard.table.header.email}</TableCell>
                <TableCell>{locale.dashboard.table.header.contactName}</TableCell>
                <TableCell>{locale.dashboard.table.header.contactPhone}</TableCell>
                <TableCell>{locale.dashboard.table.header.contactEmail}</TableCell>
                <TableCell align="right"/>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers.map((user, i) => {
                const isHighlighted = user.authId === highlightedId;

                return (
                  <TableRow key={i} className={clsx({ [classes.highlighted]: isHighlighted })} id={highlightedId}>
                    <TableCell>{locale.format.dateTime(user.created)}</TableCell>
                    <TableCell>{locale.format.dateTime(user.lastLogin||0)}</TableCell>
                    <TableCell>{user.emailAddress}</TableCell>

                    {/* TODO: Remove these checks once users are required to input contact info*/}
                    <TableCell>{user.contact.lastName || '-'}, {user.contact.firstName || '-'}</TableCell>
                    <TableCell>{formatTelephone(user.contact.telephone)}</TableCell>
                    <TableCell>{user.contact.email || '-'}</TableCell>

                    <TableCell align="right" padding={'none'}>
                      <UserTableOptionsMenu onActionDone={() => void this.loadData()}
                                            user={user}
                                            userCompanies={
                                              this.state.allCompanies
                                                .filter((company) => company.owners.some((o) => user.authId === o))
                                            }
                      />
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
      allUsers: undefined,
      error:    undefined,
    });

    try {
      const allUsers = await hubUserFacade.getAll();
      const allCompanies = await hubCompanyFacade.getAll();
      this.setState({ allUsers, allCompanies });
    } catch (error) {
      this.setState({ error });
    }
  }
}

export const UserTable = withStyles(styles)(withRouter(_UserTable));
