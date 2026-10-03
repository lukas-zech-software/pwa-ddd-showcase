import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  SvgIcon,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                 from '@material-ui/core';
import { Email, PhoneAndroid }    from '@material-ui/icons';
import { DayOfWeek }              from '@my-old-startup/common/enums/types';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import { capitalize }             from '@my-old-startup/frontend-common/utils/format';
import * as React                 from 'react';

const styles = (theme: Theme) => createStyles({
  card: {
    height: '100%',
  },
  contactBlock: {
    textAlign:    'center',
    marginBottom: theme.spacing(5),
    marginTop:    theme.spacing(2),
  },
  bolded: {
    fontWeight: 'bold',
  },
});

type Props = WithStyles<typeof styles> & {};

const _contactOptions: React.FC<Props> = ({ classes }: Props) => (
  <Card elevation={4} className={classes.card}>
    <CardHeader/>
    <CardContent>
      <div className={classes.contactBlock}>
        <SvgIcon fontSize="large">
          <PhoneAndroid/>
        </SvgIcon>
        <Typography className={classes.bolded}>
          {capitalize(commonLocale.common.words.phone)}
        </Typography>
        <Typography variant="caption">
          <a href="tel:+4922336199750">+49 2233 6199750</a>
          <br/>
          <a href="tel:+4917643222354">+49 176 43222354</a>
          <br/>
          {'9:00 – 18:00'}
          <br/>
          {commonLocale.common.words.daily}
        </Typography>
      </div>
      <div className={classes.contactBlock}>
        <SvgIcon fontSize="large">
          <Email/>
        </SvgIcon>
        <Typography className={classes.bolded}>
          {capitalize(commonLocale.common.words.email)}
        </Typography>
        <Typography variant="caption">
          <a href="mailto:support@my-old-startups-domain.de">support@my-old-startups-domain.de</a>
        </Typography>
      </div>
    </CardContent>
  </Card>
);

export const ContactOptions = withStyles(styles)(_contactOptions);
