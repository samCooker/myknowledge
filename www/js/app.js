// 使用cordova+angularjs+ionic开发app

// 设置全局变量 appModule，
var appModule = angular.module('starter', ['ionic']);

// 设置运行时的参数
appModule.run(function ($ionicPlatform, $location, $rootScope, $ionicHistory, $state, tipMsg, dbTool) {

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    //初始化本地存储数据库
    dbTool.initWebSqlDb('appDb');

    //物理返回按钮控制&双击退出应用
    $ionicPlatform.registerBackButtonAction(function (e) {
        if ($location.path() == '/admin`/welcome'||$location.path() == '/home/welcome' || $location.path() == '/login') {
            //判断处于哪个页面时双击退出
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();//退出app
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                tipMsg.showMsg('再按一次退出系统');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        } else if ($ionicHistory.backView()) {
            //点击返回上一个页面，先隐藏显示的键盘
            if (window.cordova.plugins.Keyboard.isVisible) {
                window.cordova.plugins.Keyboard.close();
            } else {
                $ionicHistory.goBack();
            }
        }
        e.preventDefault();
        return false;
    }, 101);//101 数值越高优先级越高，详情可查看源码

});

//tabs位置设置
appModule.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom"); //参数可以是： top | bottom
});

//app全局配置参数
appModule.factory('appConfig', function () {
    var host = '192.168.1.179';
    var port = '8080';
    var isLocal = true;

    return {
        getLocalDebug: getLocalDebugFun,//获取是否离线启动app
        setLocalDebug: setLocalDebugFun,//设置是否离线
        getHost: getHostFun,//获取http请求url
        getLocalHost: getLocalHostFun//获取离线数据的url
    };

    /**
     * 获取http请求url
     * @returns {string}
     */
    function getHostFun() {
        return 'http://' + host + ':' + port + '/app_config/';
    }

    /**
     * 获取离线数据的url
     */
    function getLocalHostFun() {
        return 'jsondata/common.json';
    }

    /**
     * 获取是否离线启动app
     * @returns {boolean}
     */
    function getLocalDebugFun() {
        return isLocal;
    }

    /**
     * 设置是否离线
     * @param localFlag
     */
    function setLocalDebugFun(localFlag) {
        isLocal = localFlag;
    }
});