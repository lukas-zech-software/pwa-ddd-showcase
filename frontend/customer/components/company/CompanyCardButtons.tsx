import {
  Button,
  createStyles,
  WithStyles,
  withStyles,
}                                   from '@material-ui/core';
import {
  IApiCompany,
  IApiCompanyMinimal,
} from '@my-old-startup/common/interfaces';
import { CUSTOMER_COMPANY_ROUTES }  from '@my-old-startup/common/routes/FrontendRoutes';
import * as React                   from 'react';
import { CompanyType }              from '../../../../common/enums';
import { getCompanySeoUrl }         from '../../../../common/utils/UrlUtils';
import {
  companyDetailsEvent,
  companyNavigationEvent,
} from '../../common/GAEvent';
import { locale }                   from '../../common/locales';
import { pushRoute }                from '../../common/routeUtils';
import { customerAnalyticsService } from '../../services/customerAnalyticsService';
import { openGoogleMapsRoute }      from '../map/mapUtils';

const styles = () => createStyles(
  {
    detailButton: {
      width: '100%',
    },
  },
);

type Props = { company: IApiCompanyMinimal } & WithStyles<typeof styles>;

const _CompanyCardButtons: React.SFC<Props> = (props: Props) => {
  const { company, classes }             = props;
  const { id, contact: { title, city } } = company;

  const companySeoUrl = getCompanySeoUrl({
                                           id,
                                           title,
                                           city,
                                         }, CUSTOMER_COMPANY_ROUTES.companyDetails);

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        aria-label={`Weitere Informationen zu ${title}, ${city}`}
        className={classes.detailButton}
        component={
          // Fuck MUI Typings
          // Possible issue to track: https://github.com/mui-org/material-ui/issues/15695
          'a' as unknown as any
        }
        /*Link for SEO*/
        href={companySeoUrl}
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          const gaEvent = companyDetailsEvent({ company });
          customerAnalyticsService.trackEvent(gaEvent);
          void pushRoute(CUSTOMER_COMPANY_ROUTES.companyDetailsPath, CUSTOMER_COMPANY_ROUTES.companyDetails, {
            companyId: company.id,
          });
        }}>
        {locale.listView.card.details}
      </Button>
      {company.contact.type!==CompanyType.FOODTRUCK && (
        <Button variant="contained"
                size="small"
                color="primary"
                aria-label={`Naviagation nach ${title}, ${city}`}
                onClick={e => {
                  e.stopPropagation();
                  const gaEvent = companyNavigationEvent({ company });
                  customerAnalyticsService.trackEvent(gaEvent);
                  openGoogleMapsRoute(company.location);
                }}
                className={classes.detailButton}>
          {locale.listView.card.toDeal}
        </Button>
      )}
    </>
  );
};

export const CompanyCardButtons = withStyles(styles)(_CompanyCardButtons);
