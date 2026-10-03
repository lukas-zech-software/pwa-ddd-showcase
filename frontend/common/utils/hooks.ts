import {
  useMediaQuery,
  useTheme,
}                     from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */
export function useWidth(): Breakpoint | null {
  const theme = useTheme();
  const keys  = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce<Breakpoint | null>(
      (output, key) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const matches = useMediaQuery(theme.breakpoints.up(key));
        return !output && matches ? key : output;
      },
      null,
    ) || 'xs'
  );
}
