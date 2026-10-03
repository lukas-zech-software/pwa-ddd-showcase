/**
 * Jest Setup script that is loaded for each environment (one time per test file at least)
 * Put everything in there that can only be set when already in a virtual jest process
 *
 * Everything else should be put into jest.global.setup.js which is only executed once per jest run
 */
import 'reflect-metadata';

process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Promise Rejection at: Promise ', p, ' reason: ', reason);
});
