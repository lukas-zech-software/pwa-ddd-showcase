import { Typography, Theme } from "@material-ui/core";
import { locale } from "../../../../common/locales";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from "@material-ui/styles";
import { RawHtml } from "@my-old-startup/frontend-common/components";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingRight: theme.spacing(5),
  },
  moreIcon: {
    verticalAlign: 'bottom',
  },
}))

export const InstallAndroid: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h6">{ locale.install.android.subheading }</Typography>
      <ol>
        <li>{ locale.install.android.body.openMenu } <MoreVertIcon className={classes.moreIcon} /></li>
        <li><RawHtml>{ locale.install.android.body.andTapHtml }</RawHtml></li>
      </ol>
      <Typography variant="body2">{ locale.install.installSuccess }</Typography>
    </div>
  );
};
