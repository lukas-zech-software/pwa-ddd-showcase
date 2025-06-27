import {
  Avatar,
  CardMedia,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { CDN_BASE_URL }        from '@my-old-startup/common/enums/constants';
import { IApiCompanyMinimal }  from '@my-old-startup/common/interfaces/IApiCompany';
import { COMPANY_LOGO_CONFIG } from '@my-old-startup/common/interfaces/ImageConfiguration';
import * as React              from 'react';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_LOGO,
}                              from '../../../../common/routes/default_urls';
import { APP_HEADER_HEIGHT }   from '../../common/constants';
import { getDistance }         from '../../utils/mapUtils';
import { CompanyReopenBanner } from './CompanyReopenBanner';

const styles = (theme: Theme) => createStyles(
  {
    chipContainer:       {
      'position': 'absolute',
      'top':      0,
      'left':     0,
      '&.big':    {
        top:  `${(APP_HEADER_HEIGHT + 1) * theme.spacing(1)}px`,
        left: theme.spacing(1),
      },
    },
    badgeChipContainer:  {
      'position': 'absolute',
      'top':      0,
      'right':    0,
      '&.big':    {
        top: `${APP_HEADER_HEIGHT * theme.spacing(1)}px`,
      },
    },
    mediaRoot:           {
      height: 'calc(100% / 2.3)', // 2.3:1 aspect ratio
    },
    opaqueContainerGrid: {
      position:     'relative',
      // move container into image above
      top:          -(COMPANY_LOGO_CONFIG.height + theme.spacing(4)),
      marginBottom: -(COMPANY_LOGO_CONFIG.height + theme.spacing(4)),
    },
    opaqueText:          {
      color:   'rgba(255,255,255,1)',
      padding: 0,
      margin:  0,
    },

    opaqueContainer: {
      position: 'relative',
      width:    '100%',
      height:   0,
      left:     0,
      top:      0,
    },

    opaqueTextContainer: {
      paddingLeft:     theme.spacing(2),
      color:           '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',

      width:      '100%',
      lineHeight: .7,
      position:   'absolute',
      top:        theme.spacing(-4),
      left:       0,
    },

    avatar: {
      margin:   '0 auto',
      height:   COMPANY_LOGO_CONFIG.height / 2,
      width:    COMPANY_LOGO_CONFIG.width / 2,
      position: 'relative',
      top:      -(COMPANY_LOGO_CONFIG.height / 2 + theme.spacing(1)),
      zIndex:   10,
      border:   `3px solid ${theme.palette.common.white}`,
    },

  },
);

const CardMediaFix: any = CardMedia;

type Props = {
  company: IApiCompanyMinimal;
  distance: number;
  showImage?: boolean;
  mediaClass?: string;
} & WithStyles<typeof styles>;

const _CompanyDetailsMediaHeader: React.SFC<Props> = (props: Props) => {
  const { classes, company, distance, showImage = true, mediaClass } = props;
  let reopenBanner: any                                              = null;

  let image = CDN_BASE_URL + DEFAULT_BACKGROUND;
  let logo  = CDN_BASE_URL + DEFAULT_LOGO;

  if (showImage) {
    image = CDN_BASE_URL + company.images.background;
    logo  = CDN_BASE_URL + company.images.logo;

    reopenBanner = <CompanyReopenBanner offersReopen={company.corona.offersReopen}/>;
  }

  return (
    <>
      {reopenBanner}
      <CardMediaFix
        component={'img'}
        alt={company.contact.title + ' Logo'}
        classes={{ root: classes.mediaRoot }}
        className={mediaClass}
        image={image}
      />

      <div className={classes.opaqueContainer}>
        <Avatar src={logo}
                className={classes.avatar}
        />

        <div className={classes.opaqueTextContainer}>
          <Typography variant="h6" className={classes.opaqueText}>
            {getDistance(distance)}
          </Typography>
        </div>
      </div>

    </>
  );
};

export const CompanyDetailsMediaHeader = withStyles(styles)(_CompanyDetailsMediaHeader);
