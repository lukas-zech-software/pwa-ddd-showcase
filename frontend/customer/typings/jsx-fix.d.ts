/* eslint-disable */
declare namespace JSX {
  interface AmpImg {
    alt?: string;
    src?: string;
    width?: string | number;
    height?: string | number;
    layout?: string;
  }

  interface IntrinsicElements {
    'amp-img': AmpImg;
  }
}
