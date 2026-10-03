import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  createStyles,
  Grid,
  IconButton,
  RootRef,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                                     from '@material-ui/core';
import ExpandMoreIcon                 from '@material-ui/icons/ExpandMore';
import { IApiCompany }                from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDeal }                   from '@my-old-startup/common/interfaces/IApiDeal';
import { CUSTOMER_COMPANY_ROUTES }    from '@my-old-startup/common/routes/FrontendRoutes';
import clsx                           from 'clsx';
import { WithRouterProps }            from 'next/dist/client/with-router';
import { withRouter }                 from 'next/router';
import * as React                     from 'react';
import * as ReactDOM                  from 'react-dom';
import {
  getRoute,
  pushRoute,
}                                     from '../../common/routeUtils';
import { customerAnalyticsService }   from '../../services/customerAnalyticsService';
import { Paragraphs }                 from '../common/Paragraphs';
import { MultiPhoneButton }           from '../common/PhoneButton';
import { VisibilitySensor }           from '../common/VisibilitySensor';
import { CompanyCardButtons }         from '../company/CompanyCardButtons';
import { DealListCardContent }        from '../deal/DealListCardContent';
import { DealShareButton }            from '../deal/DealShareButton';
import { NewsDetailsTable }           from './NewsDetailsTable';
import { NewsInfoButton }             from './NewsInfoButton';
import { NewsItemDetailsMediaHeader } from './NewsItemDetailsMediaHeader';

const styles = (theme: Theme) => createStyles(
  {
    card:                                {
      margin:    theme.spacing(2),
      marginTop: 0,
    },
    cardContent:                         {
      paddingRight:  0,
      paddingBottom: 12,
      transition:    theme.transitions.create('all', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    cardContentOpen:                     {
      paddingBottom: 0,
      transition:    theme.transitions.create('all', {
        duration: theme.transitions.duration.shortest,
      }),

    },
    detailsTableContentPadding:          {
      paddingTop:    0,
      paddingBottom: '0px !important',
    },
    detailsTableContentPaddingIconExtra: {
      paddingLeft: 3,
    },
    detailsTableContent:                 {
      opacity:    0,
      transition: theme.transitions.create('all', {
        duration: theme.transitions.duration.short,
      }),
    },
    detailsTableContentOpen:             {
      opacity:    1,
      transition: theme.transitions.create('all', {
        duration: theme.transitions.duration.short,
      }),
    },
    expandButtonGrid:                    {
      textAlign: 'right',
      alignSelf: 'flex-end',
    },
    expandButton:                        {
      paddingBottom: 0,
      paddingTop:    0,
      transform:     'rotate(0deg)',
      transition:    theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen:                          {
      transform: 'rotate(180deg)',
    },
    scrollPoint:                         {
      position: 'relative',
      top:      theme.spacing(-9),
    },
  },
);

type Props = {
  deal: IApiDeal;
  company: IApiCompany;
  distance?: number;
  areDetailsInitiallyExpanded?: boolean;
} & WithStyles<typeof styles> & WithRouterProps;

type State = {
  areDetailsExpanded: boolean;
};

class _NewsListCard extends React.Component<Props, State> {
  private domRef: any;

  constructor(props: Readonly<Props & WithStyles<typeof styles>>) {
    super(props);
    this.domRef = React.createRef();
    this.state  = {
      areDetailsExpanded: props.areDetailsInitiallyExpanded || false,
    };
  }

  public render(): React.ReactNode {
    const { classes, deal, company, router, distance } = this.props;
    const { areDetailsExpanded }                       = this.state;
    const { date, value, details, type }               = deal;

    if (areDetailsExpanded) {
      void router.prefetch(CUSTOMER_COMPANY_ROUTES.newsDetailsPath);
    }

    return (
      <>
        <RootRef rootRef={ref => this.domRef = ref}>
          <div className={classes.scrollPoint}/>
        </RootRef>
        <VisibilitySensor onChange={visible => {
          if (!visible) {
            return;
          }
          customerAnalyticsService.newsListImpression(
            {
              company,
              deal,
            },
          );
        }}
        >
          <Card className={classes.card}
                elevation={4}
                onClick={() => this.handleExpandClick()}>

            <NewsItemDetailsMediaHeader deal={deal}/>

            <CardContent className={clsx(classes.cardContent, { [classes.cardContentOpen]: areDetailsExpanded })}>
              <DealListCardContent company={company}
                                   address={deal.location ? deal.location.address : company.contact.address}
                                   distance={distance || 0}/>

              <Grid container>
                <Grid item xs={10}>
                  <Typography variant="subtitle2">
                    {deal.description.title}
                  </Typography>
                </Grid>
                <Grid item xs={2} className={classes.expandButtonGrid}>
                  <IconButton
                    disableRipple
                    className={clsx(classes.expandButton, { [classes.expandOpen]: areDetailsExpanded })}
                    onClick={() => this.handleExpandClick(!areDetailsExpanded)}
                    aria-label="Open Details"
                  >
                    <ExpandMoreIcon/>
                  </IconButton>
                </Grid>
              </Grid>

            </CardContent>

            <Collapse in={areDetailsExpanded} timeout={{
              enter: 300,
              exit:  750,
            }}>

              <div
                className={clsx(classes.detailsTableContent, {
                  [classes.detailsTableContentOpen]: areDetailsExpanded,
                })}>

                <CardContent>
                  {this.getDescription(deal.description.description)}
                </CardContent>

                <CardContent>
                  <NewsDetailsTable company={company} deal={deal}/>
                </CardContent>

                <CardContent
                  className={clsx(classes.detailsTableContentPadding, classes.detailsTableContentPaddingIconExtra)}>
                  {company.contact.telephone && <MultiPhoneButton telephone={company.contact.telephone}
                                        secondaryTelephone={company.contact.secondaryTelephone}
                                        secondaryTelephoneReason={company.contact.secondaryTelephoneReason}/>}
                  <DealShareButton company={company} deal={deal}/>
                  <NewsInfoButton company={company} deal={deal}/>
                </CardContent>
              </div>
              <CardActions>
                <CompanyCardButtons company={company}/>
              </CardActions>
            </Collapse>
          </Card>
        </VisibilitySensor>
      </>
    );
  }

  public getDescription(description: string): React.ReactNode {
    const { deal, company } = this.props;

    const maxTextLength   = 240;
    const isOverMaxLength = description.length > maxTextLength;

    return (
      <>
        {<Paragraphs text={description.slice(0, maxTextLength)}/>}
        {isOverMaxLength && (
          <>
            ...&nbsp;
            <a /*Link for SEO*/
              href={getRoute(CUSTOMER_COMPANY_ROUTES.newsDetails, {
                dealId:    deal.id,
                companyId: company.id,
              })}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void pushRoute(CUSTOMER_COMPANY_ROUTES.newsDetailsPath, CUSTOMER_COMPANY_ROUTES.newsDetails, {
                  dealId:    deal.id,
                  companyId: company.id,
                });
              }}>MEHR</a>
          </>
        )}
      </>
    );
  }

  private handleExpandClick(flag = !this.state.areDetailsExpanded): void {
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this.domRef) as Element;
    if (node !== null) {
      node.scrollIntoView(
        {
          block:    'start',
          behavior: 'smooth',
        },
      );
    }

    if (flag) {
      const { company, deal } = this.props;
      customerAnalyticsService.newsCardExpanded(
        {
          company,
          deal,
        },
      );
    }

    this.setState({ areDetailsExpanded: flag });
  }
}

export const NewsListCard = (withStyles(styles)(withRouter(_NewsListCard)));
