import { Card, CardHeader, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import * as React                                                        from 'react';
import { locale }                                                        from './locales';

const styles = (theme: Theme) => createStyles({
  buttonLink: {
    textDecoration: 'none',
    color:          theme.palette.text.primary,
  },
});

type Props = WithStyles<typeof styles>;

export const WelcomeCard = withStyles(styles)(
  // eslint-disable-next-line react/display-name
  class extends React.Component<Props> {
    public render(): JSX.Element {
      return (
        <Card>
          <CardHeader title={locale.registrationIntro.header} subheader={locale.common.error.noCompany}/>
        </Card>
      );
    }
  },
);
