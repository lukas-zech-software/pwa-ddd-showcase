import { IApiCompany }           from '@my-old-startup/common/interfaces/IApiCompany';
import { ICompanyUrlContext }    from '@my-old-startup/common/interfaces/urlContexts';
import { logService }            from '@my-old-startup/frontend-common/services/LogService';
import NextError                 from 'next/error';
import * as React                from 'react';
import { CompanyDetailViewCard } from '../../../../components/company/CompanyDetailViewCard';
import { CompanyMetaData }       from '../../../../components/company/CompanyMetaData';
import { customerCompanyFacade } from '../../../../facade/CustomerCompanyFacade';
import { geoLocationService }    from '../../../../services/GeoLocationService';

type Props = {
  query: ICompanyUrlContext;
  result: IApiCompany | undefined;
};

type State = {
  distance: number;
};

class CompanyDetails extends React.Component<Props, State> {
  public state = { distance: 0 };

  public static async getInitialProps(props: Props): Promise<Props> {
    try {
      const response = await customerCompanyFacade.getForId({ url: { companyId: props.query.companyId } });

      if (response) {
        return { result: response, query: props.query };
      }

      logService.error(`Could find company with id "${props.query.companyId}"`);
    } catch (error) {
      logService.error(`Could not obtain company with id "${props.query.companyId}"`, error);
    }

    return { result: undefined, query: props.query };
  }

  public async componentWillMount(): Promise<void> {
    if (!this.props.result) {
      return;
    }

    // cannot throw
    const distance = await geoLocationService.getDifferenceToCurrentPoint(this.props.result.location);

    this.setState({ distance: Math.round(distance * 100) / 100 });
  }

  public render(): React.ReactNode {
    const { result } = this.props;

    if (result === undefined) {
      return <NextError statusCode={404}/>;
    }

    return (
      <>
        <CompanyDetailViewCard company={result} distance={this.state.distance}/>
        <CompanyMetaData company={result}/>
      </>
    );
  }
}

export default CompanyDetails;
