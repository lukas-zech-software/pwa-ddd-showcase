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
import { RawHtml } from './RawHtml';

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
    },
  },
);

type Props = WithStyles<typeof styles> & {
  children: string;
  className?: string;
  variant?: Variant;
  raw?: boolean;
};

export const Paragraphs = withStyles(styles)(({ classes, children, className, raw, variant = 'caption' }: Props) => {
  const paragraphs = children.split(/\n+/).map((paragraph, key) => {
    let content: any = paragraph;

    if (paragraph === '_') {
      content = <span>&nbsp;</span>;
    } else if (raw) {
      content = <RawHtml>{paragraph}</RawHtml>;
    }

    return (
      <Typography key={key}
                  component={'p' as any}
                  variant={variant}
                  className={clsx(classes.textParagraph, className)}>
        {content}
      </Typography>);
  });

  return (
    <>
      {paragraphs}
    </>
  );
});
