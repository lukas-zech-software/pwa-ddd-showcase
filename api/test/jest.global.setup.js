/**
 * This JavaScript file is executed just once when jest is started
 * Everything that needs to be loaded / set only once should be put in here
 */

module.exports = function() {
  console.log('-> jest.global.setup()');
  process.env.NODE_ENV = 'test';

  process.env.GOOGLE_APPLICATION_CREDENTIALS = 'test';
  process.env.GOOGLE_CLOUD_PROJECT_ID        = 'test';
  process.env.BASE_URL                       = 'test';
  process.env.API_PORT                       = 'test';
  process.env.API_TYPE                       = 'test';
};
