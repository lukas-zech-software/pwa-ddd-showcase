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
import { IHubApiCompany }           from '@my-old-startup/common/interfaces/IApiCompany';
import { DashboardRoutes }          from '@my-old-startup/frontend-common/routes';
import { globalMessageService }     from '@my-old-startup/frontend-common/services/GlobalMessageService';
import * as React                   from 'react';
import { DeleteConfirmationDialog } from '../../common/DeleteConfirmationDialog';
import { locale }                   from '../../common/locales';
import SetDealAccountDialog         from '../../common/SetDealAccountDialog';
import { hubCompanyFacade }         from '../../facade/HubCompanyFacade';
import { hubDealAccountFacade }     from '../../facade/HubDealAccountFacade';
import { routeService }             from '../../services/HubRouteService';
import { CompanyOwnerOptionsMenu }  from './CompanyOwnerOptionsMenu';

const ITEM_HEIGHT = 48;

type Props = {
  company: IHubApiCompany;

  onActionDone(): void;
} & WithStyles<{}>;

type State = {
  isDeleteDialogOpen: boolean;
  isDealAccountDialogOpen: boolean;
  anchorEl: any | null;
};

export const CompanyTableOptionsMenu = withStyles({})(
  class CompanyTableOptionsMenu extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        isDeleteDialogOpen:      false,
        isDealAccountDialogOpen: false,
        anchorEl:                null,
      };
    }

    public render(): React.ReactNode {
      const { anchorEl, isDeleteDialogOpen, isDealAccountDialogOpen } = this.state,
            { company }                                               = this.props,
            isOpen                                                    = Boolean(anchorEl);

      return (
        <>
          <IconButton
            onClick={(event) => {
              this.setState({ anchorEl: event.currentTarget });
            }}
          >
            <MoreVertIcon/>
          </IconButton>
          <DeleteConfirmationDialog title={company.contact.title}
                                    open={isDeleteDialogOpen}
                                    itemType="company"
                                    onOk={() => this.delete()}
                                    onCancel={() => this.setState({ isDeleteDialogOpen: false })}
          />
          {isDealAccountDialogOpen && (
            <SetDealAccountDialog open={true}
                                  company={company}
                                  onDone={() => this.setState({ isDealAccountDialogOpen: false })}
                                  send={((dealsRemaining) => this.setDealAccount(dealsRemaining))}
            />
          )}
          <Menu
            anchorEl={anchorEl}
            open={isOpen}
            onBackdropClick={() => this.onClose()}
            onClose={() => this.onClose()}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width:     200,
              },
            }}
          >
            {company.status.isApproved === false && (
              <>
                <MenuItem onClick={() => this.approve()}>
                  Approve
                </MenuItem>
                <Divider/>
              </>
            )}

            {company.isActingAsOwner === false && (
              <MenuItem onClick={() => this.actAs()}>
                Act as owner
              </MenuItem>
            )}

            {company.isActingAsOwner === true && (
              [
                <MenuItem key="editCompany" onClick={() => this.editCompany()}>
                  Edit restaurant
                </MenuItem>
                ,
                < MenuItem key="stopActingAsOwner" onClick={() => this.stopActingAs()}
                           disabled={company.owners.length === 1}>
                  Stop acting as owner
                </MenuItem>
                ,
              ]
            )}
            <Divider/>

            <CompanyOwnerOptionsMenu company={company} onActionDone={() => {
              // When the user clicks away from the owners menu, close this one as well
              this.props.onActionDone();
            }}/>

            <Divider/>

            <MenuItem onClick={() => this.cloneCompany()}>
              Clone
            </MenuItem>

            <Divider/>

            <MenuItem onClick={() => this.setState({ isDeleteDialogOpen: true })}>
              Delete
            </MenuItem>

            <Divider/>

            <MenuItem onClick={() => this.testData()}>
              Generate Test Data
            </MenuItem>

            <MenuItem onClick={() => this.openSetDealAccount()}>
              Set Deals Remaining
            </MenuItem>
          </Menu>
        </>
      );
    }

    private onClose(): void {
      this.setState({ anchorEl: null });
    }

    private approve(): void {
      const company = this.props.company;
      this.executeAction(
        hubCompanyFacade.approve({ companyId: company.id }),
        `${company.contact.title} successfully approved`,
      );
    }

    private delete(): void {
      const company = this.props.company;
      this.executeAction(
        hubCompanyFacade.delete({ companyId: company.id }),
        `${company.contact.title} successfully deleted`,
      );
    }

    private testData(): void {
      const company = this.props.company;
      this.executeAction(
        hubCompanyFacade.testData({ companyId: company.id }),
        `Generated test data for "${company.contact.title}"`,
      );
    }

    private openSetDealAccount(): void {
      this.setState({ isDealAccountDialogOpen: true });
    }

    private setDealAccount(dealsRemaining: number): void {
      const { company } = this.props;
      this.executeAction(
        hubDealAccountFacade.setDealAccount({ companyId: company.id }, dealsRemaining),
        `Set Deal Account balance to ${dealsRemaining} for "${company.contact.title}"`,
      );
    }

    private actAs(): void {
      const company = this.props.company;
      this.executeAction(
        hubCompanyFacade.actAsOwner({ companyId: company.id }),
        `Now owner of ${company.contact.title}. <br/> <b>Remember to undo this!</b> `,
      );
    }

    private stopActingAs(): void {
      const company = this.props.company;
      this.executeAction(
        hubCompanyFacade.stopActingAsOwner({ companyId: company.id }),
        `Stopped acting as owner of ${company.contact.title}.`,
      );
    }

    private executeAction(promise: Promise<void>, successMessage: string): void {
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
          const localeError    = locale.common.error.statusCode[statusCode];

          globalMessageService.pushMessage({
                                             message: localeError || error.toString(),
                                             variant: 'error',
                                           });
        });
    }

    private editCompany(): void {
      const route            = routeService.getRoute(DashboardRoutes.Restaurant, { companyId: this.props.company.id });
      const dashBoardBaseUrl = process.env.DASHBOARD_URL;
      const companyUrl       = dashBoardBaseUrl + route;

      window.open(companyUrl, '_blank');

      this.onClose();
    }

    private async cloneCompany(): Promise<void> {
      const company = this.props.company;

      try {
        const clonedCompany    = await hubCompanyFacade.clone({ companyId: company.id });
        const route            = routeService.getRoute(DashboardRoutes.Restaurant, { companyId: clonedCompany.id });
        const dashBoardBaseUrl = process.env.DASHBOARD_URL;
        const companyUrl       = dashBoardBaseUrl + route;

        window.open(companyUrl, '_blank');
      } catch (error) {
        globalMessageService.pushMessage({
                                           message: error.toString(),
                                           variant: 'error',
                                         });
      }

      this.onClose();
      this.props.onActionDone();
    }
  },
);
