import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Paper,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                                         from '@material-ui/core';
import { Done }                           from '@material-ui/icons';
import { CompanyType }                    from '@my-old-startup/common/enums/types';
import { IApiCompany }                    from '@my-old-startup/common/interfaces/IApiCompany';
import { locale as commonLocale }         from '@my-old-startup/frontend-common/locales';
import clsx                               from 'clsx';
import Head                               from 'next/head';
import Router                             from 'next/router';
import * as React                         from 'react';
import { CDN_BASE_URL }                   from '../../../../common/enums';
import { CUSTOMER_COMPANY_ROUTES }        from '../../../../common/routes/FrontendRoutes';
import { getCompanySeoUrl }               from '../../../../common/utils/UrlUtils';
import { locale }                         from '../../common/locales';
import { getLastRoute }                   from '../../common/routeUtils';
import { Paragraphs }                     from '../common/Paragraphs';
import { openGoogleMapsRoute }            from '../map/mapUtils';
import { CompanyCardCoronaReopenContent } from './CompanyCardCoronaReopenContent';
import { CompanyDetailsMediaHeader }      from './CompanyDetailsMediaHeader';
import { CompanyDishes }                  from './CompanyDishes';
import { CompanyDistanceShare }           from './CompanyDistanceShare';
import { OpeningHours }                   from './OpeningHours';

const styles = (theme: Theme) =>
  // noinspection JSSuspiciousNameCombination
  createStyles(
    {
      '@global':         {
        address: {
          fontStyle: 'normal',
        },
      },
      'actionsRoot':     {
        paddingTop: 0,
      },
      backgroundShadow:  {
        background:                   'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .3) 75%)',
        position:                     'fixed',
        top:                          0,
        height:                       `100%`,
        width:                        `100%`,
        overflowY:                    'auto',
        overflowX:                    'hidden',
        paddingTop:                   theme.spacing(8),
        padding:                      theme.spacing(2),
        [theme.breakpoints.up('md')]: {
          paddingTop: theme.spacing(8),
          padding:    theme.spacing(6),
        },
      },
      'card': {
        [theme.breakpoints.up('md')]: {
          maxWidth: '35vw',
        },
        'margin': `0 auto`,
        // Fix for mobile safari
        '-webkit-transform':          'translate3d(0,0,0)',

      },
      'text':            {
        flex: 1,
      },
      'textParagraph':   {
        width:        '100%',
        overflow:     'hidden',
        textOverflow: 'ellipsis',
        display:      'block',
        marginBottom: 0,
      },
      'detailButton':    {
        width: '100%',
      },
      'socialMediaLink': {
        marginLeft: theme.spacing(2),
      },
      'socialMediaIcon': {
        width: theme.spacing(3),
      },
      paragraph:         {
        marginTop:    0,
        marginBottom: theme.spacing(2),
      },
      link:              {
        marginTop:    theme.spacing(-2),
        marginBottom: theme.spacing(2),
        display:      'block',
      },
      donationLink:              {
        marginTop:    theme.spacing(-2),
        display:      'block',
      },
      done:              {
        marginRight: theme.spacing(1),
        marginLeft:  theme.spacing(1),
        top:         6,
        position:    'relative',
      },
    },
  )
;

