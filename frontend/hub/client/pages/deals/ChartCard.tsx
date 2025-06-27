import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  createStyles,
  IconButton,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                      from '@material-ui/core';
import { MoreVert }    from '@material-ui/icons';
import { alertColors } from '@my-old-startup/frontend-common/style';
import * as React      from 'react';

const styles = (theme: Theme) => createStyles({
  topicHeader: {
    backgroundColor: theme.palette.background.default,
    '& th':          {
      textAlign:  'center',
      fontWeight: 'bold',
    },
  },
  centered: {
    textAlign: 'center',
  },
  card:    {},
  actions: {
    flexDirection: 'row-reverse',
  },
  table: {
    minWidth: 700,
  },
  actingWarning: {
    color: alertColors(theme).warning,
    width: 1,
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  media: {
    height:     0,
    paddingTop: '56.25%', // 16:9
  },
});

type Props = {
  header: string;
  image: string;
  subheader: string;
  icon: React.ReactNode;
} & WithStyles<typeof styles>;

class _ChartCard extends React.Component<Props> {

  public render(): JSX.Element {
    const { classes, children, header, subheader, icon, image } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {icon}
            </Avatar>
          }

          action={
            <IconButton>
              <MoreVert/>
            </IconButton>
          }
          title={header}
          subheader={subheader}
        />

        <CardMedia
          className={classes.media}
          image={image}
          title="Some Chart"
        />
        <CardContent>
          <Typography gutterBottom variant="subtitle1" component={'h2' as any}>
            {children}
          </Typography>
        </CardContent>
      </Card>

    );
  }
}

export const ChartCard = withStyles(styles)(_ChartCard);
