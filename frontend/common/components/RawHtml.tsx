import * as React from 'react';

export function RawHtml(props: { children: string }): JSX.Element {
  return <span dangerouslySetInnerHTML={{ __html: props.children }}/>;
}
