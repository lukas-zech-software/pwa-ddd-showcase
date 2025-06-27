/* eslint-disable no-console */
import 'reflect-metadata';
import { setup }  from '../../../src/container/inversify.config';
import { TestDb } from './TestDb';

const container = setup(__dirname);

const testDb = container.get<TestDb>(TestDb);

testDb.init().then(() => {
  console.log('TestDb initialised');
}).catch((error) => {
  console.log('TestDb failed', error);
});
