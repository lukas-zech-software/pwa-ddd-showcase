import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Step,
  StepButton,
  StepConnector,
  StepLabel,
  Stepper,
  Theme,
  Typography,
}                                 from '@material-ui/core';
import { logService }             from '@my-old-startup/frontend-common/services/LogService';
import { useWidth }               from '@my-old-startup/frontend-common/utils/hooks';
import { plainToClass }           from 'class-transformer';
import clsx                       from 'clsx';
import { useObserver }            from 'mobx-react';
import * as React                 from 'react';
import { useState }               from 'react';
import {
  CompanyType,
  isSpecialType,
}                                 from '../../../../../../../common/enums';
import {
  ApiDeal,
  EMPTY_DEAL_ID,
}                                 from '../../../../../../../common/validation';
import { hasInsufficientBalance } from '../../../../common/deal/DealPublishConfirmationCard';
import { locale }                 from '../../../../common/locales';
import {
  WizardMode,
  WizardStep,
}                                 from '../../../../common/types';
import { companyStore }           from '../../../../stores/CompanyStore';
import {
  CreateDealWizardStepDate,
  CreateDealWizardStepDateHelp,
}                                 from './CreateDealWizardStepDate';
import {
  CreateDealWizardStepDescription,
  CreateDealWizardStepDescriptionHelp,
}                                 from './CreateDealWizardStepDescription';
import {
  CreateDealWizardStepDetails,
  CreateDealWizardStepDetailsHelp,
}                                 from './CreateDealWizardStepDetails';
import {
  CreateDealWizardStepImages,
  CreateDealWizardStepImagesHelp,
}                                 from './CreateDealWizardStepImage';
import {
  CreateDealWizardStepKind,
  CreateDealWizardStepKindHelp,
}                                 from './CreateDealWizardStepKind';
import {
  CreateDealWizardStepLocation,
  CreateDealWizardStepLocationHelp,
}                                 from './CreateDealWizardStepLocation';
import {
  CreateDealWizardStepSummary,
  CreateDealWizardStepSummaryHelp,
}                                 from './CreateDealWizardStepSummary';
import {
  CreateDealWizardDealType,
  CreateDealWizardStepType,
  CreateDealWizardStepTypeHelp,
}                                 from './CreateDealWizardStepType';
import {
  CreateDealWizardStepValue,
  CreateDealWizardStepValueHelp,
}                                 from './CreateDealWizardStepValue';
import { createDealWizardStore }  from './CreateDealWizardStore';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        card:                          {
          margin: theme.spacing(2),

          [theme.breakpoints.only('xs')]: {
            marginTop: 0,
            margin:    -theme.spacing(2),
          },
        },
        cardContentRoot:               {
          [theme.breakpoints.only('xs')]: {
            padding: theme.spacing(1),
          },
        },
        paperTop:                      {
          marginTop: theme.spacing(19),
        },
        paper:                         {
          margin:          theme.spacing(2),
          backgroundColor: 'transparent',
          color:           theme.palette.grey[700],

        },
        stepper:                       {
          paddingBottom: theme.spacing(2),

          [theme.breakpoints.only('xs')]: {
            padding:                              theme.spacing(0),
            '& .MuiStepConnector-lineHorizontal': {
              display: 'none',
            },
            '& .MuiStepButton-horizontal':        {
              paddingRight: theme.spacing(1),
            },
          },
        },
        dealTypeHeader:                {
          marginTop: theme.spacing(2),
        },
        stepContentHeader:             {
          marginTop: theme.spacing(2),
        },
        stepContent:                   {
          marginBottom:                   theme.spacing(1),
          marginRight:                    theme.spacing(8),
          marginLeft:                     theme.spacing(8),
          [theme.breakpoints.only('sm')]: {
            marginRight: theme.spacing(2),
            marginLeft:  theme.spacing(2),
          },
          [theme.breakpoints.only('xs')]: {
            marginRight: theme.spacing(1),
            marginLeft:  theme.spacing(1),
          },
        },
        stepIcon:                      {
          color: theme.palette.grey['400'],
        },
        alternativeLabel:              {
          '& .MuiStepLabel-label.MuiStepLabel-active.MuiStepLabel-alternativeLabel': {
            fontWeight: 'bold',
          },
        },
        connectorLine:                 {
          width:                          '70%',
          margin:                         '0 auto',
          [theme.breakpoints.only('xs')]: {
            display: 'none',
          },
        },
        helpContent:                   {
          [theme.breakpoints.down('sm')]: {
            width:     '90%',
            margin:    '0 auto',
            marginTop: theme.spacing(2),
            textAlign: 'center',
          },
        },
        helpButton:                    {
          pointer: 'cursor',
        },
        backButton:                    {
          marginRight: theme.spacing(1),
        },
        saveButton:                    {
          marginRight:     theme.spacing(1),
          backgroundColor: theme.palette.grey[400],
        },
        actions:                       {
          flexDirection: 'row-reverse',
          alignItems:    'flex-start',
          textAlign:     'end',
        },
        buttonContainer:               {
          width:                          '40%',
          [theme.breakpoints.down('sm')]: {
            width: '60%',
          },
        },
        bulkPublishDraftHintContainer: {
          position:     'relative',
          marginBottom: 20,
        },
        bulkPublishDraftHint:          {
          position:                       'absolute',
          left:                           -140,
          width:                          600,
          [theme.breakpoints.down('sm')]: {
            left:  -100,
            width: 250,
            top:   60,
          },
        },
      },
    ),
);

