import {
  Card,
  CardContent,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                                     from '@material-ui/core';
import { IApiCompany }                from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDeal }                   from '@my-old-startup/common/interfaces/IApiDeal';
import * as React                     from 'react';
import { CUSTOMER_COMPANY_ROUTES }    from '../../../../common/routes/FrontendRoutes';
import { pushRoute }                  from '../../common/routeUtils';
import { customerAnalyticsService }   from '../../services/customerAnalyticsService';
import { DealItemDetailsMediaHeader } from '../common/deal';
import { MapCardHeader }              from '../common/MapCardHeader';
import { VisibilitySensor }           from '../common/VisibilitySensor';
import { DealListCardContent }        from './DealListCardContent';

const AVATAR_WIDTH  = 60;
const AVATAR_HEIGHT = AVATAR_WIDTH;
const styles        = (theme: Theme) =>
  createStyles(
    {
      root:        {
        margin:                       theme.spacing(1),
        position:                     'relative',
        width:                        '85vw',
        [theme.breakpoints.up('md')]: {
          width: '30vw',
        },
        cursor:                       'pointer',
        // everything should show a pointer here
        '& *':                        {
          cursor: 'pointer !important',
        },
      },
      avatar:      {
        width:  AVATAR_WIDTH,
        height: AVATAR_HEIGHT,
      },
      contentCard: {
        marginBottom:  0,
        paddingBottom: '0px !important',
        whiteSpace:    'normal',
        minHeight:     90,
      },
    },
  )
;

type Props = {
  deal: IApiDeal;
  company: IApiCompany;
  distance: number;
  onClose: () => void;
} & WithStyles<typeof styles>;

class _DealMapCard extends React.PureComponent<Props> {

  public render(): React.ReactNode {
    const { classes, deal, company, distance, onClose } = this.props;

    return (
      <VisibilitySensor onChange={visible => {
        if (!visible) {
          return;
        }

        customerAnalyticsService.dealMapImpression({
                                                     company,
                                                     deal,
                                                   });
      }}
      >
        <Card elevation={1} className={classes.root}
              onClick={() => void pushRoute(CUSTOMER_COMPANY_ROUTES.dealDetailsPath,
                                            CUSTOMER_COMPANY_ROUTES.dealDetails,
                                            {
                                              dealId:    deal.id,
                                              companyId: company.id,
                                            })}
        >
          <MapCardHeader onClose={onClose}/>

          <DealItemDetailsMediaHeader deal={deal}/>

          <CardContent className={classes.contentCard}>
            <DealListCardContent company={company}
                                 address={deal.location ? deal.location.address : company.contact.address}
                                 distance={distance || 0}/>

            <Typography variant="subtitle2">
              {deal.description.title}
            </Typography>
          </CardContent>
        </Card>
      </VisibilitySensor>
    );
  }
}

export const DealMapCard = (withStyles(styles)(_DealMapCard));
