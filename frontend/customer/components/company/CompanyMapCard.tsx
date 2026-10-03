import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  Divider,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                                         from '@material-ui/core';
import { Done }                           from '@material-ui/icons';
import { IApiCompany }                    from '@my-old-startup/common/interfaces/IApiCompany';
import clsx                               from 'clsx';
import * as React                         from 'react';
import { calculateDistance }              from '../../../../common/utils/geoUtils';
import { locale }                         from '../../common/locales';
import { customerAnalyticsService }       from '../../services/customerAnalyticsService';
import { locationStore }                  from '../../store/LocationStore';
import { MapCardHeader }                  from '../common/MapCardHeader';
import { Paragraphs }                     from '../common/Paragraphs';
import { VisibilitySensor }               from '../common/VisibilitySensor';
import { CompanyCardButtons }             from './CompanyCardButtons';
import { CompanyCardCoronaReopenContent } from './CompanyCardCoronaReopenContent';
import { CompanyDetailsMediaHeader }      from './CompanyDetailsMediaHeader';
import { CompanyDishes }                  from './CompanyDishes';
import { CompanyDistanceShare }           from './CompanyDistanceShare';

function cleanUrl(url: string): string {
  return 'http://' + url.replace(/https?:\/\//, '');
}

const styles = (theme: Theme) =>
  // noinspection JSSuspiciousNameCombination
  createStyles({
                 root: {
                   // Fix for mobile safari
                   '-webkit-transform': 'translate3d(0,0,0)',

                   margin:                       '0 auto',
                   width:                        'calc(100% - 16px)',
                   [theme.breakpoints.up('md')]: {
                     maxWidth:  '35vw',
                   },
                 },
                 contentCard: {
                   marginBottom:  0,
                   paddingBottom: 0,
                   whiteSpace:    'normal',
                 },
                 done:        {
                   marginRight: theme.spacing(1),
                   marginLeft:  theme.spacing(1),
                   top:         6,
                   position:    'relative',
                 },
                 paragraph:   {
                   marginTop:    0,
                   marginBottom: theme.spacing(2),
                 },
                 link:        {
                   marginTop:    theme.spacing(-2),
                   marginBottom: theme.spacing(2),
                   display:      'block',
                 },

               })
;

type Props = {
  company: IApiCompany;
  distance: number;
  onClose: () => void;
} & WithStyles<typeof styles>;

class _CompanyMapCard extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, company, onClose } = this.props;
    const distance                      = calculateDistance(company.location, locationStore.location.coordinates);
    const couponsDescription   = (company.corona.couponsDescription || '').replace(/\s$/g, '');
    const donationsDescription = (company.corona.donationsDescription || '').replace(/\s$/g, '');

    return (
      <VisibilitySensor onChange={visible => {
        if (!visible) {
          return;
        }

        customerAnalyticsService.companyMapImpression({ company });
      }}
      >
        <Card elevation={1} className={classes.root} onClick={e => e.stopPropagation()}>
          <MapCardHeader onClose={onClose}/>

          <CompanyDetailsMediaHeader
            company={company}
            distance={distance}
          />

          <CardContent className={classes.contentCard}>
            <CompanyDistanceShare company={company} distance={distance}/>
          </CardContent>

          {(company.corona.offersReopen || company.corona.offersCoupons || company.corona.offersDelivery || company.corona.offersTakeAway || company.corona.acceptsDonations) && (
            <CardContent className={classes.contentCard}>
              <Typography variant="h6" align={'center'}>
                {locale.restaurantView.coronaHeader}
              </Typography>
              {company.corona.offersReopen && (
                <>
                  <CompanyCardCoronaReopenContent company={company}/>

                  <Typography variant="subtitle2" component={'h2' as any}>
                    {locale.restaurantView.offersReopenHeader}
                    {!company.corona.reopenDescription && (
                      <Done className={classes.done}/>
                    )}
                  </Typography>
                  <Paragraphs text={company.corona.reopenDescription || ''} className={classes.paragraph}/>
                </>
              )}
              {company.corona.offersDelivery && (
                <>
                  <Typography variant="subtitle2" component={'h2' as any}>
                    {locale.restaurantView.offersDeliveryHeader}
                    {!company.corona.deliveryDescription && (
                      <Done className={classes.done}/>
                    )}
                  </Typography>
                  <Paragraphs text={company.corona.deliveryDescription || ''} className={classes.paragraph}/>
                </>
              )}
              {company.corona.offersTakeAway && (
                <>
                  <Typography variant="subtitle2" component={'h2' as any}>
                    {locale.restaurantView.offersTakeAwayHeader}
                    {!company.corona.takeAwayDescription && (
                      <Done className={classes.done}/>
                    )}
                  </Typography>
                  <Paragraphs text={company.corona.takeAwayDescription || ''} className={classes.paragraph}/>
                </>
              )}
              {company.corona.offersCoupons && (
                <>
                  <Typography variant="subtitle2" component={'h2' as any}>
                    {locale.restaurantView.offersCouponsHeader}
                    {!couponsDescription && !company.corona.couponsLink && (
                      <Done className={classes.done}/>
                    )}
                  </Typography>
                  <Paragraphs text={couponsDescription} className={classes.paragraph}/>
                    {company.corona.couponsLink && (
                      <a
                        className={clsx({ [classes.link]: !!couponsDescription })}
                        rel="noopener noreferrer nofollow"
                        href={cleanUrl(company.corona.couponsLink)}
                        target="_blank">
                        {locale.restaurantView.couponLinkLabel}
                      </a>
                    )}
                  </>
                )}
                {company.corona.acceptsDonations && (
                  <>
                    <Typography variant="subtitle2" component={'h2' as any}>
                      {locale.restaurantView.acceptsDonationsHeader}
                      {!donationsDescription && !company.corona.donationsLink && (
                        <Done className={classes.done}/>
                      )}
                    </Typography>
                    <Paragraphs text={donationsDescription || ''} className={classes.paragraph}/>
                    {company.corona.donationsLink && (
                      <a
                        className={clsx({ [classes.link]: !!donationsDescription })}
                        rel="noopener noreferrer nofollow"
                        href={cleanUrl(company.corona.donationsLink)}
                        target="_blank">
                        {locale.restaurantView.donationLinkLabel}
                      </a>
                    )}
                  </>
                )}
            </CardContent>
          )}

          {company.dishes && company.dishes.length !== 0 && (
            <CardContent>
              <CompanyDishes dishes={company.dishes} small />
            </CardContent>
          )}

          <CardActions>
            <CompanyCardButtons company={company}/>
          </CardActions>
        </Card>
      </VisibilitySensor>
    );
  }
}

export const CompanyMapCard = withStyles(styles)(_CompanyMapCard);
