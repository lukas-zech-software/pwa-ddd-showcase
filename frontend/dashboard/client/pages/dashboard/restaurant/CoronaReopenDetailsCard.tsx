import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Theme,
  Typography,
  withStyles,
  WithStyles,
  withWidth,
}                                 from '@material-ui/core';
import { WithWidthProps }         from '@material-ui/core/withWidth';
import { Loading }                from '@my-old-startup/frontend-common/components/Loading';
import { Paragraphs }             from '@my-old-startup/frontend-common/components/Paragraphs';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import { capitalize }             from '@my-old-startup/frontend-common/utils/format';
import { runInAction }            from 'mobx';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import {
  CompanyFormCheckbox,
  CompanyFormField,
}                                 from '../../../common/company/CompanyFormField';
import { FormTooltip }            from '../../../common/FormTooltip';
import { locale }                 from '../../../common/locales';
import { getValidationError }     from '../../../common/utils/utils';
import { companyStore }           from '../../../stores/CompanyStore';

const styles = (theme: Theme) =>
  // noinspection JSSuspiciousNameCombination
  createStyles(
    {
      controlLabelRootClassName: {
        marginRight: 0,
      },
      reservationBlock:          {
        [theme.breakpoints.up('md')]: {
          marginLeft: theme.spacing(2),
        },
      },
      inlineCheckbox:            {
        marginTop: -6,
      },
      lowRow:                    {
        paddingTop:    '0px !important',
        paddingBottom: '0px !important',
      },
      lowRowCheckbox:            {
        [theme.breakpoints.down('sm')]: {
          paddingTop:    theme.spacing(0) + ' !important',
          paddingBottom: theme.spacing(0) + ' !important',
          '&>div':       {
            marginTop:    theme.spacing(0) + ' !important',
            marginBottom: theme.spacing(0) + ' !important',
          },
        },
      },
      link:                      {
        textDecoration: 'underline',
        cursor:         'pointer',
      },
      subtitle:                  {
        fontWeight: 500,
      },
      para:                      {
        marginTop: 10,
      },
    },
  );

type Props = {} & WithStyles<typeof styles> & WithWidthProps;
type State = {
  dialogContent: React.ReactNode;
  dialogTitle: React.ReactNode;
}

