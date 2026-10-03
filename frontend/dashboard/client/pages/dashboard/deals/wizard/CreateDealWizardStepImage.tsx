import {
  CircularProgress,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
}                                from '@material-ui/core';
import { useObserver }           from 'mobx-react-lite';
import * as React                from 'react';
import { DEAL_IMAGE_CONFIG }     from '../../../../../../../common/interfaces';
import { DEAL_ROUTES }           from '../../../../../../../common/routes/ApiRoutes';
import { locale }                from '../../../../common/locales';
import { ImageTab }              from '../../../../common/types';
import { routeService }          from '../../../../services/CdbRouteService';
import { companyStore }          from '../../../../stores/CompanyStore';
import { createDealWizardStore } from './CreateDealWizardStore';
// tslint:disable-next-line:variable-name
const ImageUpload = React.lazy(() => import('../../../../common/ImageUpload'));

type Props = {
  validate: boolean;
};

export function CreateDealWizardStepImages(props: Props): JSX.Element {
  const errors                          = props.validate ? createDealWizardStore.validateImage() : [];
  const deal                            = createDealWizardStore.deal;
  const company                         = companyStore.currentCompany!;

  return useObserver(() => (
    <>
      <React.Suspense fallback={<CircularProgress/>}>
        <ImageUpload propertyName={'image'}
                     targetUrl={routeService.getRoute(DEAL_ROUTES.updateImage, {
                       companyId: company.id,
                       dealId:    createDealWizardStore.deal.id,
                     })}
                     selectedImage={deal.image}
                     imageConfig={DEAL_IMAGE_CONFIG}
                     onImageProcessed={(image:string) => {
                       createDealWizardStore.setImage(image);
                     }}
                     successMessage={locale.forms.apiDealFacts.saveMessageImage}
        />
      </React.Suspense>
      {errors.length !== 0 && (
        <Typography variant="caption"
                    color="error"
                    component={'p' as any}
                    align="right"
                    style={{fontWeight:'bold'}}
        >
          {locale.dashboard.dialogs.dealPublishConfirmation.imageMissingHint}
        </Typography>
      )}
    </>
  ));
}

const useStylesHelp = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        helpLine: {
          marginBottom: theme.spacing(3),
        },
      },
    ),
);

export function CreateDealWizardStepImagesHelp(): JSX.Element {
  const classes = useStylesHelp();

  return (
    <Grid container>
      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.image.tab[ImageTab.UPLOAD]}
        </Typography>
        <Typography variant="body2">
          {locale.createDealWizard.image.help[ImageTab.UPLOAD]}
        </Typography>
      </Grid>
      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.image.tab[ImageTab.STOCK]}
        </Typography>
        <Typography variant="body2">
          {locale.createDealWizard.image.help[ImageTab.STOCK]}
        </Typography>
      </Grid>
    </Grid>
  );
}