function cleanUrl(url: string): string {
  return 'http://' + url.replace(/https?:\/\//, '');
}

type Props = {
  company: IApiCompany;
  distance: number;
};

class _CompanyDetailViewCard extends React.Component<Props & WithStyles<typeof styles>> {
  private close(): void {
    if (getLastRoute() === CUSTOMER_COMPANY_ROUTES.companyListViewPath) {
      Router.push(CUSTOMER_COMPANY_ROUTES.companyListViewPath);
    } else {
      Router.push(CUSTOMER_COMPANY_ROUTES.companyMapViewPath);
    }
  }

  public render(): React.ReactNode {
    const { classes, company, distance } = this.props;
    const isOpen                         = company.corona.offersReopen;

    // eslint-disable-next-line @typescript-eslint/tslint/config
    const metaTitle                        = `my-old-startups-domain | ${isOpen ? 'Wieder geöffnet! ' : ''}${company.contact.title} in ${company.contact.city}`;
    const metaDescription                  = `${commonLocale.company.types[company.contact.type]} in ${company.contact.address}, ${company.contact.zipCode}, ${company.contact.city}`;
    const { id, contact: { title, city } } = company;

    const companySeoUrl = getCompanySeoUrl({
                                             id,
                                             title,
                                             city,
                                           }, CUSTOMER_COMPANY_ROUTES.companyDetails);

    // Do not show contact data for Food Trucks
    const address = company.contact.type !== CompanyType.FOODTRUCK
      ? (
        <address>
          {locale.format.address(company.contact)}
        </address>
      )
      : null;

    const couponsDescription   = (company.corona.couponsDescription || '').replace(/\s$/g, '');
    const donationsDescription = (company.corona.donationsDescription || '').replace(/\s$/g, '');

    return (
      <>
        <Head>
          <title>
            {metaTitle}
          </title>
          <meta property="og:url" content={'https://app.my-old-startups-domain.de' + companySeoUrl}/>
          <link rel="canonical" href={'https://app.my-old-startups-domain.de' + companySeoUrl}/>
          <meta name="og:title" property="og:title" content={metaTitle}/>
          <meta name="description" content={metaDescription}/>
          <meta name="og:description" property="og:description" content={metaDescription}/>
        </Head>
        <Paper
          elevation={0}
          className={classes.backgroundShadow}
          onClick={() => this.close()}
        >
          <Card elevation={24} className={classes.card} onClick={(e) => e.stopPropagation()}>
            <CompanyDetailsMediaHeader
              company={company}
              distance={distance}
            />

            <CardContent className={classes.text}>
              <CompanyDistanceShare company={company} distance={distance}/>

              <Paragraphs text={company.details.description || ''}/>
            </CardContent>

            {(company.corona.offersReopen || company.corona.offersCoupons || company.corona.offersDelivery || company.corona.offersTakeAway || company.corona.acceptsDonations) && (
              <CardContent className={classes.text}>
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
                        className={clsx({ [classes.donationLink]: !!donationsDescription })}
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
                <CompanyDishes dishes={company.dishes}/>
              </CardContent>
            )}

            {company.details.tags && (
              <CardContent className={classes.text}>
                <Typography variant="h6" component={'h2' as any}>
                  {locale.restaurantView.tags}
                </Typography>
                {company.details.tags.map((x, i) => commonLocale.deals.table.tags[x] + (i !== company.details.tags!.length - 1 ? ', ' : ''))}
              </CardContent>
            )}

            {company.contact.type !== CompanyType.FOODTRUCK && company.details.openingHours && (
              <CardContent className={classes.text}>
                <Typography variant="h6" component={'h2' as any}>
                  {locale.restaurantView.openingHours}
                </Typography>
                <OpeningHours openingHours={company.details.openingHours}/>
              </CardContent>
            )}

            {company.images.menuDocument && (
              <CardContent className={classes.text}>
                <Typography variant="h6" component={'h2' as any}>
                  {locale.restaurantView.menu}
                </Typography>
                <Typography variant="caption" className={classes.textParagraph}>
                  <a
                    rel="noopener noreferrer nofollow"
                    href={CDN_BASE_URL + company.images.menuDocument}
                    target="_blank">
                    Link
                  </a>
                </Typography>

              </CardContent>
            )}

            {(company.contact.telephone || company.contact.email || company.contact.website) && (
              <CardContent className={classes.text}>
                <Typography variant="h6" component={'h2' as any}>
                  {locale.restaurantView.contact}
                </Typography>
                <Typography variant="caption" className={classes.textParagraph}>
                  {address}
                </Typography>
                {company.contact.telephone && (
                  <Typography variant="caption" className={classes.textParagraph}>
                    Tel: <a href={`tel:+49${company.contact.telephone}`}>{`+49 ${company.contact.telephone}`}</a>
                  </Typography>
                )}
                {company.contact.email && (
                  <Typography variant="caption" className={classes.textParagraph}>
                    E-Mail: <a href={`mailto:${company.contact.email}`}>{company.contact.email}</a>
                  </Typography>
                )}
                {company.contact.website && (
                  <Typography variant="caption" className={classes.textParagraph}>
                    Webseite: <a target="_blank"
                                 rel="noopener noreferrer nofollow"
                                 href={cleanUrl(company.contact.website)}>{cleanUrl(company.contact.website)}</a>
                  </Typography>
                )}
              </CardContent>
            )}

            {(company.details.facebook || company.details.instagram || company.details.twitter) && (
              <CardContent className={classes.text}>
                <Typography variant="h6" component={'h2' as any}>
                  {locale.restaurantView.socialMedia}
                </Typography>
                {company.details.facebook && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href={'https://www.facebook.com/' + company.details.facebook}>
                    <img
                      src="https://storage.googleapis.com/static.my-old-startups-domain.de/images/social/facebook.png"
                      className={classes.socialMediaIcon}
                      alt="Facebook"/>
                  </a>
                )}
                {company.details.instagram && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={classes.socialMediaLink}
                    href={'https://www.instagram.com/' + company.details.instagram}>
                    <img
                      src="https://storage.googleapis.com/static.my-old-startups-domain.de/images/social/instagram.png"
                      className={classes.socialMediaIcon}
                      alt="instagram"/>
                  </a>
                )}
                {company.details.twitter && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={classes.socialMediaLink}
                    href={'https://www.twitter.com/' + company.details.twitter}>
                    <img
                      src="https://storage.googleapis.com/static.my-old-startups-domain.de/images/social/twitter.png"
                      className={classes.socialMediaIcon}
                      alt="twitter"/>
                  </a>
                )}
              </CardContent>
            )}

            { /* TODO: Upcoming deals */}

            <CardActions classes={{ root: classes.actionsRoot }}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.detailButton}
                onClick={() => this.close()}
              >
                {locale.listView.card.toCompanyDeals}
              </Button>
              {company.contact.type !== CompanyType.FOODTRUCK && (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.detailButton}
                  onClick={() => openGoogleMapsRoute(company.location)}
                >
                  {locale.listView.card.toDeal}
                </Button>
              )}
            </CardActions>
          </Card>
        </Paper>
      </>
    );
  }
}

export const CompanyDetailViewCard = withStyles(styles)(_CompanyDetailViewCard);
