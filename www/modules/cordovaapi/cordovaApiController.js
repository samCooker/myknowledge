/**
 * Created by cookie on 2016/6/14.
 */
(function () {
    appModule
        .config(cordovaApiRouter)
        .controller('cordovaApiMainController', CordovaApiMainController)
        .controller('cordovaApiController', CordovaApiController)
    ;

    function cordovaApiRouter($stateProvider) {
        $stateProvider
            .state('cordovaapi', {
                url: '/cordovaapi',
                abstract: true,
                controller: 'cordovaApiMainController',
                templateUrl: 'modules/cordovaapi/cordovaApi.html'
            })
            .state('cordovaapi.list', {
                url: '/list',
                views: {
                    'cordovaapi': {
                        controller: 'cordovaApiController',
                        templateUrl: 'modules/cordovaapi/list.html'
                    }
                }
            })
    }

    function CordovaApiMainController($scope) {
        $scope.rootPath = 'modules/cordovaapi/';
        $scope.title = 'api-overview';
        $scope.innerHtmlSrc = $scope.rootPath + 'api-overview.html';

        $scope.changeIframeSrc = function (htmlName) {
            $scope.$broadcast('cordova.api.page.change', htmlName);
        }
    }

    function CordovaApiController($scope) {

        $scope.$on('cordova.api.page.change', function (event, data) {
            $scope.innerHtmlSrc = $scope.rootPath + data + '.html';
            $scope.title = data;
        })
    }
})();