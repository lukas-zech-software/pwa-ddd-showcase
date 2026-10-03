import {
  createStyles,
  makeStyles,
  NoSsr,
  Theme,
  Typography,
} from '@material-ui/core';

import { CDN_BASE_URL } from '@my-old-startup/common/enums/constants';
import { CardMediaFix } from '@my-old-startup/frontend-common/fixes/CardMediaFix';

import clsx                          from 'clsx';
import * as React                    from 'react';
import LazyLoad                      from 'react-lazyload';
import { DealType }                  from '../../../../../common/enums';
import { IApiDeal }                  from '../../../../../common/interfaces';
import { getPercent }                from '../../../../../common/utils/deals';
import { locale }                    from '../../../common/locales';
import { CountDownChip }             from './CountDownChip';
import {
  DiscountButton,
  PriceButton,
  SpecialButton,
}                                    from './PriceButton';
import { ReservationRequiredBanner } from './ReservationRequiredBanner';

export const DEAL_IMAGE_PLACEHOLDER = 'iVBORw0KGgoAAAANSUhEUgAAAu4AAAFFCAQAAAAZJ6DxAAADkElEQVR42u3UMQEAAAjDMOZf9PABiYQeTTsAHBNzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3cwcwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdxEAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3M0dwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNzNHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcRQAwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHeCxBe27iNoSvE1ZAAAAAElFTkSuQmCC';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        root:                       {
          position: 'relative',
        },
        chipContainer:              {
          'zIndex':   10,
          'position': 'absolute',
          'opacity':  0.99,
          'top':      0,
          'left':     0,
          '&.big':    {},
        },
        reservationWantedBanner:    {
          transform:       'rotate(45deg)',
          position:        'absolute',
          top:             '24px',
          right:           '-62px',
          textAlign:       'center',
          backgroundColor: 'rgba(0, 176, 240, 0.77)',
        },
        opaquePriceButtonContainer: {
          color:           '#fff',
          backgroundColor: 'transparent',

          lineHeight: .7,
          position:   'absolute',
          bottom:     0,
          right:      0,
        },
        opaquePriceTextContainer:   {
          paddingLeft:     theme.spacing(2),
          color:           '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',

          width:      '100%',
          lineHeight: .7,
          position:   'absolute',
          bottom:     0,
          left:       0,
        },
        mediaRoot:                  {
          height: `calc(100% / 2.3)`, // 2.3:1 aspect ratio
        },
      },
    ),
);

type Props = {
  deal: IApiDeal;
  noLazy?: boolean;
};

function getDiscountLabel(deal: IApiDeal): React.ReactNode {
  switch (deal.type) {
    case DealType.SPECIAL_MENU:
      return locale.listView.card.specialMenu[deal.specialType!];
    case DealType.SPECIAL:
      return locale.listView.card.specials[deal.specialType!];
    case DealType.DISCOUNT_2_FOR_1:
      return locale.listView.card.discount2For1;

    case DealType.DISCOUNT_WHOLE_BILL:
      return `${getPercent(deal.value.discountValue, deal.value.originalValue)}% ${locale.listView.card.discount_whole_bill}`;

    case DealType.ADDON:
      return `${getPercent(deal.value.originalValue, deal.value.originalValue + deal.value.discountValue)}% ${locale.listView.card.discount}`;

    case DealType.DISCOUNT:
    case DealType.DISCOUNT_CATEGORY:
    default:
      return `${getPercent(deal.value.discountValue, deal.value.originalValue)}% ${locale.listView.card.discount}`;

  }
}

export const DealItemDetailsMediaHeader: React.FC<Props> = (props: Props) => {
  const classes          = useStyles();
  const { deal, noLazy } = props;

  const reservationRequiredElement = deal.details.reservationRequired
    ? (
      <div className={classes.reservationWantedBanner}>
        <NoSsr>
          <ReservationRequiredBanner/>
        </NoSsr>
      </div>
    )
    : null;

  return (
    <div className={clsx(classes.root)}>
      <div className={clsx(classes.chipContainer)}>
        <NoSsr>
          <CountDownChip deal={deal}/>
        </NoSsr>
      </div>

      {reservationRequiredElement}

      {noLazy ? (
        <CardMediaFix
          classes={{ root: classes.mediaRoot }}
          alt={deal.description.title}
          image={CDN_BASE_URL + deal.image}
        />
      ) : (
        <LazyLoad offset={50}
                  placeholder={<CardMediaFix alt="Placeholder"
                                             image={`data:image/png;base64,${DEAL_IMAGE_PLACEHOLDER}`}/>}>
          <CardMediaFix
            classes={{ root: classes.mediaRoot }}
            alt={deal.description.title}
            image={CDN_BASE_URL + deal.image}
          />
        </LazyLoad>
      )}

      <div className={classes.opaquePriceTextContainer}>
        <Typography variant="h6" style={{ color: '#fff' }}>
          {getDiscountLabel(deal)}
        </Typography>
      </div>

      <div className={classes.opaquePriceButtonContainer}>
        {getButton(deal)}
      </div>
    </div>
  );
};

function getButton(deal: IApiDeal): React.ReactNode {
  switch (deal.type) {
    case DealType.DISCOUNT_CATEGORY:
    case DealType.DISCOUNT_WHOLE_BILL:
      return <DiscountButton/>;
    case DealType.ADDON:
      return <PriceButton value={deal.value.originalValue}/>;
    case DealType.SPECIAL:
      return <SpecialButton/>;
    default:
      return <PriceButton value={deal.value.discountValue}/>;
  }
}
