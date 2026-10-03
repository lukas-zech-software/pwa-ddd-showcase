import {
  CircularProgress,
  Grid,
}                                 from '@material-ui/core';
import { IApiCompany }            from '@my-old-startup/common/interfaces';
import { COMPANY_ROUTES }         from '@my-old-startup/common/routes/ApiRoutes';
import { Loading }                from '@my-old-startup/frontend-common/components/Loading';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import { FormTooltip }            from '../../../common/FormTooltip';
import { locale }                 from '../../../common/locales';
import { dashboardCompanyFacade } from '../../../facade/DashboardCompanyFacade';
import { BaseCompanyFormCard }    from '../../../form/BaseCompanyFormCard';
import { routeService }           from '../../../services/CdbRouteService';

const ImageUpload = React.lazy(() => import('../../../common/ImageUpload'));

type Props = {
  company: IApiCompany;
  onImageChange: () => void;
};

@observer
export class CompanyMenuCard extends React.Component<Props> {

  public render(): JSX.Element {
    const { company } = this.props;

    if (company === undefined) {
      return <Loading/>;
    }

    return (
      <BaseCompanyFormCard
        subForm
        header={
          <>
            {locale.forms.apiCompanyImages.fields.menuDocument}
            <FormTooltip
              inline
              title={locale.forms.apiCompanyImages.tooltips.menuDocument}
            />
          </>
        }
        submit={() => Promise.resolve()}>
        <React.Suspense fallback={<CircularProgress/>}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ImageUpload propertyName={'menuDocument'}
                           hideStock
                           onImageProcessed={(image) => {
                             if (typeof image === 'string') {
                               company.images.menuDocument = image;
                             } else {
                               company.images.menuDocument = image.menuDocument;
                             }
                             this.props.onImageChange();
                           }}
                           onImageRemoved={async () => {
                             await dashboardCompanyFacade.restoreMenuDocument(company.id);
                             globalMessageService.pushMessage(
                               {
                                 message: locale.forms.apiCompanyImages.saveMessage,
                                 variant: 'success',
                               },
                             );
                           }}
                           targetUrl={routeService.getRoute(COMPANY_ROUTES.updateMenuDocument,
                                                            { companyId: company.id })}
                           selectedImage={company.images.menuDocument}
                           imageConfig={{
                             width:  0,
                             height: 0,
                           }}
                           noEdit
                           acceptedFileTypes={['image/png', 'image/jpeg', 'application/pdf']}
                           successMessage={locale.forms.apiCompanyImages.saveMessageMenu}/>
            </Grid>

          </Grid>
        </React.Suspense>
      </BaseCompanyFormCard>
    );
  }
}
