import {
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  MobileStepper,
  Theme,
  Typography,
}                     from '@material-ui/core';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
}                     from '@material-ui/icons';
import * as React     from 'react';
import SwipeableViews from 'react-swipeable-views';
import { mod }        from 'react-swipeable-views-core';
import { virtualize } from 'react-swipeable-views-utils';
import { Dish }       from '../../../../common/interfaces';
import { locale }     from '../../common/locales';
import { Paragraphs } from '../common/Paragraphs';

const AutoPlaySwipeableViews = virtualize(SwipeableViews);

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
                        price:               {
                          textAlign: 'right',
                        },
                        stepper:             {
                          backgroundColor: theme.palette.background.paper,
                        },
                        stepperDotContainer: {
                          width: '100%',
                        },
                        stepperDot:          (props: { dishesCount: number }) => ({
                          width:        `${100 / props.dishesCount}%`,
                          margin:       '0 5px',
                          height:       2,
                          borderRadius: 2,
                        }),
                      });
});

type Props = {
  dishes: Dish[];
  small?: boolean
};

export function CompanyDishes(props: Props): JSX.Element {
  const { dishes, small }           = props;
  const classes                     = useStyles({ dishesCount: dishes.length });
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps                    = dishes.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={1}  style={{ display: 'flex' }}>
        <IconButton size="small" onClick={handleBack} style={{ float: 'left', }}>
          <KeyboardArrowLeft/>
        </IconButton>
      </Grid>
      <Grid item xs={10}>
        <AutoPlaySwipeableViews
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          slideRenderer={({ index }) => {
            const currentDish = dishes[mod(index, dishes.length)];

            return (
              <Grid container key={index}>
                <Grid item xs={10}>
                  <Typography variant="subtitle1">
                    {currentDish.title}
                  </Typography>
                </Grid>
                <Grid item xs={2} className={classes.price}>
                  <Typography variant="subtitle1">
                    {locale.format.currency(currentDish.price)} &euro;
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Paragraphs text={currentDish.description} limit={small}/>
                </Grid>
              </Grid>
            );
          }}
        />
      </Grid>
      <Grid item xs={1}  style={{ display: 'flex' }}>
        <IconButton size="small" onClick={handleNext} style={{ float: 'right' }}>
          <KeyboardArrowRight/>
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <MobileStepper
          steps={maxSteps}
          activeStep={mod(activeStep, dishes.length)}
          position="static"
          variant="dots"
          className={classes.stepper}
          classes={{
            dot:  classes.stepperDot,
            dots: classes.stepperDotContainer,
          }}
          nextButton={null}
          backButton={null}
        />
      </Grid>
    </Grid>
  );
}
