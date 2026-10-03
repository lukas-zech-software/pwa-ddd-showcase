import { CardMedia } from '@material-ui/core';
import * as React    from 'react';

const _CardMediaFix: any = CardMedia as any;

type Props = { image: string; alt?: string; title?: string; className?: string; classes?: any };
export const CardMediaFix: React.SFC<Props> = ({ image, title, alt, className, classes }) => (
  <_CardMediaFix
    component="img"
    image={image}
    alt={alt}
    title={title}
    className={className}
    classes={classes}
  />
);
