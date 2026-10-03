import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                              from '@material-ui/core';
import { IApiCompany }         from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDeal }            from '@my-old-startup/common/interfaces/IApiDeal';
import clsx                    from 'clsx';
import Head                    from 'next/head';
import * as React              from 'react';
import { getInnerHeight }      from '../../styles/theme';
import {
  DealItemDetailsMediaHeader,
  DealItemDetailsTable,
}                              from '../common/deal';
import { Paragraphs }          from '../common/Paragraphs';
import { MultiPhoneButton }    from '../common/PhoneButton';
import { DealListCardContent } from './DealListCardContent';
import { DealShareButton }     from './DealShareButton';
import { DetailsCardButtons }  from './DetailCardButtons';

const styles = (theme: Theme) =>
  // noinspection JSSuspiciousNameCombination
  createStyles(
    {
      root:                                {
        // Accounts for the top margin from the card
        minHeight: `calc(${getInnerHeight(theme)} - ${theme.spacing(2)}px)`,
      },
      shareButton:                         {
        float: 'right',
      },
      line:                                {
        display: 'inline-block',
      },
      companyName:                         {
        paddingRight: theme.spacing(1),
      },
      card:                                {
        'width':    `calc(100vw - ${theme.spacing(4)}px)`,
        'maxWidth': 499,
        'margin':   `${theme.spacing(2)}px auto`,

        '-ms-overflow-style':   'none', // IE 10+
        'scrollbar-width':      'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // Safari and Chrome
        },
      },
      textParagraph:                       {
        whiteSpace: 'pre-wrap',
      },
      divider:                             {
        margin: '0 auto',
        width:  '95%',
      },
      detailButton:                        {
        width: '100%',
      },
      distanceText:                        {
        fontWeight: 'lighter',
        fontSize:   '.8em',
      },
      detailsTableContentPadding:          {
        paddingTop:    0,
        paddingBottom: '0px !important',
      },
      detailsTableContentPaddingIconExtra: {
        paddingLeft: 3,
      },
    },
  )
;

type Props = {
  deal: IApiDeal;
  company: IApiCompany;
  distance: number;
} & WithStyles<typeof styles>;

class _DealDetailCard extends React.Component<Props> {
  public render(): React.ReactNode {
    const { classes, deal, company, distance } = this.props;

    const metaTitle = `my-old-startups-domain.de | ${deal.description.title} - ${company.contact.title}`;

    return (
      <>
        <Head>
          <title>
            {metaTitle}
          </title>
          <meta name="og:title" property="og:title" content={metaTitle}/>
          <meta name="description" content={deal.description.description}/>
          <meta name="og:description" property="og:description" content={deal.description.description}/>
          <meta name="og:image" property="og:image" content={deal.image}/>
        </Head>

        <div className={classes.root} onClick={() => window.history.back()}>
          <Card elevation={24} className={classes.card}>

            <DealItemDetailsMediaHeader deal={deal}/>

            <CardContent>
              <DealListCardContent company={company}
                                   address={deal.location ? deal.location.address : company.contact.address}
                                   distance={distance || 0}/>

              <Typography variant="subtitle2" component={'h2' as any}>
                {deal.description.title}
              </Typography>

              <Paragraphs text={deal.description.description}/>
            </CardContent>

            <CardContent
              className={clsx(classes.detailsTableContentPadding, classes.detailsTableContentPaddingIconExtra)}>
              {company.contact.telephone && <MultiPhoneButton telephone={company.contact.telephone}
                                        secondaryTelephone={company.contact.secondaryTelephone}
                                        secondaryTelephoneReason={company.contact.secondaryTelephoneReason}/>}
              <DealShareButton company={company} deal={deal}/>
            </CardContent>


            <CardContent>
              <DealItemDetailsTable deal={deal} company={company}/>
            </CardContent>


            <CardActions>
              <DetailsCardButtons deal={deal} company={company}/>
            </CardActions>
          </Card>
        </div>
      </>
    );
  }
}

export const DealDetailCard = withStyles(styles)(_DealDetailCard);
