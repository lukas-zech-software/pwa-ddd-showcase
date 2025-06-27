import { Avatar, Card, CardHeader, createStyles, withStyles, WithStyles } from '@material-ui/core';
import { green }                                                          from '@material-ui/core/colors';
import { CheckCircle }                                                    from '@material-ui/icons';
import * as React                                                         from 'react';
import { locale }                                                         from '../locales';

const styles = () => createStyles({
  avatar: {
    backgroundColor: green[600],
  },
});

type Props = WithStyles<typeof styles> & {};

const _contactSuccessCard: React.FunctionComponent<Props> = ({ classes }: Props) => (
  <Card>
    <CardHeader avatar={
      <Avatar aria-label="Check mark" className={classes.avatar}>
        <CheckCircle/>
      </Avatar>
    }
                title={locale.dashboard.contactPage.success}
    />
  </Card>
);

export const ContactSuccessCard = withStyles(styles)(_contactSuccessCard);
