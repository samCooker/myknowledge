var exec = require('cordova/exec');

//定义导航对象 与 方法
var MapNavigation = {
  navigation:function(key, successCallback, errorCallback) {
    	exec(successCallback, errorCallback, 'MapNavigation', 'navigate', [key])
	}
};

module.exports= MapNavigation;

