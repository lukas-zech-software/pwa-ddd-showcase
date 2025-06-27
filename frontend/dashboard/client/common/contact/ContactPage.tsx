import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                         from '@material-ui/core';
import * as React         from 'react';
import { ContactForm }    from './ContactForm';
import { ContactOptions } from './ContactOptions';

const styles = (theme: Theme) => createStyles(
  {
    wrapper:       {
      margin: 'auto',
    },
    bodyParagraph: {
      marginBottom: theme.spacing(2),
    },
  },
);

type Props = WithStyles<typeof styles> & {
  title: string;
  bodyParagraphs: string[];
  email: 'support@my-old-startups-domain.de' | 'feedback@my-old-startups-domain.de';
  showContactOptions?: boolean;
};

const _contactPage: React.FunctionComponent<Props> =
        ({ classes, title, bodyParagraphs, email, showContactOptions }: Props) => {
          const paragraphs = bodyParagraphs
            .map((para, idx) => (
              <Typography key={idx} variant="body2"
                          className={classes.bodyParagraph}>
                {para}
              </Typography>
            ));

          return (
            <Grid container spacing={1} alignItems="stretch" className={classes.wrapper}>
              <Grid item xs={12} sm={8} md={6}>
                <Card elevation={4}>
                  <CardHeader title={title}/>
                  <CardContent>
                    {paragraphs}
                    <ContactForm email={email}/>
                  </CardContent>
                </Card>
              </Grid>
              {showContactOptions && (
                <Grid item xs={12} sm={4} md={6}><ContactOptions/></Grid>
              )}
            </Grid>
          );
        };

export const ContactPage = withStyles(styles)(_contactPage);
