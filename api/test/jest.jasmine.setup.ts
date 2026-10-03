/**
 * Jest Setup script that is loaded for each environment (one time per test file at least)
 * Put everything in there that can only be set when already in a virtual jest process
 *
 * Everything else should be put into jest.global.setup.js which is only executed once per jest run
 */
import 'jest';
import 'reflect-metadata';
import { setup }     from '../src/container/inversify.config';
import { testSetup } from '../src/container/inversify.test.config';

const container = setup(__dirname);

beforeEach(() => {

  // create a snapshot so each unit test can modify
  // it without breaking other unit tests
  container.snapshot();
  testSetup();

});

afterEach(() => {

  // Restore to last snapshot so each unit test
  // takes a clean copy of the application container
  container.restore();

});
