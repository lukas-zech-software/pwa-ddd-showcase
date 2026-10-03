/* eslint-disable */
import 'reflect-metadata';
import { setup }     from '../../../src/container/inversify.config';
import { TestQuery } from './TestQuery';

const container = setup(__dirname);

const testQuery = container.get<TestQuery>(TestQuery);

testQuery.runQuery().then(() => {
  console.log('Test query executed');
}).catch((error) => {
  console.log('test query failed', error);
});
