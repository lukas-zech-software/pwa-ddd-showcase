import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  Theme,
  WithStyles,
  withStyles,
}                                    from '@material-ui/core';
import * as React                    from 'react';
import { IApiCompany }               from '../../../../common/interfaces';
import { MapCardHeader }             from '../common/MapCardHeader';
import { CompanyCardButtons }        from '../company/CompanyCardButtons';
import { CompanyDetailsMediaHeader } from '../company/CompanyDetailsMediaHeader';
import { CompanyDistanceShare }      from '../company/CompanyDistanceShare';

const styles = (theme: Theme) =>
  // noinspection JSSuspiciousNameCombination
  createStyles({
                 root:        {
                   margin:                       '8px auto',
                   width:                        'calc(100% - 16px)',
                   [theme.breakpoints.up('md')]: {
                     maxWidth: '35vw',
                   },
                 },
                 contentCard: {
                   marginBottom:  0,
                   paddingBottom: 0,
                   whiteSpace:    'normal',
                 },
                 mediaCard:   {
                   maxHeight: 480,

                 },
               });

type Props = {
  company: IApiCompany;
} & WithStyles<typeof styles>;

class _MarketCompanyMapCard extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, company } = this.props;

    return (

      <Card elevation={1} className={classes.root}>

        <CompanyDetailsMediaHeader
          distance={0}
          company={company}
          mediaClass={classes.mediaCard}
        />

        <CardContent className={classes.contentCard}>
          <CompanyDistanceShare company={company} distance={0}/>
        </CardContent>

        <CardActions>
          <CompanyCardButtons company={company}/>
        </CardActions>
      </Card>
    );
  }
}

export const MarketCompanyMapCard = withStyles(styles)(_MarketCompanyMapCard);
