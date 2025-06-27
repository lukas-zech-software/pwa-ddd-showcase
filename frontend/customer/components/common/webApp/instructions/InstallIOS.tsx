import React from 'react';
import { Typography, makeStyles, Theme } from "@material-ui/core";
import { locale } from "../../../../common/locales";
import { RawHtml } from '@my-old-startup/frontend-common/components';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingRight: theme.spacing(5),
  },
}))

export const InstallIOS: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h6">{ locale.install.iPhone.subheading }</Typography>
      <ol>
        <li>{ locale.install.iPhone.body.tapShare }</li>
        <li><RawHtml>{ locale.install.iPhone.body.andSelectHtml }</RawHtml></li>
        <li><RawHtml>{ locale.install.iPhone.body.finallyTapAddHtml }</RawHtml></li>
      </ol>
      <Typography variant="body2">{ locale.install.installSuccess }</Typography>
    </div>
  );
};
