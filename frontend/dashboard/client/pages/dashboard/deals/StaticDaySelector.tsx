import {
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  Grid,
  Theme,
  withStyles,
  WithStyles,
}                         from '@material-ui/core';
import { IApiDeal }       from '@my-old-startup/common/interfaces';
import { alertColors }    from '@my-old-startup/frontend-common/style';
import { dashboardTheme } from '@my-old-startup/frontend-common/theme';
import * as React         from 'react';
import { DayOfWeek }      from '../../../../../../common/enums';
import { locale }         from '../../../common/locales';

const styles = (theme: Theme) =>
  createStyles({
                 warning: {
                   color:   alertColors(theme).warning,
                   margin:  '0 auto',
                   display: 'block',
                   width:   theme.typography.h4.fontSize,
                   height:  theme.typography.h4.fontSize,
                 },
                 header:  {
                   position: 'relative',
                   top:      theme.spacing(1),
                   left:     theme.spacing(1),
                 },
                 ok:      {
                   backgroundColor: dashboardTheme.palette.primary.main,
                   color:           dashboardTheme.palette.text.primary,
                   marginRight:     theme.spacing(1),
                   '&:hover':       {
                     backgroundColor: dashboardTheme.palette.primary.dark,
                   },
                 },
                 zIndex:  {
                   zIndex: 999,
                 },
               });

type Props = {
  deal:IApiDeal
} & WithStyles<typeof styles>;

type State = {
  selectedDays: Set<DayOfWeek>;
}

class _StaticDaySelector extends React.Component<Props, State> {

  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      selectedDays: new Set(props.deal.staticDays),
    };
  }

  private setDaysOnDeal():void{
    this.props.deal.staticDays = Array.from(this.state.selectedDays.values());
  }

  private getControl(dayOfWeek: DayOfWeek): React.ReactNode {
    return (
      <FormControl>
        <FormControlLabel
          label={locale.common.weekday[dayOfWeek]}
          control={
            <Checkbox checked={this.state.selectedDays.has(dayOfWeek)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          this.state.selectedDays.add(dayOfWeek);
                        } else {
                          this.state.selectedDays.delete(dayOfWeek);
                        }
                        this.setDaysOnDeal();
                        this.setState({ selectedDays: new Set(this.state.selectedDays) });
                      }}

            />
          }/>
      </FormControl>
    );
  }

  public render(): React.ReactNode {
    const { classes} = this.props;

    return (
      <Grid container>
        <Grid item>
          {this.getControl(DayOfWeek.Monday)}
        </Grid>
        <Grid item>
          {this.getControl(DayOfWeek.Tuesday)}
        </Grid>
        <Grid item>
          {this.getControl(DayOfWeek.Wednesday)}
        </Grid>
        <Grid item>
          {this.getControl(DayOfWeek.Thursday)}
        </Grid>
        <Grid item>
          {this.getControl(DayOfWeek.Friday)}
        </Grid>
        <Grid item>
          {this.getControl(DayOfWeek.Saturday)}
        </Grid>
        <Grid item>
          {this.getControl(DayOfWeek.Sunday)}
        </Grid>
      </Grid>
    );
  }
}

export const StaticDaySelector = withStyles(styles)(_StaticDaySelector);
