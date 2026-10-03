import { createStyles, Typography, withStyles, WithStyles } from '@material-ui/core';
import { IApiCompany }                                      from '@my-old-startup/common/interfaces';
import * as React                                           from 'react';

const styles = () => createStyles({
  phone: {
    fontWeight: 'lighter',
  },
});

type Props = WithStyles<typeof styles> & {
  company: IApiCompany;
};

type State = {};

class _CompanySummaryAddress extends React.Component<Props, State> {
  public render(): React.ReactElement {
    const { classes, company } = this.props;

    return (
      <div>
        <Typography variant="body2">
          {company.contact.address}
          <br/>
          {company.contact.zipCode} {company.contact.city}
        </Typography>
        <Typography variant="body2" className={classes.phone}>Tel. +49 {company.contact.telephone}</Typography>
      </div>
    );
  }
}

export const CompanySummaryAddress = withStyles(styles)(_CompanySummaryAddress);
