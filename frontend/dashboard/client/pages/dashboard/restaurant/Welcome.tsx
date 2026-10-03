import {
  Button,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                 from '@material-ui/core';
import {
  ArrowBack,
  Home,
}                                 from '@material-ui/icons';
import {
  Loading,
  RawHtml,
}                                 from '@my-old-startup/frontend-common/components';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import { DashboardRoutes }        from '@my-old-startup/frontend-common/routes';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import { locale }                 from '../../../common/locales';
import { routeService }           from '../../../services/CdbRouteService';
import { companyStore }           from '../../../stores/CompanyStore';
import { FastNavigationButtons }  from './FastNavigationButtons';

const styles = (theme: Theme) => createStyles(
  {
    button:   {
      margin: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    paragraph:{
      marginTop: theme.spacing(2),
    }
  },
);

type Props = WithStyles<typeof styles>;

@observer
class _Welcome extends React.Component<Props> {

  public render(): JSX.Element {
    const { classes }    = this.props;
    const currentCompany = companyStore.currentCompany;

    if (currentCompany === undefined) {
      return <Loading/>;
    }

    const typeButton = commonLocale.company.prefix[currentCompany.contact.type] + ' ' + commonLocale.company.types[currentCompany.contact.type];
    return (
      <Grid container alignItems="stretch" spacing={2}>

        <Grid item md={12}>
          <FastNavigationButtons company={currentCompany} route={DashboardRoutes.Welcome}/>
        </Grid>

        <Grid item md={12} lg={6}>
          <Typography variant="subtitle1" className={classes.paragraph}>
            <RawHtml>
              {locale.forms.corona.welcome(typeButton)}
            </RawHtml>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export const Welcome = withStyles(styles)(_Welcome);
