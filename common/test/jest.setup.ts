import 'reflect-metadata';

process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.error(`Unhandled Promise Rejection at: Promise ${p} reason: ${reason}`);
});
