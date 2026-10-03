import {
  Menu,
  MenuItem,
  withStyles,
  WithStyles,
}                         from '@material-ui/core';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { IHubApiCompany } from '@my-old-startup/common/interfaces/IApiCompany';
import * as React         from 'react';
import { SyntheticEvent } from 'react';
import { HubRoutes }      from '../../common/HubRoutes';
import { hubUserFacade }  from '../../facade/HubUserFacade';
import { routeService }   from '../../services/HubRouteService';

const ITEM_HEIGHT = 48;

type Props = {
  company: IHubApiCompany;

  onActionDone(): void;
} & WithStyles<{}>;

type ownerMenuItem = {
  auth0Id: string;
  displayName: string | undefined;
};

type State = {
  anchorEl: any | null;
  ownerMenuItems: ownerMenuItem[];
};

export const CompanyOwnerOptionsMenu = withStyles({})(
  class CompanyOwnerOptionsMenu extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);

      const ownerMenuItems = props.company.owners.map((auth0Id) => {
        const menuItem: ownerMenuItem = {
          auth0Id,
          displayName: undefined,
        };

        return menuItem;
      });

      this.state = {
        anchorEl: null,
        ownerMenuItems,
      };
    }

    public async componentDidMount(): Promise<void> {
      const allUsers = await hubUserFacade.getAll();

      const owners = this.props.company.owners;

      const ownerMenuItems = owners.map((auth0Id) => {
        const user = allUsers.find((user) => user.authId === auth0Id);

        let displayName: string;

        if (user === undefined) {
          displayName = 'Name Unknown';
        }

        if (user && (user.contact.firstName !== undefined || user.contact.lastName !== undefined)) {
          displayName = `${user.contact.lastName}, ${user.contact.firstName}`;
        } else {
          displayName = 'Name Unknown';
        }

        return {
          auth0Id,
          displayName,
        };
      });

      this.setState({
        ownerMenuItems,
      });
    }

    public render(): React.ReactNode {
      const { anchorEl, ownerMenuItems } = this.state,
            isOpen = Boolean(anchorEl);

      return (
        <MenuItem onClick={(event) => this.setState({ anchorEl: event.currentTarget })}>
          {ownerMenuItems.length === 1 ? 'Owner' : 'Owners'}

          <KeyboardArrowRight/>

          <Menu
            anchorEl={anchorEl}
            open={isOpen}
            onClose={() => this.onClose()}
            onBackdropClick={() => this.onClose()}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                // width:     400,
              },
            }}
          >
            {ownerMenuItems.map((menuItem, i) => (
              <MenuItem key={i} onClick={(e) => {
                routeService.routeTo(HubRoutes.User, { userId: menuItem.auth0Id });
                return this.onClose(e);
              }}>
                {menuItem.displayName} ({menuItem.auth0Id})
              </MenuItem>
            ))}
          </Menu>
        </MenuItem>
      );
    }

    private onClose(event?: SyntheticEvent<any>): void {
      if (event !== undefined) { event.stopPropagation(); }
      this.setState({ anchorEl: null });
    }
  },
);
