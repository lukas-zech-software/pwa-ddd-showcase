import {
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  withStyles,
  WithStyles,
}                            from '@material-ui/core';
import { ExpandMore }        from '@material-ui/icons';
import { IApiCompany }       from '@my-old-startup/common/interfaces';
import { DashboardRoutes }   from '@my-old-startup/frontend-common/routes';
import { observer }          from 'mobx-react';
import * as React            from 'react';
import { locale }            from '../../common/locales';
import { routeService }      from '../../services/CdbRouteService';
import { companyStore }      from '../../stores/CompanyStore';
import { allCompaniesStore } from '../registration/AllCompaniesStore';

type Props = WithStyles<{}>;

type State = {
  menuAnchorEl: any;
};

@observer
class _DashboardMenuCompanySelector extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      menuAnchorEl: null,
    };
  }

  public getCurrentCompanyListItem(currentCompany: IApiCompany | undefined): React.ReactNode {
    if (currentCompany === undefined) {
      return null;
    }

    return (
      <ListItem
        button
        onClick={event => this.setState({ menuAnchorEl: event.currentTarget })}
      >
        <ListItemText
          primary={currentCompany.contact.title}
          secondary={
            <>
              {currentCompany.contact.address}
              <br/>
              {currentCompany.contact.zipCode} {currentCompany.contact.city}
            </>
          }
        />
        <ExpandMore/>
      </ListItem>
    );
  }

  public getSelectedCompanyMenu(companies: IApiCompany[] | undefined): React.ReactNode {
    const { menuAnchorEl } = this.state;

    if (companies === undefined) {
      return null;
    }

    return (
      <Menu
        anchorEl={menuAnchorEl}
        open={menuAnchorEl !== null}
        onClose={() => this.close()}
      >
        <MenuItem disabled>
          {locale.dashboard.menuItems.header.restaurantSelector}
        </MenuItem>

        {companies.map((company, index) => (
          <MenuItem
            key={index}
            selected={companyStore.currentCompany && company.id === companyStore.currentCompany.id}
            onClick={() => this.handleMenuItemClick(company)}
          >
            <ListItemText
              primary={company.contact.title}
              secondary={company.contact.address}
            />
          </MenuItem>
        ))}
      </Menu>
    );
  }

  public render(): React.ReactNode {
    return (
      <>
        {this.getCurrentCompanyListItem(companyStore.currentCompany)}

        {this.getSelectedCompanyMenu(allCompaniesStore.companies)}
      </>
    );
  }

  private close(): void {
    this.setState({ menuAnchorEl: null });
  }

  private handleMenuItemClick(selectedCompany: IApiCompany): void {
    companyStore.currentCompany = selectedCompany;

    routeService.routeTo(DashboardRoutes.Dashboard, { companyId: selectedCompany.id });
    this.close();
  }
}

export const DashboardMenuCompanySelector = withStyles({})(_DashboardMenuCompanySelector);
