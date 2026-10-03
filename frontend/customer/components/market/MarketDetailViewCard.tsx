import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                                   from '@material-ui/core';
import { IApiMarket }               from '@my-old-startup/common/interfaces/IApiMarket';
import { locale as commonLocale }   from '@my-old-startup/frontend-common/locales';
import Head                         from 'next/head';
import * as React                   from 'react';
import { locale }                   from '../../common/locales';
import { Paragraphs }               from '../common/Paragraphs';
import { openGoogleMapsRoute }      from '../map/mapUtils';
import { MarketDetailsMediaHeader } from './MarketDetailsMediaHeader';
import { MarketDistanceShare }      from './MarketDistanceShare';

const styles = (theme: Theme) =>
  // noinspection JSSuspiciousNameCombination
  createStyles(
    {
      '@global':         {
        address: {
          fontStyle: 'normal',
        },
      },
      'root':            {
      },
      'actionsRoot':     {
        paddingTop: 0,
      },
      'shareButton':     {
        float: 'right',
      },
      'phoneButton':     {
        float: 'right',
      },
      'card':            {
        'width':    `calc(100vw - ${theme.spacing(4)}px)`,
        'maxWidth': 499,
        'margin':   `${theme.spacing(2)}px auto`,

        '-ms-overflow-style':   'none', // IE 10+
        'scrollbar-width':      'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // Safari and Chrome
        },

        'display':       'flex',
        'flexDirection': 'column',

        'overflow': 'hidden',
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
      'divider':         {
        margin: '0 auto',
        width:  '95%',
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
    },
  )
;

type Props = {
  market: IApiMarket;
  distance: number;
};

class _MarketDetailViewCard extends React.Component<Props & WithStyles<typeof styles>> {

  public render(): React.ReactNode {
    const { classes, market, distance } = this.props;

    // eslint-disable-next-line @typescript-eslint/tslint/config
    const metaTitle = `my-old-startups-domain.de | ${market.title} - ${commonLocale.market.types[market.type]} in ${market.address}, Köln`;

    return (
      <>
        <Head>
          <title>
            {metaTitle}
          </title>
          <meta name="og:title" property="og:title" content={metaTitle}/>
          <meta name="description" content={market.description}/>
          <meta name="og:description" property="og:description" content={market.description}/>
          <meta name="og:image" property="og:image" content={market.image}/>
        </Head>
        <div className={classes.root}>
          <Card elevation={24} className={classes.card}>
            <MarketDetailsMediaHeader market={market}/>

            <CardContent className={classes.text}>
              <MarketDistanceShare market={market}/>

              <Paragraphs text={market.description || ''}/>
            </CardContent>

            <CardContent className={classes.text}>
              <Typography variant="h6" component={'h2' as any}>
                {locale.restaurantView.socialMedia}
              </Typography>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={'https://www.facebook.com/my-old-startups-domain'}>
                <img
                  src="https://storage.googleapis.com/static.my-old-startups-domain.de/images/social/facebook.png"
                  className={classes.socialMediaIcon}
                  alt="Facebook"/>
              </a>
            </CardContent>

            { /* TODO: Upcoming deals */}

            <CardActions classes={{ root: classes.actionsRoot }}>
              <Button
                variant="contained"
                color="primary"
                className={classes.detailButton}
                onClick={() => openGoogleMapsRoute(market.location)}
              >
                {locale.listView.card.toDeal}
              </Button>
            </CardActions>
          </Card>
        </div>
      </>
    );
  }
}

export const MarketDetailViewCard = withStyles(styles)(_MarketDetailViewCard);
