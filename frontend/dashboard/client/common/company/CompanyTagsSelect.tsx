import {
  createStyles,
  Grid,
  Theme,
  withStyles,
  WithStyles,
}                             from '@material-ui/core';
import { CompanyType }        from '@my-old-startup/common/enums/types';
import { Loading }            from '@my-old-startup/frontend-common/components';
import { observer }           from 'mobx-react';
import * as React             from 'react';
import { DealTags }           from '../../../../../common/enums';
import { companyStore }       from '../../stores/CompanyStore';
import { TagPicker }          from '../TagPicker';
import { getValidationError } from '../utils/utils';

const styles = (theme: Theme) => createStyles({
                                                selectIcon: {
                                                  marginRight: theme.spacing(3),
                                                },
                                              });

type Props = {} & WithStyles<typeof styles>;

type State = {
  value: CompanyType;
};

@observer
class _CompanyTagSelect extends React.Component<Props, State> {

  public render(): JSX.Element {
    const company = companyStore.currentCompany;

    if (company === undefined) {
      return <Loading/>;
    }

    const errorMessage = getValidationError(companyStore.detailsValidationError, 'tag');

    return (
      <Grid item xs={12}>
        <TagPicker
          selectedTags={company.details.tags || []}
          error={!!errorMessage}
          onTagsChange={(tags) => this.onChange(tags)}
        />
      </Grid>
    );
  }

  private onChange(value: DealTags[]): void {
    if (companyStore.currentCompany) {
      companyStore.addDirty('tags');
      companyStore.currentCompany.details.tags = value;
    }
  }
}

export const CompanyTagSelect = withStyles(styles)(_CompanyTagSelect);
