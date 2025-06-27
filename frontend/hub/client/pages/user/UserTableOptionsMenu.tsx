import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  withStyles,
  WithStyles,
}                                   from '@material-ui/core';
import MoreVertIcon                 from '@material-ui/icons/MoreVert';
import { FrontendError }            from '@my-old-startup/common/error/FrontendError';
import {
  IHubApiCompany,
  IHubApiUser,
}                                   from '@my-old-startup/common/interfaces';
import { RawHtml }                  from '@my-old-startup/frontend-common/components';
import { globalMessageService }     from '@my-old-startup/frontend-common/services/GlobalMessageService';
import * as React                   from 'react';
import { DeleteConfirmationDialog } from '../../common/DeleteConfirmationDialog';
import { locale }                   from '../../common/locales';
import { hubUserFacade }            from '../../facade/HubUserFacade';
import { RestaurantOwnerDialog }    from './RestaurantOwnerDialog';

const ITEM_HEIGHT = 48;

type Props = WithStyles<{}> & {
  user: IHubApiUser;
  userCompanies: IHubApiCompany[];
  onActionDone(): void;
};

type State = {
  anchorEl: any | null;
  isOwnerDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
};

class _UserTableOptionsMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl:           null,
      isOwnerDialogOpen:  false,
      isDeleteDialogOpen: false,
    };
  }

  public render(): React.ReactNode {
    const { user, userCompanies } = this.props,
          { anchorEl, isDeleteDialogOpen } = this.state,
          isOpen = Boolean(anchorEl);

    const orphans = this.getOrphans(userCompanies);
    const orphanText = orphans.map((company) => `<li><strong>"${company.contact.title}"</strong></li>`);

    const error = orphans.length === 0
      ? undefined
      : <RawHtml>
        {
          `The user “${user.userName}” is the only owner of the following business:<br />` +
          `<ul>${orphanText}</ul>If you delete this user, these businesses will be deleted as well`
        }
      </RawHtml>;

    return (
      <>
        <IconButton
          onClick={(event) => {
            this.setState({ anchorEl: event.currentTarget });
          }}
        >
          <MoreVertIcon/>
        </IconButton>
        {isDeleteDialogOpen && (
          <DeleteConfirmationDialog title={user.emailAddress}
                                    open
                                    itemType="user"
                                    error={error}
                                    okButtonLabel={orphans.length > 0 ? 'Delete User and Companies' : undefined}
                                    onOk={() => this.delete()}
                                    onCancel={() => this.setState({ isDeleteDialogOpen: false })}
          />
        )}
        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          onClose={() => this.onClose()}
          onBackdropClick={() => this.onClose()}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width:     200,
            },
          }}
        >
          <MenuItem disabled>
            {`UserID "${user.id}"`}
          </MenuItem>
          <MenuItem onClick={() => this.setState({ isOwnerDialogOpen: true })}>
            Get Users Restaurants
          </MenuItem>

          <Divider/>

          <MenuItem onClick={() => window.open('mailto:' + user.emailAddress, '_blank')}>
            Send mail to User
          </MenuItem>

          <Divider/>

          <MenuItem onClick={() => this.setState({ isDeleteDialogOpen: true })}>
            Delete
          </MenuItem>
        </Menu>
        {this.state.isOwnerDialogOpen && (
          <RestaurantOwnerDialog user={user}
                                 onOk={() => {
                                   this.setState({ isOwnerDialogOpen: false });
                                 }}
                                 onCancel={() => {
                                   this.setState({ isOwnerDialogOpen: false });
                                 }}/>
        )}
      </>
    );
  }

  private executeAction(promise: Promise<void>, successMessage: string, errorMessage?: string): void {
    this.onClose();

    promise
      .then(() => {
        globalMessageService.pushMessage({
          message: successMessage,
          variant: 'success',
        });
        this.props.onActionDone();
      })
      .catch((error) => {
        const { statusCode } = error as FrontendError;
        const localeError = locale.common.error.statusCode[statusCode];

        globalMessageService.pushMessage({
          message: errorMessage || localeError || error.toString(),
          variant: 'error',
        });
      });
  }

  private delete(): void {
    const user = this.props.user;
    this.executeAction(
      hubUserFacade.delete({ userId: user.id }),
      `${user.userName} successfully deleted`,
      `${user.userName} could not be deleted as they are the only owner of one or more restaurants`,
    );
  }

  private onClose(): void {
    this.setState({ anchorEl: null });
  }

  private getOrphans(companies: IHubApiCompany[]): IHubApiCompany[] {
    return companies.filter((company) => company.owners.length === 1);
  }
}

export const UserTableOptionsMenu = withStyles({})(_UserTableOptionsMenu);
