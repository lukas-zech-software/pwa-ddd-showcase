import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  withStyles,
  WithStyles,
  withWidth,
}                                 from '@material-ui/core';
import {
  DefaultComponentProps,
  OverridableTypeMap,
  OverrideProps,
}                                 from '@material-ui/core/OverridableComponent';
import { WithWidthProps }         from '@material-ui/core/withWidth';
import { Loading }                from '@my-old-startup/frontend-common/components/Loading';
import { Paragraphs }             from '@my-old-startup/frontend-common/components/Paragraphs';
import { capitalize }             from '@my-old-startup/frontend-common/utils/format';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import { locale as commonLocale } from '../../../../../common/locales';
import {
  CompanyFormCheckbox,
  CompanyFormField,
}                                 from '../../../common/company/CompanyFormField';
import { FormTooltip }            from '../../../common/FormTooltip';
import { locale }                 from '../../../common/locales';
import { getValidationError }     from '../../../common/utils/utils';
import { companyStore }           from '../../../stores/CompanyStore';

export interface OverridableComponent<M extends OverridableTypeMap> {
  <C extends any>(props: { component: C } & OverrideProps<M, C>): JSX.Element;

  (props: DefaultComponentProps<M>): JSX.Element;
}

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
class _CoronaCouponsDetailsCard extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      dialogContent: undefined,
      dialogTitle: undefined,
    };
  }

  private setDialogContent(content: React.ReactNode, title: React.ReactNode): void {
    this.setState({
                    dialogContent: content,
                    dialogTitle:   title,
                  });
  }

  public render(): JSX.Element {
    const company            = companyStore.currentCompany;
    const errors             = companyStore.companyCoronaValidationError;
    const { classes, width } = this.props;
    const { dialogContent,dialogTitle }  = this.state;

    if (company === undefined) {
      return <Loading/>;
    }

    return (
      <>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <CompanyFormCheckbox propertyName="offersCoupons"
                                 label={locale.forms.corona.coupons.checkbox}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!!company.corona.offersCoupons}
                                 onCheckboxChange={(checked) => company.corona.offersCoupons = checked}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />
            <FormTooltip title={locale.forms.corona.coupons.checkboxTooltip}
                         inline={width !== 'xs'}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" component={'p' as any}>
              {locale.forms.corona.coupons.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">
              <a href="https://www.dehoga-nrw.de/dehoga-nrw/umgang-mit-coronavirus/supportyourlokal-das-gutscheinbuch/"
                 target="_blank" rel="noopener noreferrer nofollow">
                {locale.forms.corona.coupons.dehogaLink}
              </a>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <CompanyFormField
              onClick={(e) => {
                if (!company.corona.offersCoupons) {
                  company.corona.offersCoupons = true;
                }
              }}
              optional
              disabled={!company.corona.offersCoupons}
              errorMessage={getValidationError(errors, 'couponsLink')}
              value={company.corona.couponsLink || ''}
              propertyName="couponsLink"
              onValueChange={(value) => company.corona.couponsLink = value}
              label={locale.forms.corona.coupons.linkLabel}
              />
          </Grid>

          <Grid item xs={12}>
            <Typography onClick={() => {
              this.setDialogContent(
                <Paragraphs className={classes.para}
                            variant="body2">{locale.forms.corona.coupons.descriptionHintLink1Text}</Paragraphs>,
                locale.forms.corona.coupons.descriptionHintLink1,
              );
            }} variant="caption" component={'a' as any} className={classes.link}>
              {locale.forms.corona.coupons.descriptionHintLink1}
            </Typography>
          </Grid>


          <Grid item xs={12}>

            <CompanyFormField
              onClick={(e) => {
                if (!company.corona.offersCoupons) {
                  company.corona.offersCoupons = true;
                }
              }}
              disabled={!company.corona.offersCoupons}
              errorMessage={getValidationError(errors, 'couponsDescription')}
              value={company.corona.couponsDescription || ''}
              propertyName="couponsDescription"
              onValueChange={(value) => company.corona.couponsDescription = value}
              label={locale.forms.corona.coupons.textLabel}
              multiline
              rows="10"/>

          </Grid>
        </Grid>

        <Dialog open={dialogContent !== undefined}
                onBackdropClick={() => this.setDialogContent(undefined,undefined)}
                onEscapeKeyDown={() => this.setDialogContent(undefined,undefined)}
        >
          <DialogTitle>
            {dialogTitle}
          </DialogTitle>
          <DialogContent>
            {dialogContent}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setDialogContent(undefined,undefined)}
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

export const CoronaCouponsDetailsCard = withWidth()(withStyles(styles)(_CoronaCouponsDetailsCard));
