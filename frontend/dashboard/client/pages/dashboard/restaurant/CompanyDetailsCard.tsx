import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Hidden,
  Typography,
  withStyles,
  WithStyles,
  withWidth,
}                                    from '@material-ui/core';
import { WithWidthProps }            from '@material-ui/core/withWidth';
import { ApiCompany }                from '@my-old-startup/common/validation';
import { Loading }                   from '@my-old-startup/frontend-common/components/Loading';
import { Paragraphs }                from '@my-old-startup/frontend-common/components/Paragraphs';
import { globalMessageService }      from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { capitalize }                from '@my-old-startup/frontend-common/utils/format';
import { isMissingDetails }          from '@my-old-startup/frontend-common/utils/utils';
import { observer }                  from 'mobx-react';
import * as React                    from 'react';
import { CompanyType }               from '../../../../../../common/enums';
import { locale as commonLocale }    from '../../../../../common/locales';
import { CompanyFormField }          from '../../../common/company/CompanyFormField';
import { CompanyTagSelect }          from '../../../common/company/CompanyTagsSelect';
import { FormTooltip }               from '../../../common/FormTooltip';
import { locale }                    from '../../../common/locales';
import { getValidationError }        from '../../../common/utils/utils';
import { dashboardCompanyFacade }    from '../../../facade/DashboardCompanyFacade';
import { BaseCompanyFormCard }       from '../../../form/BaseCompanyFormCard';
import { companyStore }              from '../../../stores/CompanyStore';
import { CompanySocialMedia }        from './CompanySocialMedia';
import { CompanyOpeningHoursPicker } from './openingHours/CompanyOpeningHoursPicker';

const styles = () =>
  // noinspection JSSuspiciousNameCombination
  createStyles(
    {
      controlLabelRootClassName: {
        marginRight: 0,
      },
      link:                      {
        textDecoration: 'underline',
        cursor:         'pointer',
      },
      para:                      {
          marginTop: 0,
      },
    },
  );

type Props = {} & WithStyles<typeof styles> & WithWidthProps;
type State = {
  dialogContent: React.ReactNode;
}

@observer
class _CompanyDetailsCard extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      dialogContent: undefined,
    };
  }

  private setDialogContent(content: React.ReactNode): void {
    this.setState({ dialogContent: content });
  }

  public render(): JSX.Element {
    const company            = companyStore.currentCompany;
    const errors             = companyStore.detailsValidationError;
    const { classes, width } = this.props;
    const { dialogContent }  = this.state;

    if (company === undefined) {
      return <Loading/>;
    }

    const hasWarning = isMissingDetails(company);

    let isDirty = false;
    if (companyStore.isDirty) {
      isDirty = companyStore.checkDirty(Object.keys(company.details));
    }

    return (
      <BaseCompanyFormCard
        isDirty={isDirty}
        header={(
          <>
            {locale.forms.apiCompanyDetails.header}
            <FormTooltip inline title={locale.forms.apiCompanyDetails.tooltips.description}/>
          </>
        )}

        hasWarning={hasWarning}
        submit={() => this.send(company)}>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <Typography variant="caption" component={'p' as any}>
              {locale.forms.apiCompanyDetails.descriptionHint}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography onClick={() => {
              this.setDialogContent(<Paragraphs className={classes.para}
                                                variant="body2">{locale.forms.apiCompanyDetails.descriptionHintLink1Text}</Paragraphs>);
            }} variant="caption" component={'a' as any} className={classes.link}>
              {locale.forms.apiCompanyDetails.descriptionHintLink1}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography onClick={() => {
              this.setDialogContent(<Paragraphs
                variant="body2">{locale.forms.apiCompanyDetails.descriptionHintLink2Text}</Paragraphs>);
            }} variant="caption" component={'a' as any} className={classes.link}>
              {locale.forms.apiCompanyDetails.descriptionHintLink2}
            </Typography>
          </Grid>

          <Grid item xs={12}>

            <CompanyFormField
              errorMessage={getValidationError(errors, 'description')}
              value={company.details.description || ''}
              propertyName="description"
              onValueChange={(value) => company.details.description = value}
              label={locale.forms.apiCompanyDetails.fields.description}
              multiline
              rows="10"/>

          </Grid>

         {/* CORONA <Grid item xs={12}>
            <CompanyFormCheckbox propertyName="prefersReservations"
                                 label={locale.forms.apiCompanyDetails.fields.prefersReservations}
                                 value={company.details.prefersReservations}
                                 onCheckboxChange={(checked) => company.details.prefersReservations = checked}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />
            <FormTooltip title={locale.forms.apiCompanyDetails.tooltips.prefersReservations}
                         inline={width !== 'xs'}
            />
          </Grid>*/}

          <Hidden smUp>
            <Grid item xs={12}>
            </Grid>
          </Hidden>

          <Grid item xs={12}>
            <CompanyTagSelect/>
          </Grid>

          {company.contact.type !== CompanyType.FOODTRUCK && (
            <Grid item xs={12}>
              <CompanyOpeningHoursPicker company={company} defaultOpen={false}/>
            </Grid>
          )}

          <Grid item xs={12}>
            <CompanySocialMedia/>
          </Grid>

        </Grid>

        <Dialog open={dialogContent !== undefined}
                onBackdropClick={() => this.setDialogContent(undefined)}
                onEscapeKeyDown={() => this.setDialogContent(undefined)}
        >
          <DialogContent>
            {dialogContent}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setDialogContent(undefined)}
                    variant="contained"
            >
              {capitalize(commonLocale.common.words.close)}
            </Button>
          </DialogActions>
        </Dialog>
      </BaseCompanyFormCard>
    );
  }

  private send(company: ApiCompany): void {
    companyStore.isValidationEnabled = true;

    if (companyStore.detailsValidationError.length !== 0) {
      return;
    }

    dashboardCompanyFacade.updateDetails(company.details, company.id)
      .then(() => globalMessageService.pushMessage({
                                                     message: locale.forms.apiCompanyDetails.saveMessage,
                                                     variant: 'success',
                                                   }))
      .catch(() => globalMessageService.pushMessage({
                                                      message: locale.common.error.defaultErrorMessage,
                                                      variant: 'error',
                                                    }));

  }
}

export const CompanyDetailsCard = withWidth()(withStyles(styles)(_CompanyDetailsCard));
