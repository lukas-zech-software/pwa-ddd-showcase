import {
  createStyles,
  makeStyles,
  Paper,
  Theme,
}                                from '@material-ui/core';
import { Loading }               from '@my-old-startup/frontend-common/components';
import clsx                      from 'clsx';
import * as React                from 'react';
import { useState }              from 'react';
import { IApiCompany }           from '../../../../common/interfaces';
import { calculateDistance }     from '../../../../common/utils/geoUtils';
import { customerCompanyFacade } from '../../facade/CustomerCompanyFacade';
import { locationStore }         from '../../store/LocationStore';
import { searchStore }           from '../../store/SearchStore';
import { CompanyMapCard }        from '../company/CompanyMapCard';

const useStyles = makeStyles(
  (theme: Theme) => createStyles(
    {
      '@global':     {
        '::-webkit-scrollbar': { display: 'none' },
      },
      backgroundShadow: {
        background:                   'linear-gradient(to bottom, rgba(0, 0, 0, .3), rgba(0, 0, 0, .5) 75%)',
        position:                     'fixed',
        top:                          0,
        height:                       `100%`,
        width:                        `100%`,
        overflowY:                    'auto',
        overflowX:                    'hidden',
        zIndex:                       1000000,
        padding:                      theme.spacing(2),
        [theme.breakpoints.up('md')]: {
          paddingTop: theme.spacing(10),
          padding: theme.spacing(6),
        },
      },
    },
  ));

type Props = {
  companyId: string;
  onClose: () => void;
};

export function MapCardCompany(props: Props): JSX.Element {
  const { onClose, companyId } = props;
  const classes                = useStyles();

  const [company, setCompany] = useState<IApiCompany | undefined>(undefined);

  if (company === undefined) {
    customerCompanyFacade.getForId({ url: { companyId } }).then((response) => {
      if (response) {
        setCompany(response);
      } else {
        onClose();
      }
    }).catch(() => {
      onClose();
    });
    return <Loading/>;
  }

  const distance = calculateDistance(company.location, locationStore.location.coordinates);

  return (
    <Paper
      elevation={0}
      onClick={onClose}
      className={classes.backgroundShadow}
    >

      <CompanyMapCard
        onClose={onClose}
        company={company}
        distance={distance}
      />

    </Paper>
  );
}