@observer
class _CoronaReopenDetailsCard extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      dialogContent: undefined,
      dialogTitle:   undefined,
    };
  }

  private setDialogContent(content: React.ReactNode, title: React.ReactNode): void {
    this.setState({
                    dialogContent: content,
                    dialogTitle:   title,
                  });
  }

  public render(): JSX.Element {
    const company                        = companyStore.currentCompany;
    const errors                         = companyStore.companyCoronaValidationError;
    const { classes, width }             = this.props;
    const { dialogContent, dialogTitle } = this.state;

    if (company === undefined) {
      return <Loading/>;
    }

    return (
      <>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <CompanyFormCheckbox propertyName="offersReopen"
                                 label={locale.forms.corona.reopen.checkbox}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!!company.corona.offersReopen}
                                 onCheckboxChange={(checked) => company.corona.offersReopen = checked}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />
            <FormTooltip title={locale.forms.corona.reopen.checkboxTooltip}
                         inline={width !== 'xs'}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" component={'p' as any}>
              {locale.forms.corona.reopen.description}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography onClick={() => {
              this.setDialogContent(
                <Paragraphs className={classes.para}
                            variant="body2">{locale.forms.corona.reopen.descriptionHintLink1Text}</Paragraphs>,
                locale.forms.corona.reopen.descriptionHintLink1,
              );
            }} variant="caption" component={'a' as any} className={classes.link}>
              {locale.forms.corona.reopen.descriptionHintLink1}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <CompanyFormField
              onClick={() => company.corona.offersReopen = true}
              softDisabled={!company.corona.offersReopen}
              errorMessage={getValidationError(errors, 'reopenDescription')}
              value={company.corona.reopenDescription || ''}
              propertyName="reopen.reopenDescription"
              onValueChange={(value) => company.corona.reopenDescription = value}
              label={locale.forms.corona.reopen.textLabel}
              multiline
              rows="10"/>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" component={'p' as any} className={classes.subtitle}>
              1.1 {locale.forms.corona.openRestrictions.indoorOutdoor}
            </Typography>
          </Grid>

          <Grid item xs={6} md={2} className={classes.lowRow}>
            <CompanyFormCheckbox propertyName="reopen.indoor"
                                 label={locale.forms.corona.openRestrictions.indoor}
                                 disabledAndEmpty={!company.corona.offersReopen}
                                 onFormClick={() => company.corona.offersReopen = true}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!!(company.corona.openRestrictions ? company.corona.openRestrictions.indoor : false)}
                                 onCheckboxChange={(indoor) => {
                                   company.corona.offersReopen     = true;
                                   company.corona.openRestrictions = {
                                     ...company.corona.openRestrictions,
                                     indoor,
                                   };

                                   if (!company.corona.openRestrictions.indoor && !company.corona.openRestrictions.outdoor) {
                                     company.corona.openRestrictions.outdoor = true;
                                   }
                                 }}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />
          </Grid>

          <Grid item xs={6} md={3} className={classes.lowRow}>
            <CompanyFormCheckbox propertyName="reopen.outdoor"
                                 label={locale.forms.corona.openRestrictions.outdoor}
                                 disabledAndEmpty={!company.corona.offersReopen}
                                 onFormClick={() => company.corona.offersReopen = true}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!!(company.corona.openRestrictions ? company.corona.openRestrictions.outdoor : false)}
                                 onCheckboxChange={(outdoor) => {
                                   company.corona.offersReopen     = true;
                                   company.corona.openRestrictions = {
                                     ...company.corona.openRestrictions,
                                     outdoor,
                                   };

                                   if (!company.corona.openRestrictions.indoor && !company.corona.openRestrictions.outdoor) {
                                     company.corona.openRestrictions.indoor = true;
                                   }
                                 }}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />
          </Grid>


          <Grid item xs={12}>
            <Typography variant="subtitle1" component={'p' as any} className={classes.subtitle}>
              1.2 {locale.forms.corona.openRestrictions.reservationHeader}
            </Typography>
          </Grid>

          <Grid item xs={12} md={2} className={classes.lowRowCheckbox}>
            <CompanyFormCheckbox propertyName="reopen.reservationNecessary"

                                 label={locale.forms.corona.openRestrictions.reservationNecessary}
                                 disabledAndEmpty={!company.corona.offersReopen}
                                 onFormClick={() => company.corona.offersReopen = true}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!!(company.corona.openRestrictions ? company.corona.openRestrictions.reservationNecessary === true : false)}
                                 onCheckboxChange={() => runInAction(() => {
                                   company.corona.openRestrictions = {
                                     ...company.corona.openRestrictions,
                                     reservationNecessary: true,
                                   };
                                 })}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />
          </Grid>
          <Grid item xs={12} md={4} className={classes.lowRowCheckbox}>
            <CompanyFormCheckbox propertyName="reopen.reservationPreferred"
                                 label={locale.forms.corona.openRestrictions.reservationPreferred}
                                 disabledAndEmpty={!company.corona.offersReopen}
                                 onFormClick={() => company.corona.offersReopen = true}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!!(company.corona.openRestrictions ? company.corona.openRestrictions.reservationNecessary === false : false)}
                                 onCheckboxChange={() => runInAction(() => {
                                   company.corona.openRestrictions = {
                                     ...company.corona.openRestrictions,
                                     reservationNecessary: false,
                                   };
                                 })}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />
          </Grid>
          <Grid item xs={12} md={3} className={classes.reservationBlock + ' ' + classes.lowRowCheckbox}>
            <CompanyFormCheckbox propertyName="reopen.reservationNo"
                                 label={locale.forms.corona.openRestrictions.reservationNo}
                                 disabledAndEmpty={!company.corona.offersReopen}
                                 onFormClick={() => company.corona.offersReopen = true}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!!(company.corona.openRestrictions ? company.corona.openRestrictions.reservationNecessary === undefined : false)}
                                 onCheckboxChange={() => runInAction(() => {
                                   if (company.corona.openRestrictions) {
                                     company.corona.openRestrictions.reservationNecessary = undefined;
                                   }
                                 })}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />
          </Grid>

          {company.corona.openRestrictions && company.corona.openRestrictions.reservationNecessary !== undefined && (
            <>
              <Grid item xs={12} className={classes.reservationBlock}>
                <Typography variant="subtitle1" component={'p' as any} className={classes.subtitle}>
                  {locale.forms.corona.openRestrictions.reservationKindHeader}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} className={classes.reservationBlock}>

                <CompanyFormField
                  value={company.corona.openRestrictions ? company.corona.openRestrictions.reservationsLink || '' : ''}
                  errorMessage={undefined}
                  propertyName="reopen.reservationsLink"
                  emptyStringToUndefined
                  onValueChange={(reservationsLink) => company.corona.openRestrictions = {
                    ...company.corona.openRestrictions,
                    reservationsLink:  reservationsLink,
                    phoneReservations: undefined,
                  }}
                  label={locale.forms.apiCompanyDetails.fields.reservationsLink!}/>

              </Grid>

              <Grid item xs={12} md={4}>

                <CompanyFormCheckbox propertyName="reopen.phoneReservations"
                                     label={locale.forms.corona.openRestrictions.phoneReservations}
                                     disabledAndEmpty={!company.corona.offersReopen}
                                     onFormClick={() => company.corona.offersReopen = true}
                  /*!! because value maybe undefined --> uncontrolled */
                                     value={!!(company.corona.openRestrictions && company.corona.openRestrictions.phoneReservations)}
                                     onCheckboxChange={(phoneReservations) => runInAction(() => company.corona.openRestrictions = {
                                       ...company.corona.openRestrictions,
                                       phoneReservations,
                                       reservationsLink: undefined,
                                     })}
                                     errorMessage={undefined}
                />

              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" component={'p' as any} className={classes.subtitle}>
              1.3 {locale.forms.corona.openRestrictions.maxPersonCount}
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>

            <CompanyFormField
              onClick={() => company.corona.offersReopen = true}
              softDisabled={!company.corona.offersReopen}
              value={company.corona.openRestrictions ? company.corona.openRestrictions.maxPersonCount || '' : ''}
              errorMessage={undefined}
              propertyName="reopen.maxPersonCount"
              onValueChange={(maxPersonCount) => company.corona.openRestrictions = {
                ...company.corona.openRestrictions,
                maxPersonCount: maxPersonCount || undefined,
              }}
              InputProps={{
                endAdornment: <InputAdornment
                                onClick={e => {
                                  if (e.currentTarget && e.currentTarget.parentElement) {
                                    const input = e.currentTarget.parentElement.getElementsByTagName('input');
                                    if (input && input[0]) {
                                      input[0].focus();
                                    }
                                  }
                                }}
                                style={{ cursor: 'pointer' }}
                                position="end">{locale.forms.corona.openRestrictions.people}</InputAdornment>,
              }}
              label=""
              type="number"/>

          </Grid>

          <Grid item xs={12} md={4}>

            <CompanyFormCheckbox propertyName="reopen.maxPersonCount"
                                 label={locale.forms.corona.openRestrictions.noRestriction}
                                 disabledAndEmpty={!company.corona.offersReopen}
                                 onFormClick={() => company.corona.offersReopen = true}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!(company.corona.openRestrictions && company.corona.openRestrictions.maxPersonCount)}
                                 onCheckboxChange={() => runInAction(() => {
                                   if (company.corona.openRestrictions) {
                                     company.corona.openRestrictions.maxPersonCount = undefined;
                                   }
                                 })}
                                 className={classes.inlineCheckbox}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />

          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" component={'p' as any} className={classes.subtitle}>
              1.4 {locale.forms.corona.openRestrictions.maxStayTime}
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>

            <CompanyFormField
              onClick={() => company.corona.offersReopen = true}
              softDisabled={!company.corona.offersReopen}
              value={company.corona.openRestrictions ? company.corona.openRestrictions.maxStayTime || '' : ''}
              errorMessage={undefined}
              propertyName="reopen.maxStayTime"
              onValueChange={(maxStayTime) => company.corona.openRestrictions = {
                ...company.corona.openRestrictions,
                maxStayTime: maxStayTime || undefined,
              }}
              InputProps={{
                endAdornment: <InputAdornment
                                onClick={e => {
                                  if (e.currentTarget && e.currentTarget.parentElement) {
                                    const input = e.currentTarget.parentElement.getElementsByTagName('input');
                                    if (input && input[0]) {
                                      input[0].focus();
                                    }
                                  }
                                }}
                                style={{ cursor: 'pointer' }}
                                position="end">{locale.forms.corona.openRestrictions.hours}</InputAdornment>,
              }}
              label=""
              type="number"/>

          </Grid>

          <Grid item xs={12} md={4}>

            <CompanyFormCheckbox propertyName="reopen.maxStayTime"
                                 label={locale.forms.corona.openRestrictions.noRestriction}
                                 disabledAndEmpty={!company.corona.offersReopen}
                                 onFormClick={() => company.corona.offersReopen = true}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!(company.corona.openRestrictions && company.corona.openRestrictions.maxStayTime)}
                                 onCheckboxChange={() => runInAction(() => company.corona.openRestrictions = {
                                   ...company.corona.openRestrictions,
                                   maxStayTime: undefined,
                                 })}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 className={classes.inlineCheckbox}
                                 errorMessage={undefined}
            />

          </Grid>
        </Grid>
        <Dialog open={dialogContent !== undefined}
                onBackdropClick={() => this.setDialogContent(undefined, undefined)}
                onEscapeKeyDown={() => this.setDialogContent(undefined, undefined)}
        >
          <DialogTitle>
            {dialogTitle}
          </DialogTitle>
          <DialogContent>
            {dialogContent}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setDialogContent(undefined, undefined)}
                    variant="contained"
            >
              {capitalize(commonLocale.common.words.close)}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export const CoronaReopenDetailsCard = withWidth()(withStyles(styles)(_CoronaReopenDetailsCard));
