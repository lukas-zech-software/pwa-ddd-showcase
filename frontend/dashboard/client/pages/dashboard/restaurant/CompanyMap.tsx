import { IApiCompanyLocation }    from '@my-old-startup/common/interfaces';
import { DASHBOARD_MAPS_OPTIONS } from '@my-old-startup/frontend-common/constants';
import * as React                 from 'react';
import { CompanyType }            from '../../../../../../common/enums';

export class CompanyMap extends React.Component<{ companyLocation: IApiCompanyLocation, type:CompanyType }, any> {
  public render(): JSX.Element {
    const location       = this.props.companyLocation;

    return (
      <iframe
        frameBorder={0}
        height="100%"
        width="100%"
        src={`https://www.google.com/maps/embed/v1/place?key=${DASHBOARD_MAPS_OPTIONS.key}&q=${location.lat},${location.lng}`}
      />
    );
  }
}
