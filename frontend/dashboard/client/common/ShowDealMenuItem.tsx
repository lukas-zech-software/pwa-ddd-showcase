import { createStyles, ListItemIcon, MenuItem, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { OpenInNew }
  from '@material-ui/icons';
import { IApiDeal }       from '@my-old-startup/common/interfaces';
import { COMPANY_ROUTES } from '@my-old-startup/frontend-common/routes';
import * as React         from 'react';
import { routeService }   from '../services/CdbRouteService';
import { locale }         from './locales';

const styles = (theme: Theme) => createStyles({
  itemIcon: {
    position: 'relative',
    right:    -theme.spacing(1),
  },
});

type Props = WithStyles<typeof styles> & {
  deal: IApiDeal;
  companyId: string;
};

const _showDealMenuItem: React.FC<Props> = ({ deal, companyId, classes }) => {
  if (deal.published === null) {
    return null;
  }

  const route = routeService.getRoute(COMPANY_ROUTES.dealDetails, {
    dealId: deal.id,
    companyId,
  });

  return (
    <MenuItem key="showDeal" onClick={() => window.location.href = `https://app.my-old-startups-domain.de${route}`}>
      <Typography variant="inherit" noWrap>
        {locale.common.menuItems.showDeal}
      </Typography>
      <ListItemIcon className={classes.itemIcon}>
        <OpenInNew/>
      </ListItemIcon>
    </MenuItem>
  );
};

export const showDealMenuItem = withStyles(styles)(_showDealMenuItem);
