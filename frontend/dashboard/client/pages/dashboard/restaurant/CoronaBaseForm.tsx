import {
  createStyles,
  withStyles,
  WithStyles,
  withWidth,
}                                 from '@material-ui/core';
import { WithWidthProps }         from '@material-ui/core/withWidth';
import { ApiCompany }             from '@my-old-startup/common/validation';
import { Loading }                from '@my-old-startup/frontend-common/components/Loading';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import { locale }                 from '../../../common/locales';
import { dashboardCompanyFacade } from '../../../facade/DashboardCompanyFacade';
import { BaseCompanyFormCard }    from '../../../form/BaseCompanyFormCard';
import { companyStore }           from '../../../stores/CompanyStore';

const styles = () =>
  // noinspection JSSuspiciousNameCombination
  createStyles(
    {},
  );

type Props = {
  header: string;
  subKey: 'reopen' | 'delivery' | 'takeAway' | 'coupons' | 'donations'
  children: any;
} & WithStyles<typeof styles> & WithWidthProps;
type State = {}

@observer
class _CoronaBaseForm extends React.Component<Props, State> {

  public render(): JSX.Element {
    const company = companyStore.currentCompany;

    if (company === undefined) {
      return <Loading/>;
    }

    let isDirty = false;
    if (companyStore.isDirty) {
      isDirty = companyStore.checkDirtyString(this.props.subKey);
    }

    return (
      <BaseCompanyFormCard
        isDirty={isDirty}
        header={(
          <>
            {this.props.header}
          </>
        )}

        submit={() => this.send(company)}>
        {this.props.children}
      </BaseCompanyFormCard>
    );
  }

  private send(company: ApiCompany): void {
    companyStore.isValidationEnabled = true;

    if (companyStore.companyCoronaValidationError.length !== 0) {
      return;
    }

    dashboardCompanyFacade.updateCorona(company.corona, company.id)
      .then(() => globalMessageService.pushMessage({
                                                     message: locale.forms.corona.saveMessage,
                                                     variant: 'success',
                                                   }))
      .catch(() => globalMessageService.pushMessage({
                                                      message: locale.common.error.defaultErrorMessage,
                                                      variant: 'error',
                                                    }));

  }
}

export const CoronaBaseForm = withWidth()(withStyles(styles)(_CoronaBaseForm));