/**
 * Correct the step if optional steps were skipped
 * @param currentStep
 * @param isIndex
 */
function getCorrectedStep(currentStep: WizardStep, isIndex = false): WizardStep {
  /*const company = companyStore.currentCompany!;
  if (company.contact.type !== CompanyType.FOODTRUCK && currentStep >= WizardStep.LOCATION) {
    return currentStep + (isIndex ? -1 : 1);
  }
  */
  return currentStep;
}

function getContent(currentStep: WizardStep, shouldValidate: boolean): React.ReactNode {
  const isSpecial = isSpecialType(createDealWizardStore.deal.type);
  const company   = companyStore.currentCompany!;

  switch (currentStep) {
    case WizardStep.KIND:
      return <CreateDealWizardStepKind/>;
    case WizardStep.TYPE:
      return isSpecial ? <CreateDealWizardStepType/> : <CreateDealWizardDealType/>;
    case WizardStep.DESCRIPTION:
      return <CreateDealWizardStepDescription validate={shouldValidate}/>;
    case WizardStep.DETAILS:
      return (
        <>
          <CreateDealWizardStepDetails validate={shouldValidate}/>
          {company.contact.type === CompanyType.FOODTRUCK && <CreateDealWizardStepLocation validate={shouldValidate}/>}
        </>
      );
    case WizardStep.VALUE:
      return <CreateDealWizardStepValue validate={shouldValidate}/>;
    case WizardStep.DATE:
      return <CreateDealWizardStepDate validate={shouldValidate}/>;
    case WizardStep.IMAGE:
      return <CreateDealWizardStepImages validate={shouldValidate}/>;
    case WizardStep.SUMMARY:
      return <CreateDealWizardStepSummary/>;
    default:
      return 'Unknown stepIndex';
  }
}

function getHelpContent(currentStep: WizardStep): React.ReactNode {
  const company = companyStore.currentCompany!;

  switch (currentStep) {
    case WizardStep.KIND:
      return <CreateDealWizardStepKindHelp/>;
    case WizardStep.TYPE:
      return <CreateDealWizardStepTypeHelp/>;
    case WizardStep.DESCRIPTION:
      return <CreateDealWizardStepDescriptionHelp/>;
    case WizardStep.DETAILS:
      return (
        <>
          <CreateDealWizardStepDetailsHelp/>
          {company.contact.type === CompanyType.FOODTRUCK && <CreateDealWizardStepLocationHelp/>}
        </>
      );
    case WizardStep.VALUE:
      return <CreateDealWizardStepValueHelp/>;
    case WizardStep.DATE:
      return <CreateDealWizardStepDateHelp/>;
    case WizardStep.IMAGE:
      return <CreateDealWizardStepImagesHelp/>;
    case WizardStep.SUMMARY:
      return <CreateDealWizardStepSummaryHelp/>;
    default:
      return 'Unknown stepHelp';
  }
}

function isStepValid(currentStep: WizardStep): boolean {
  const company = companyStore.currentCompany!;

  switch (currentStep) {
    case WizardStep.KIND:
    case WizardStep.TYPE:
      return true;
    case WizardStep.DESCRIPTION:
      return createDealWizardStore.validateDescription().length === 0;
    case WizardStep.DETAILS:
      if (company.contact.type === CompanyType.FOODTRUCK) {
        return createDealWizardStore.validateDetails().length === 0 && createDealWizardStore.validateLocation().length === 0;
      }
      return createDealWizardStore.validateDetails().length === 0;
    case WizardStep.VALUE: {
      return createDealWizardStore.validateValue().length === 0;
    }
    case WizardStep.DATE: {
      const isValid = createDealWizardStore.validateDate().length === 0;
      if (isValid && createDealWizardStore.deal.id === EMPTY_DEAL_ID) {
        // create deal now, to be able to assign the image
        createDealWizardStore.createDeal().catch((error) => {
          logService.error('Error while creating deal', error);
        });
      }
      return isValid;
    }
    case WizardStep.IMAGE:
      return createDealWizardStore.validateImage().length === 0;
    case WizardStep.SUMMARY: {
      return true;
    }
    default:
      return false;
  }
}

type Props = {
  mode: WizardMode;
};

