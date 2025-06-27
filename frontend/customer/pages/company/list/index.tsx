import {
  createStyles,
  Snackbar,
  Theme,
  WithStyles,
  withStyles,
}                                  from '@material-ui/core';
import { Loading }                 from '@my-old-startup/frontend-common/components';
import { IS_SERVER }               from '@my-old-startup/frontend-common/constants';
import { observer }                from 'mobx-react';
import { NextPageContext }         from 'next';
import Head                        from 'next/head';
import * as React                  from 'react';
import { DateFilter }              from '../../../../../common/enums';
import {
  ApiSearchResponseMinimal,
  CompanyFilter,
}                                  from '../../../../../common/interfaces';
import { CUSTOMER_COMPANY_ROUTES } from '../../../../../common/routes/FrontendRoutes';
import { APP_HEADER_HEIGHT }       from '../../../common/constants';
import { CompanyListView }         from '../../../components/list/CompanyListView';
import { EmptyCardCorona }         from '../../../components/map/EmptyCardCorona';
import { customerDealFacade }      from '../../../facade/CustomerDealFacade';
import { searchService }           from '../../../services/SearchService';
import {
  ADDRESS_STORAGE_KEY,
  locationStore,
}                                  from '../../../store/LocationStore';
import { searchStore }             from '../../../store/SearchStore';

const addressCookieRegexp = new RegExp(`${ADDRESS_STORAGE_KEY}=([^;]+)`);
const searchParamRegexp   = new RegExp(`${CUSTOMER_COMPANY_ROUTES.companyListViewPath}/(.+)`);

const styles = (theme: Theme) => createStyles(
  {
    snackbar: {
      maxWidth: 400,
      top:      (APP_HEADER_HEIGHT + 2) * theme.spacing(1) + 'px !important',
    },
  },
);

type Props = {
  filter: CompanyFilter;
  results: ApiSearchResponseMinimal | void;
}

@observer
class CompanyListPage extends React.Component<Props & WithStyles<typeof styles>> {
  private static getFilterOnServer(context: NextPageContext): CompanyFilter {
    let address: string | undefined = undefined;

    if (context.req && context.req.headers.cookie !== undefined) {
      const cookies: string = context.req.headers.cookie as string;
      // if there are any previous filters provided bu the user, take those
      const match           = cookies.match(addressCookieRegexp);

      if (match) {
        address = decodeURIComponent(match[1]);
      }
    }

    const query = context.query;
    //query overrules url param
    if (query !== undefined) {
      // if there is a address provided via URL, apply it to the store
      const querySearchText = query.searchText as string;
      if (querySearchText !== undefined) {
        address = decodeURIComponent(querySearchText);
      }
    }

    return {
      address,
      date: DateFilter.TODAY,
    };
  }

  private static getFilterOnClient(): CompanyFilter {
    let address: string | undefined = undefined;

    const match = window.location.pathname.match(searchParamRegexp);
    if (match) {
      try {
        address = decodeURIComponent(match[1]);
      } catch (e) {
        console.error(e);
      }
    }

    return {
      address,
      date: DateFilter.TODAY,
    };
  }

  public static async getInitialProps(props: NextPageContext): Promise<Props | {}> {
    if (IS_SERVER) {
      const filter  = CompanyListPage.getFilterOnServer(props);
      const results = await customerDealFacade.getMinimal({
                                                            body: {
                                                              filter,
                                                            },
                                                          });
      return {
        filter,
        results,
      };
    }

    return {
      filter: {
        address: locationStore.location.address,
        date:    DateFilter.TODAY,
      },
    };
  }

  componentWillMount(): void {
    if (this.props && this.props.results !== undefined) {
      const results = this.props.results;
      if (results.location) {
        locationStore.setLocationDirect(results.location);
      }
      searchStore.setSearchResponse(results);
      return;
    }

    if (searchStore.hasLoadedOnce === true && searchStore.currentCompanyResults.length === 0 && searchStore.isLoading === false) {
      void searchService.search();
    }

  }

  public render(): React.ReactNode {
    const { classes, filter } = this.props;
    const title               = `my-old-startups-domain | Unterstütze Gastronomen in ${filter.address}`;
    const description         = `my-old-startups-domain bietet dir die Möglichkeit Gastronomen in ${filter.address} mit wenigen Klicks während der Corona Krise zu unterstützen.`;

    if (searchStore.hasLoadedOnce === false || searchStore.isLoading === true) {
      return <Loading center/>;
    }

    if (searchStore.hasLoadedOnce === true && searchStore.currentCompanyResults.length === 0 && searchStore.isLoading === false) {
      return (
        <Snackbar
          className={classes.snackbar}
          anchorOrigin={{
            horizontal: 'center',
            vertical:   'top',
          }}
          open
        >
          <EmptyCardCorona/>
        </Snackbar>
      );
    }

    return (
      <>
        <Head>
          <title>
            {title}
          </title>
          <meta key="description" name="description" content={description}/>
          <meta key="og:description" name="og:description" property="og:description" content={description}/>
          <meta key="og:title" name="og:title" property="og:title" content={title}/>
          <meta key="og:url" name="og:url" property="og:url"
                content={'https://app.my-old-startups-domain.de' + CUSTOMER_COMPANY_ROUTES.companyListViewPath + '/' + filter.address}/>
        </Head>

        <CompanyListView searchStore={searchStore}/>
      </>
    );
  }
}

export default withStyles(styles)(CompanyListPage);

