import {
  CircularProgress,
  Grid,
  Typography,
}                                 from '@material-ui/core';
import {
  COMPANY_BACKGROUND_CONFIG,
  COMPANY_LOGO_CONFIG,
  IApiCompany,
}                                 from '@my-old-startup/common/interfaces';
import { COMPANY_ROUTES }         from '@my-old-startup/common/routes/ApiRoutes';
import { Loading }                from '@my-old-startup/frontend-common/components/Loading';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_LOGO,
} from '../../../../../../common/routes/default_urls';
import { FormTooltip }            from '../../../common/FormTooltip';
import { locale }                 from '../../../common/locales';
import { dashboardCompanyFacade } from '../../../facade/DashboardCompanyFacade';
import { BaseCompanyFormCard }    from '../../../form/BaseCompanyFormCard';
import { routeService }           from '../../../services/CdbRouteService';
import { allCompaniesStore }      from '../../registration/AllCompaniesStore';

const ImageUpload = React.lazy(() => import('../../../common/ImageUpload'));

type Props = {
  company: IApiCompany;
  onImageChange: () => void;
};

@observer
export class CompanyImagesCard extends React.Component<Props> {

  public render(): JSX.Element {
    const { company } = this.props;

    if (company === undefined) {
      return <Loading/>;
    }

    return (
      <BaseCompanyFormCard
        subForm
        header={locale.forms.apiCompanyImages.header}
        submit={() => Promise.resolve()}>
        <React.Suspense fallback={<CircularProgress/>}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              <Typography variant="h6" color="inherit">
                {locale.forms.apiCompanyImages.fields.background}
                <FormTooltip inline title={locale.forms.apiCompanyImages.tooltips.background}/>
              </Typography>

              <ImageUpload propertyName={'background'}
                           targetUrl={routeService.getRoute(COMPANY_ROUTES.uploadImages, { companyId: company.id })}
                           selectedImage={company.images.background}
                           imageConfig={COMPANY_BACKGROUND_CONFIG}
                           onImageProcessed={(image) => {
                             if (typeof image === 'string') {
                               company.images.background = image;
                             } else {
                               company.images.background = image.background;
                             }
                             this.props.onImageChange();
                           }}
                           onImageRemoved={async () => {
                             if (company.images.background === DEFAULT_BACKGROUND) {
                               return;
                             }

                             await dashboardCompanyFacade.restoreImage(company.id);
                             await allCompaniesStore.loadCompanies();
                             globalMessageService.pushMessage(
                               {
                                 message: locale.forms.apiCompanyImages.saveMessage,
                                 variant: 'success',
                               },
                             );
                           }}
                           successMessage={locale.forms.apiCompanyImages.saveMessageBackground}/>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="inherit">
                {locale.forms.apiCompanyImages.fields.logo}
                <FormTooltip inline title={locale.forms.apiCompanyImages.tooltips.logo}/>
              </Typography>

              <ImageUpload propertyName={'logo'}
                           hideStock
                           targetUrl={routeService.getRoute(COMPANY_ROUTES.uploadImages, { companyId: company.id })}
                           selectedImage={company.images.logo}
                           imageConfig={COMPANY_LOGO_CONFIG}
                           onImageProcessed={(image) => {
                             if (typeof image === 'string') {
                               company.images.logo = image;
                             } else {
                               company.images.logo = image.logo;
                             }
                             this.props.onImageChange();
                           }}
                           onImageRemoved={async () => {
                             if (company.images.logo === DEFAULT_LOGO) {
                               return;
                             }
                             await dashboardCompanyFacade.restoreLogo(company.id);
                             await allCompaniesStore.loadCompanies();
                             globalMessageService.pushMessage(
                               {
                                 message: locale.forms.apiCompanyImages.saveMessage,
                                 variant: 'success',
                               },
                             );
                           }}
                           successMessage={locale.forms.apiCompanyImages.saveMessageLogo}/>
            </Grid>
          </Grid>
        </React.Suspense>
      </BaseCompanyFormCard>
    );
  }
}
