import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { IApiCompany }                                             from '@my-old-startup/common/interfaces';
import { locale as commonLocale }                                  from '@my-old-startup/frontend-common/locales';
import * as React                                                  from 'react';
import { CompanySummaryAddress }                                   from './CompanySummaryAddress';

const styles = (theme: Theme) => createStyles({
  companyType: {
    fontWeight: 'lighter',
    fontStyle:  'italic',
    overflow:   'hidden',
  },
  container: {
    borderLeft:  '1px solid black',
    paddingLeft: theme.spacing(1),
    marginTop:   theme.spacing(4),
    height:      `calc(100% - ${theme.spacing(4)}px)`,
  },
});

type Props = WithStyles<typeof styles> & {
  company: IApiCompany;
};

const _companySummarySidebar: React.FunctionComponent<Props> = (props: Props) => {
  const { classes, company } = props;

  return (
    <div className={classes.container}>
      <Typography variant="body2" className={classes.companyType}>
        {commonLocale.company.types[company.contact.type]}
      </Typography>
      <CompanySummaryAddress company={company}/>
    </div>
  );
};

export const CompanySummarySidebar = withStyles(styles)(_companySummarySidebar);
