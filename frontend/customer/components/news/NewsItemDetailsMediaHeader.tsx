import {
  createStyles,
  makeStyles,
  NoSsr,
  Theme,
  Typography,
} from '@material-ui/core';

import { CDN_BASE_URL } from '@my-old-startup/common/enums/constants';
import { CardMediaFix } from '@my-old-startup/frontend-common/fixes/CardMediaFix';

import clsx              from 'clsx';
import * as React        from 'react';
import LazyLoad          from 'react-lazyload';
import {
  DealSpecialType,
  DealType,
}                        from '../../../../common/enums';
import { IApiDeal }      from '../../../../common/interfaces';
import { locale }        from '../../common/locales';
import {
  CountDownChip,
  NewsDateChip,
} from '../common/deal';

export const DEAL_IMAGE_PLACEHOLDER = 'iVBORw0KGgoAAAANSUhEUgAAAu4AAAFFCAQAAAAZJ6DxAAADkElEQVR42u3UMQEAAAjDMOZf9PABiYQeTTsAHBNzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3cwcwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdxEAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcATB3AMwdAHMHwNwBMHcAcwfA3AEwdwDMHQBzBzB3AMwdAHMHwNwBMHcAzB3A3AEwdwDMHQBzB8DcAcwdAHMHwNwBMHcAzB3A3M0dwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdwNzNHcDcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHcDcRQAwdwDMHQBzB8DcATB3AHMHwNwBMHcAzB0AcwcwdwDMHQBzB8DcATB3AMwdwNwBMHcAzB0AcwfA3AHMHQBzB8DcATB3AMwdAHMHMHcAzB0AcwfA3AEwdwBzB8DcATB3AMwdAHMHwNwBzB0AcwfA3AEwdwDMHeCxBe27iNoSvE1ZAAAAAElFTkSuQmCC';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        root:                     {
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
        opaquePriceTextContainer: {
          paddingLeft:     theme.spacing(2),
          color:           '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',

          width:      '100%',
          lineHeight: .7,
          position:   'absolute',
          bottom:     0,
          left:       0,
        },
        mediaRoot:                {
          height: `calc(100% / 2.3)`, // 2.3:1 aspect ratio
        },
      },
    ),
);

type Props = {
  deal: IApiDeal;
  noLazy?: boolean;
};

export const NewsItemDetailsMediaHeader: React.FC<Props> = (props: Props) => {
  const classes          = useStyles();
  const { deal, noLazy } = props;
  const isMenu           = deal.type === DealType.SPECIAL_MENU;

  return (
    <div className={clsx(classes.root)}>
      <div className={clsx(classes.chipContainer)}>
        <NoSsr>
          <NewsDateChip deal={deal}/>
        </NoSsr>
      </div>

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
          {!isMenu && locale.listView.card.specials[DealSpecialType[deal.specialType!]]}
          {isMenu && locale.listView.card.specialMenu[DealSpecialType[deal.specialType!]]}
        </Typography>
      </div>
    </div>
  );
};

