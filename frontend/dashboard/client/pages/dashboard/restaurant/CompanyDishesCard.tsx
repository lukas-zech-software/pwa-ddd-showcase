import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  Theme,
  Typography,
  withStyles,
  WithStyles,
  withWidth,
} from '@material-ui/core';
import { WithWidthProps } from '@material-ui/core/withWidth';
import { Add, ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { Loading }                from '@my-old-startup/frontend-common/components/Loading';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { capitalize }             from '@my-old-startup/frontend-common/utils/format';
import { ValidationError }        from 'class-validator';
import { find, get }              from 'lodash';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import { IApiCompany }            from '../../../../../../common/interfaces';
import { locale as commonLocale } from '../../../../../common/locales';
import { CompanyDishInput }       from '../../../common/company/CompanyDishInput';
import { CompanyFormField }       from '../../../common/company/CompanyFormField';
import { CurrencyFormField }      from '../../../common/CurrencyFormField';
import { FormTooltip }            from '../../../common/FormTooltip';
import { locale }                 from '../../../common/locales';
import { dashboardCompanyFacade } from '../../../facade/DashboardCompanyFacade';
import { BaseCompanyFormCard }    from '../../../form/BaseCompanyFormCard';
import { companyStore }           from '../../../stores/CompanyStore';

const styles = (theme: Theme) =>
  // noinspection JSSuspiciousNameCombination
  createStyles({
    controlLabelRootClassName: {
      marginRight: 0,
    },
    link: {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    para: {
      marginTop: 0,
    },
    arrowColumn: {
      maxWidth: theme.spacing(5),
      paddingTop: theme.spacing(2),
      textAlign: 'center',
    },
    indexRow: {
      padding: theme.spacing(2),
    },
  });

type Props = {} & WithStyles<typeof styles> & WithWidthProps;
type State = {
  dialogContent: React.ReactNode;
  fadeIndex: boolean;
};

@observer
class _CompanyDishesCard extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      dialogContent: undefined,
      fadeIndex: true,
    };
  }

  private setDialogContent(content: React.ReactNode): void {
    this.setState({ dialogContent: content });
  }

  private addNewDish() {
    const company = companyStore.currentCompany!;
    companyStore.isValidationEnabled = false;

    company.dishes = company.dishes || [];
    company.dishes.push({} as any);
    companyStore.addDirty('dishes');
    setTimeout(() => {
      window.scrollTo({
        top: 99999,
        behavior: 'smooth',
      });
      const inputs = document.getElementsByName('dishes.title');
      const newInput = inputs[inputs.length - 1];
      if (newInput) {
        newInput.focus();
      }
    }, 250);
  }

  public render(): JSX.Element {
    const company = companyStore.currentCompany;
    const errors = companyStore.dishesValidationError;
    const dishesErrors: ValidationError[] = get(errors, ['0', 'children'], []);
    const { classes, width } = this.props;
    const { dialogContent, fadeIndex } = this.state;

    if (company === undefined) {
      return <Loading />;
    }

    let isDirty = false;
    if (companyStore.isDirty) {
      isDirty = companyStore.checkDirty([
        'dishes',
        'dishes.title',
        'dishes.description',
        'dishes.price',
      ]);
    }

    return (
      <BaseCompanyFormCard
        isDirty={isDirty}
        header={
          <>
            {locale.forms.apiCompanyDishes.header}
            <FormTooltip inline title={locale.forms.apiCompanyDishes.tooltip} />
          </>
        }
        submit={() => this.send(company)}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="caption" component={'p' as any}>
              {locale.forms.apiCompanyDishes.descriptionHint}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography
              onClick={() => {
                this.setDialogContent(
                  <Grid container spacing={3}>
                    <Grid item xs={7}>
                      <CompanyFormField
                        value="Bauernschmaus"
                        label={locale.forms.apiCompanyDishes.fields.title}
                        propertyName="dishes.title"
                        onValueChange={() => void 0}
                        errorMessage={undefined}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={4}>
                      <CurrencyFormField
                        value={1549}
                        label={locale.forms.apiCompanyDishes.fields.price}
                        onValueChange={() => void 0}
                        errors={[]}
                        InputProps={{ readOnly: true }}
                        inline
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CompanyFormField
                        value={`mit Bratkartoffeln, Semmelknödel, Sauerkraut,\nWürstel und hausgemachte Röstzwiebeln`}
                        propertyName="dishes.description"
                        onValueChange={() => void 0}
                        label={locale.forms.apiCompanyDishes.fields.description}
                        errorMessage={undefined}
                        InputProps={{ readOnly: true }}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>,
                );
              }}
              variant="caption"
              component={'a' as any}
              className={classes.link}
            >
              {locale.forms.apiCompanyDishes.exampleHintLink}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              startIcon={<Add />}
              variant="contained"
              color="primary"
              size="small"
              onClick={() => this.addNewDish()}
            >
              {locale.forms.apiCompanyDishes.addButton}
            </Button>
          </Grid>

          {!company.dishes && (
            <Grid item xs={12}>
              <Typography variant="h6" component={'p' as any}>
                {locale.forms.apiCompanyDishes.noDishes}
              </Typography>
            </Grid>
          )}

          {(company.dishes || []).map((dish, i) => (
            <Grid container key={i}>
              <Grid item xs={12} className={classes.indexRow}>
                <Typography
                  variant="h6"
                  component={'p' as any}
                  style={{ fontSize: '100%' }}
                >
                  {`${i + 1}. ${locale.forms.apiCompanyDishes.cardHeader}`}
                </Typography>
              </Grid>
              <Grid item xs={1} className={classes.arrowColumn}>
                <Grid container>
                  <Grid item xs={12}>
                    <IconButton
                      size="small"
                      disabled={i === 0}
                      onClick={() => {
                        this.setState({ fadeIndex: false }, () => {
                          companyStore.addDirty('dishes');
                          company.dishes!.splice(
                            i - 1,
                            0,
                            ...company.dishes!.splice(i, 1),
                          );
                          setTimeout(
                            () => this.setState({ fadeIndex: true }),
                            20,
                          );
                        });
                      }}
                    >
                      <ArrowUpward fontSize="inherit" />
                    </IconButton>
                  </Grid>
                  <Grid item xs={12}>
                    <IconButton
                      size="small"
                      disabled={i === company.dishes!.length - 1}
                      onClick={() => {
                        this.setState({ fadeIndex: false }, () => {
                          companyStore.addDirty('dishes');
                          company.dishes!.splice(
                            i + 1,
                            0,
                            ...company.dishes!.splice(i, 1),
                          );
                          setTimeout(
                            () => this.setState({ fadeIndex: true }),
                            20,
                          );
                        });
                      }}
                    >
                      <ArrowDownward fontSize="inherit" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={11}>
                <Fade
                  in={fadeIndex}
                  timeout={{
                    exit: 0,
                    enter: i * 400,
                  }}
                >
                  <Grid item xs={12}>
                    <CompanyDishInput
                      index={i}
                      dish={dish}
                      errors={get(
                        find(dishesErrors, { property: i.toString() }),
                        'children',
                        [],
                      )}
                      onRemove={() => {
                        company.dishes!.splice(i, 1);
                        companyStore.addDirty('dishes');
                      }}
                    />
                  </Grid>
                </Fade>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={dialogContent !== undefined}
          onBackdropClick={() => this.setDialogContent(undefined)}
          onEscapeKeyDown={() => this.setDialogContent(undefined)}
        >
          <DialogContent style={{ padding: 20 }}>{dialogContent}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setDialogContent(undefined)}
              variant="contained"
            >
              {capitalize(commonLocale.common.words.close)}
            </Button>
          </DialogActions>
        </Dialog>
      </BaseCompanyFormCard>
    );
  }

  private send(company: IApiCompany): void {
    companyStore.isValidationEnabled = true;

    if (companyStore.dishesValidationError.length !== 0) {
      return;
    }
    const dishes = company.dishes || [];

    dashboardCompanyFacade
      .updateDishes({ dishes }, company.id)
      .then(() =>
        globalMessageService.pushMessage({
          message: locale.forms.apiCompanyDishes.saveMessage,
          variant: 'success',
        }),
      )
      .catch(() =>
        globalMessageService.pushMessage({
          message: locale.common.error.defaultErrorMessage,
          variant: 'error',
        }),
      );
  }
}

export const CompanyDishesCard = withWidth()(
  withStyles(styles)(_CompanyDishesCard),
);
