import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                               from '@material-ui/core';
import { ArrowForward }         from '@material-ui/icons';
import { FrontendError }        from '@my-old-startup/common/error/FrontendError';
import { IHubApiCompany }       from '@my-old-startup/common/interfaces/IApiCompany';
import { IHubApiUser }          from '@my-old-startup/common/interfaces/IApiUser';
import { Loading }              from '@my-old-startup/frontend-common/components/Loading';
import { globalMessageService } from '@my-old-startup/frontend-common/services/GlobalMessageService';
import * as React               from 'react';
import { HubRoutes }            from '../../common/HubRoutes';
import { locale }               from '../../common/locales';
import { hubUserFacade }        from '../../facade/HubUserFacade';
import { routeService }         from '../../services/HubRouteService';

const styles = (theme: Theme) => createStyles({

  header: {
    position: 'relative',
    top:      theme.spacing(1),
    left:     theme.spacing(1),
  },
});

type Props = WithStyles<typeof styles> & {
  user: IHubApiUser;

  onOk(): void;

  onCancel(): void;
};

type State = {
  companies: IHubApiCompany[] | undefined;
};

class _RestaurantOwnerDialog extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      companies: undefined,
    };
  }

  public async componentDidMount(): Promise<void> {
    try {
      const userAuthId = this.props.user.authId;
      const companies = await hubUserFacade.getRestaurantsForOwner({ userAuthId });
      this.setState({ companies });
    } catch (error) {
      const { statusCode } = error as FrontendError;
      const localeError = locale.common.error.statusCode[statusCode];

      globalMessageService.pushMessage({
        message: localeError || error.toString(),
        variant: 'error',
      });
    }

  }

  public getContent(): React.ReactNode {
    const { companies } = this.state;

    if (companies === undefined) {
      return <Loading/>;
    }

    if (companies.length === 0) {
      return (
        <Typography variant="subtitle2">
          {locale.dashboard.table.companyDialogue.noCompanies}
        </Typography>
      );
    }

    return <RestaurantOwnerTable companies={companies}/>;

  }

  public render(): React.ReactNode {
    const { user } = this.props;

    return (
      <Dialog
        open
        disableBackdropClick
        maxWidth="sm"
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">
          {locale.dashboard.table.companyDialogue.header(user.emailAddress)}
        </DialogTitle>
        <DialogContent>
          {this.getContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onOk} color="primary">
            {locale.dashboard.table.companyDialogue.buttons.ok}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const RestaurantOwnerDialog = withStyles(styles)(_RestaurantOwnerDialog);

type RestaurantOwnerTableProps = {
  companies: IHubApiCompany[];
};

const RestaurantOwnerTable: React.FC<RestaurantOwnerTableProps> = (props: RestaurantOwnerTableProps) => {
  const { companies } = props;
  const sortedCompanies = companies.sort((a, b) => b.created - a.created);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{locale.dashboard.table.header.created}</TableCell>
          <TableCell>{locale.dashboard.table.header.title}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedCompanies.map((company, i) => (
          <TableRow key={i}>
            <TableCell>{locale.format.dateTime(company.created)}</TableCell>
            <TableCell component="th" scope="row">
              {company.contact.title}
            </TableCell>
            <TableCell>
              <IconButton
                  onClick={() => routeService.routeTo(HubRoutes.Companies, { companyId: company.id })}
              >
                <ArrowForward/>
              </IconButton>
            </TableCell>
          </TableRow>
        ),
        )}
      </TableBody>
    </Table>
  );
};
