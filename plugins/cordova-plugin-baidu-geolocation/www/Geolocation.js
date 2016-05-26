// baidu geolocation

var cordova = require('cordova');

var SERVICE_NAME = 'BaiduGeolocation';
var ACTION_GET_CURRENT_POSITION = 'getCurrentPosition';
var ACTION_WATCH_POSITION = 'watchPosition';
var ACTION_CLEAR_WATCH = 'clearWatch';

var geolocationBaidu = module.exports = {};

var idGenerator = 0;

geolocationBaidu.getCurrentPosition = function (success, error, options) {
  if (typeof sucess === 'object') {
    options = success;
  }
  if (typeof error === 'object') {
    options = error;
  }
  cordova.exec(function(args) {
    success.apply(null, args);
  }, error, SERVICE_NAME, ACTION_GET_CURRENT_POSITION, [options]);
};

geolocationBaidu.watchPosition = function (success, error, options) {
  var watchId = idGenerator++;
  cordova.exec(function(args) {
    success.apply(null, args);
  }, error, SERVICE_NAME, ACTION_WATCH_POSITION, [options, watchId]);
  return watchId;
};

geolocationBaidu.clearWatch = function (watchId) {
  cordova.exec(null, null, SERVICE_NAME, ACTION_CLEAR_WATCH, [watchId]);
};
