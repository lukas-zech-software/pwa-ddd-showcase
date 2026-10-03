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
class _CoronaDonationsDetailsCard extends React.Component<Props, State> {
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
            <CompanyFormCheckbox propertyName="acceptsDonations"
                                 label={locale.forms.corona.donations.checkbox}
              /*!! because value maybe undefined --> uncontrolled */
                                 value={!!company.corona.acceptsDonations}
                                 onCheckboxChange={(checked) => company.corona.acceptsDonations = checked}
                                 controlLabelRootClassName={classes.controlLabelRootClassName}
                                 errorMessage={undefined}
            />
            <FormTooltip title={locale.forms.corona.donations.checkboxTooltip}
                         inline={width !== 'xs'}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" component={'p' as any}>
              {locale.forms.corona.donations.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <CompanyFormField
              onClick={(e) => {
                if (!company.corona.acceptsDonations) {
                  company.corona.acceptsDonations = true;
                  const element                   = e.currentTarget.getElementsByTagName('input')[0];
                  setTimeout(() => {
                    element.focus();
                  }, 500);
                }
              }}
              optional
              disabled={!company.corona.acceptsDonations}
              errorMessage={getValidationError(errors, 'donationsLink')}
              value={company.corona.donationsLink || ''}
              propertyName="donationsLink"
              onValueChange={(value) => company.corona.donationsLink = value}
              label={locale.forms.corona.donations.linkLabel}
            />

          </Grid>

          <Grid item xs={6}>
            <Typography onClick={() => {
              this.setDialogContent(
                <Paragraphs className={classes.para}
                            variant="body2">{locale.forms.corona.donations.descriptionHintLink1Text}</Paragraphs>,
                locale.forms.corona.donations.descriptionHintLink1,
              );
            }} variant="caption" component={'a' as any} className={classes.link}>
              {locale.forms.corona.donations.descriptionHintLink1}
            </Typography>
          </Grid>

          <Grid item xs={12}>

            <CompanyFormField
              onClick={(e) => {
                if (!company.corona.acceptsDonations) {
                  company.corona.acceptsDonations = true;
                }
              }}
              disabled={!company.corona.acceptsDonations}
              errorMessage={getValidationError(errors, 'donationsDescription')}
              value={company.corona.donationsDescription || ''}
              propertyName="donationsDescription"
              onValueChange={(value) => company.corona.donationsDescription = value}
              label={locale.forms.corona.donations.textLabel}
              multiline
              rows="10"/>

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

export const CoronaDonationsDetailsCard = withWidth()(withStyles(styles)(_CoronaDonationsDetailsCard));
