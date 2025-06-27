import {
  createStyles,
  Menu,
  MenuItem,
  withStyles,
  WithStyles,
}                                        from '@material-ui/core';
import { FrontendError }                 from '@my-old-startup/common/error/FrontendError';
import {
  IApiCompany,
  IApiDeal,
}                                        from '@my-old-startup/common/interfaces';
import { ApiDeal }                       from '@my-old-startup/common/validation';
import { DashboardRoutes }               from '@my-old-startup/frontend-common/routes';
import { globalMessageService }          from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { plainToClass }                  from 'class-transformer';
import * as React                        from 'react';
import { DealDetailPreviewDialog }       from '../../../common/deal/DealDetailPreviewDialog';
import { DealPublishConfirmationDialog } from '../../../common/deal/DealPublishConfirmationDialog';
import { DealTemplatingMenuItems }       from '../../../common/deal/DealTemplatingMenuItems';
import { locale }                        from '../../../common/locales';
import { routeService }                  from '../../../services/CdbRouteService';
import { DealService }                   from '../../../services/DealService';
import { dealStore }                     from '../../../stores/DealStore';
import { DealDeleteConfirmDialog }       from '../deals/DealDeleteConfirmDialog';
import { DealTableVariant }              from '../deals/DealsTable';

const ITEM_HEIGHT = 48;
const styles      = () => createStyles(
  {
    itemIcon: {
      position: 'relative',
      right:    0,
    },
    zIndex:   {
      zIndex: 999,
    },
  },
);

type Props = WithStyles<typeof styles> & {
  deal: IApiDeal;
  company: IApiCompany;
  menuAnchorEl: any;
  variant?: DealTableVariant;
  onClose: () => void;
};

type State = {
  isDeleteConfirmOpen: boolean;
  isPublishConfirmOpen: boolean;
  isDetailPreviewOpen: boolean;
};

class _DealsOptionsMenu extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isDeleteConfirmOpen:  false,
      isPublishConfirmOpen: false,
      isDetailPreviewOpen:  false,
    };
  }

  public render(): React.ReactNode {
    const { company, deal, menuAnchorEl, classes } = this.props,
          isOpen                                   = Boolean(menuAnchorEl);

    return (
      <>
        <Menu
          anchorEl={menuAnchorEl}
          open={isOpen}
          onClose={() => this.onClose()}
          className={classes.zIndex}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 5.5,
              width:     200,
            },
          }}
        >
          {this.getShowDetailPreviewItem()}
          {this.getPublishOrEditItem()}

          <DealTemplatingMenuItems deal={deal} companyId={company.id}/>
        </Menu>

        {this.state.isDetailPreviewOpen && (
          <DealDetailPreviewDialog company={this.props.company}
                                   deal={this.props.deal}
                                   isOpen
                                   onClose={() => this.onClose()}
          />
        )}
        {this.state.isDeleteConfirmOpen && (
          <DealDeleteConfirmDialog deal={this.props.deal}
                                   open
                                   onOk={() => this.delete()}
                                   onCancel={() => this.onClose()}
          />
        )}
        {this.state.isPublishConfirmOpen && (
          <DealPublishConfirmationDialog deal={this.props.deal}
                                         company={this.props.company}
                                         isOpen
                                         onOk={() => this.publish()}
                                         onCancel={() => this.onClose()}
          />
        )}
      </>
    );
  }

  private onClose(): void {
    this.setState(
      {
        isDeleteConfirmOpen:  false,
        isPublishConfirmOpen: false,
        isDetailPreviewOpen:  false,
      },
      () => this.props.onClose());
  }

  private async publish(): Promise<void> {
    try {
      const { company, deal } = this.props;

      await DealService.bulkPublish(deal, company.id, [deal.date.validFrom]);

      dealStore.fetchAllDeals(company);

      globalMessageService.pushMessage(
        {
          message: locale.dashboard.dealsPage.messages.published(deal.description.title),
          variant: 'success',
        },
      );

    } catch (error) {
      const { errorResponse, statusCode } = error as FrontendError;

      const localeError = errorResponse
        ? locale.common.error.errorCode[errorResponse.errorCode]
        : locale.common.error.statusCode[statusCode];

      globalMessageService.pushMessage(
        {
          message: localeError || error.toString(),
          variant: 'error',
        },
      );
    } finally {
      this.onClose();
    }
  }

  private openPublishConfirmation(): void {
    this.setState({ isPublishConfirmOpen: true });
  }

  private async delete(): Promise<void> {
    try {
      const { company, deal } = this.props;

      await DealService.delete(deal, company.id);

      globalMessageService.pushMessage(
        {
          message: locale.dashboard.dealsPage.messages.deleted(deal.description.title),
          variant: 'success',
        },
      );
    } catch (error) {
      const { errorResponse, statusCode } = error as FrontendError;
      const localeError                   = errorResponse
        ? locale.common.error.errorCode[errorResponse.errorCode]
        : locale.common.error.statusCode[statusCode];

      globalMessageService.pushMessage(
        {
          message: localeError || error.toString(),
          variant: 'error',
        },
      );
    } finally {
      this.onClose();
    }
  }

  private getPublishOrEditItem(): React.ReactNode {
    const { deal, company } = this.props;
    const dealInstance      = plainToClass(ApiDeal, deal);

    if (deal.date.validTo < Date.now() && deal.isStatic!==true) {
      return null;
    }

    const items: React.ReactNode[] = [];

    if (!deal.published) {
      // for not published deals,don't show publish in archive view
      if (dealInstance.canBePublished) {
        items.push(
          <MenuItem key={0} onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();

            this.openPublishConfirmation();
          }}>
            {locale.dashboard.dealsPage.table.buttons.publish}
          </MenuItem>
          ,
        );
      }

      // for not published deals, add edit item
      items.push(
        <MenuItem key={1}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    routeService.routeTo(DashboardRoutes.EditDeal, {
                      companyId: company.id,
                      dealId:    deal.id,
                    });
                  }}>
          {locale.dashboard.dealsPage.table.buttons.edit}
        </MenuItem>,
      );
    }

    // every deal can be deleted
    items.push(
      <MenuItem key={2}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  this.setState({ isDeleteConfirmOpen: true });
                }}>
        {locale.dashboard.dealsPage.table.buttons.delete}
      </MenuItem>,
    );

    return items;
  }

  private getShowDetailPreviewItem(): React.ReactNode {
    return (
      <MenuItem onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({ isDetailPreviewOpen: true });
      }}>
        {locale.dashboard.dealsPage.table.buttons.showDetails}
      </MenuItem>
    );
  }
}

export const DealsOptionsMenu = withStyles(styles)(_DealsOptionsMenu);