export function CreateDealWizardBase(props: Props): JSX.Element {
  const classes                             = useStyles({});
  const width                               = useWidth();
  const isNotXs                             = width !== 'xs';
  const nonLinear                           = props.mode !== WizardMode.CREATE;
  const [currentStep, setCurrentStep]       = useState<WizardStep>(WizardStep.KIND);
  const [highestStep, setHighestStep]       = useState<WizardStep>(nonLinear ? WizardStep.SUMMARY : WizardStep.KIND);
  const [shouldValidate, setShouldValidate] = useState<boolean>(false);
  const isSummary                           = getCorrectedStep(currentStep) === WizardStep.SUMMARY;
  const deal                                = createDealWizardStore.deal;
  const orderedSteps                        = [
    WizardStep.KIND,
    WizardStep.TYPE,
    WizardStep.DESCRIPTION,
    WizardStep.DETAILS,
    WizardStep.VALUE,
    WizardStep.DATE,
    WizardStep.IMAGE,
    WizardStep.SUMMARY,
  ];

  window.onhashchange = (e: any) => {
    const newStep = parseInt(e.newURL.split('#')[1], 10);
    const oldStep = parseInt(e.oldURL.split('#')[1], 10);
    if (isNaN(newStep) === false && isNaN(oldStep) === false) {
      if (newStep <= oldStep) {
        // only navigate backwards, ignore forward
        setCurrentStep(currentStep - 1);
      }
    } else {
      setCurrentStep(0);
    }
  };

  function canBePublished(): boolean {
    const instance = plainToClass(ApiDeal, createDealWizardStore.deal);
    return instance.canBePublished && hasInsufficientBalance() === false;
  }

  function navigateIfValid(step: WizardStep, isIndex = false): void {
    const correctedNextStep    = getCorrectedStep(step, isIndex);
    const correctedCurrentStep = getCorrectedStep(currentStep);

    if (isStepValid(correctedCurrentStep) && correctedNextStep <= highestStep + 1) {
      setShouldValidate(false);
      history.pushState('', document.title, `${window.location.pathname}#${correctedNextStep}`);
      setHighestStep(Math.max(correctedNextStep, highestStep));
      return setCurrentStep(correctedNextStep);
    }
    setShouldValidate(true);
  }

  function getButtons(): React.ReactNode {
    if (isSummary === false) {
      return (
        <Grid item>
          <Button variant="contained" color="primary"
                  onClick={() => {
                    navigateIfValid(getCorrectedStep(currentStep + 1), true);
                  }}>
            {locale.createDealWizard.buttons.next}
          </Button>
        </Grid>
      );
    }

    return (
      <>
        <Grid item>
          <Button className={classes.saveButton} onClick={() => createDealWizardStore.updateDeal()}>
            {locale.createDealWizard.buttons.save}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained"
                  color="primary"
                  disabled={canBePublished() === false}
                  onClick={() => {
                    if (canBePublished()) {
                      return createDealWizardStore.publishDeal();
                    }
                  }}>
            {locale.createDealWizard.buttons.publish}
          </Button>
        </Grid>
      </>
    );
  }

  function getStep(step: WizardStep): React.ReactNode {
    return (
      <Step key={step} classes={{ alternativeLabel: classes.alternativeLabel }}
            active={step <= getCorrectedStep(highestStep, false)}>
        <StepButton onClick={() => navigateIfValid(step, true)}>
          <StepLabel>{isNotXs && locale.createDealWizard.steps[step]}</StepLabel>
        </StepButton>
      </Step>
    );
  }

  return useObserver(() => (
    <Grid container>
      <Grid item xs={12} md={9}>
        <Card className={classes.card}>
          <CardContent classes={{ root: classes.cardContentRoot }}>
            <Stepper activeStep={currentStep}
                     nonLinear
                     alternativeLabel
                     connector={<StepConnector classes={{ line: classes.connectorLine }}/>}
                     className={classes.stepper}>
              {orderedSteps.map(getStep)}
            </Stepper>

            {isNotXs === false && (
              <Typography variant="caption" align="center" component={'p' as any}>
                {locale.createDealWizard.steps[getCorrectedStep(currentStep)]}
              </Typography>
            )}

            <Typography variant="body2" align="center" component={'p' as any} className={classes.dealTypeHeader}>
              {(currentStep !== WizardStep.KIND && currentStep !== WizardStep.TYPE) ?
                locale.createDealWizard.type.dealTypes[deal.type] : (<span>&nbsp;</span>)
              }
            </Typography>
            <div className={classes.stepContent}>
              <Typography variant="body1" className={classes.stepContentHeader}>
                {locale.createDealWizard.stepHeader[getCorrectedStep(currentStep)](deal)}
              </Typography>

              {getContent(getCorrectedStep(currentStep), shouldValidate)}
            </div>
          </CardContent>

          <CardActions className={classes.actions}>
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  disabled={currentStep === WizardStep.KIND}
                  onClick={() => navigateIfValid(getCorrectedStep(currentStep - 1), true)}
                  className={classes.backButton}
                >
                  {locale.createDealWizard.buttons.back}
                </Button>
              </Grid>

              {getButtons()}

            </Grid>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={3} className={classes.helpContent}>
        <Paper elevation={0} className={clsx(classes.paper, classes.paperTop)}>
          <Typography variant="h6">
            {locale.createDealWizard.help.header}
          </Typography>
        </Paper>

        <Paper elevation={0} className={classes.paper}>
          {getHelpContent(getCorrectedStep(currentStep))}
        </Paper>
      </Grid>
    </Grid>
  ));
}

