import { Grid }               from '@material-ui/core';
import { IApiCompanyMinimal } from '@my-old-startup/common/interfaces/IApiCompany';
import * as React             from 'react';
import { calculateDistance }  from '../../../../common/utils/geoUtils';
import { locationStore }      from '../../store/LocationStore';
import { DistanceShare }      from '../common/DistanceShare';
import { CompanyContact }     from './CompanyContact';
import { CompanyShareButton } from './CompanyShareButton';

type Props = {
  company: IApiCompanyMinimal;
  distance: number;
  component?: string;
};

export const CompanyDistanceShare = (props: Props): JSX.Element => {
  const { company, component } = props;

  // CORONA
  const distance = company.distance || calculateDistance(company.location, locationStore.location.coordinates);

  return (
    <DistanceShare
      telephone={company.contact.telephone}
      secondaryTelephone={company.contact.secondaryTelephone}
      secondaryTelephoneReason={company.contact.secondaryTelephoneReason}
      title={company.contact.title}
      component={component}
      isCompany
      shareButton={(
        <CompanyShareButton company={company}/>
      )}
      distance={distance}>
      <Grid container>
        <Grid item xs={9}>
          <CompanyContact company={company}/>
        </Grid>
      </Grid>
    </DistanceShare>

  );
};
