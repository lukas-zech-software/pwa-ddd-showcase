import {
  createStyles,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                  from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import clsx        from 'clsx';
import React       from 'react';

const styles = (theme: Theme) => createStyles(
  {
    textParagraph: {
      'width':        '100%',
      'overflow':     'hidden',
      'textOverflow': 'ellipsis',
      'display':      'block',
      'marginTop':    theme.spacing(1),
      '&:first':      {
        marginTop: 'inherit',
      },
      '&.limit':      {
        'height':       '20px',
        'textOverflow': 'ellipsis',
        'whiteSpace':   'nowrap',
      },
    },
  },
);

type Props = WithStyles<typeof styles> & {
  text: string;
  className?: string;
  variant?: Variant;
  limit?: boolean;
};

export const Paragraphs = withStyles(styles)(({ classes, text, className, variant = 'caption', limit }: Props) => {
  if (!text) {
    return null;
  }

  const lines      = text.split(/\n+/);
  const paragraphs = lines.slice(0, limit ? 1 : undefined).map((paragraph, key) => (
    !paragraph ? null :
      <Typography key={key}
                  component={'p' as any}
                  variant={variant}
                  className={clsx(classes.textParagraph, className, { limit })}>
        {paragraph}
        {limit && lines.length > 1 && lines[0].length < 77 && ' ...'}
      </Typography>));

  return (
    <>
      {paragraphs}
    </>
  );
});
