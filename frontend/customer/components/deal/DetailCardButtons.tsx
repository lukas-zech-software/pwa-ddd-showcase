import {
  Button,
  createStyles,
  WithStyles,
  withStyles,
}                                  from '@material-ui/core';
import { IApiCompany }             from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDeal }                from '@my-old-startup/common/interfaces/IApiDeal';
import { CUSTOMER_COMPANY_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import { locale as commonLocale }  from '@my-old-startup/frontend-common/locales';
import * as React                  from 'react';
import { locale }                  from '../../common/locales';
import {
  getRoute,
  pushRoute,
}                                  from '../../common/routeUtils';

const styles = () => createStyles({
                                    detailButton: {
                                      width: '80%',
                                    },
                                    claimButton:  {
                                      width: '100%',
                                    },
                                  });

type Props = {
  deal: IApiDeal;
  company: IApiCompany;
} & WithStyles<typeof styles>;

const _DetailsCardButtons: React.SFC<Props> = (props: Props) => {
  const { company, deal, classes } = props;

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        className={classes.detailButton}
        component={
          // Fuck MUI Typings
          // Possible issue to track: https://github.com/mui-org/material-ui/issues/15695
          'a' as unknown as any
        }
        /*Link for SEO*/
        href={getRoute(CUSTOMER_COMPANY_ROUTES.companyDetails, {
          dealId:    deal.id,
          companyId: company.id,
        })}
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          void pushRoute(CUSTOMER_COMPANY_ROUTES.companyDetailsPath, CUSTOMER_COMPANY_ROUTES.companyDetails, {
            dealId:    deal.id,
            companyId: company.id,
          });
        }}>
        {commonLocale.company.types[company.contact.type]}
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.claimButton}
        component={
          // Fuck MUI Typings
          // Possible issue to track: https://github.com/mui-org/material-ui/issues/15695
          'a' as unknown as any
        }
        /*Link for SEO*/
        href={getRoute(CUSTOMER_COMPANY_ROUTES.dealClaimPath, {
          dealId:    deal.id,
          companyId: company.id,
        })}
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          void pushRoute(CUSTOMER_COMPANY_ROUTES.dealClaimPath, CUSTOMER_COMPANY_ROUTES.dealClaim, {
            dealId:    deal.id,
            companyId: company.id,
          });
        }}>
        {locale.listView.card.toDealClaim}
      </Button>
    </>
  );
};

export const DetailsCardButtons = withStyles(styles)(_DetailsCardButtons);
