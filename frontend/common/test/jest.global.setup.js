/**
 * This JavaScript file is executed just once when jest is started
 * Everything that needs to be loaded / set only once should be put in here
 */

module.exports = function() {
  console.log("-> jest.global.setup()");
  process.env.NODE_ENV = "test";
};
