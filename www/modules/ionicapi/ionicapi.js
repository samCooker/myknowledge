/**
 * Created by cookie on 2016/6/16.
 */
(function () {
    appModule
        .config(ionicApiRouter)
        .controller('ionicApiMainController', IonicApiMainController)
        .controller('ionicApiCssController', IonicApiCssController)
        .controller('ionicApiJsController', IonicApiJsController)
        .controller('ionicApiSearchController', IonicApiSearchController)
        .factory('ionicApiFactory', IonicApiFactory)
    ;

    /**
     * 路由设置
     */
    function ionicApiRouter($stateProvider) {
        $stateProvider
            .state('ionicapi', {
                url: '/ionicapi',
                abstract: true,
                controller: 'ionicApiMainController',
                templateUrl: 'modules/ionicapi/main.html'
            })
            .state('ionicapi.css', {
                url: '/css',
                views: {
                    'ionicApiCss': {
                        controller: 'ionicApiCssController',
                        templateUrl: 'modules/ionicapi/list-css.html'
                    }
                }
            })
            .state('ionicapi.js', {
                url: '/js',
                views: {
                    'ionicApiJs': {
                        controller: 'ionicApiJsController',
                        templateUrl: 'modules/ionicapi/list-js.html'
                    }
                }
            })
            .state('ionicapi.other', {
                url: '/other',
                views: {
                    'ionicApiOther': {
                        controller: 'ionicApiCssController',
                        templateUrl: 'modules/ionicapi/list-other.html'
                    }
                }
            })
            .state('apisearch', {
                url: '/apisearch',
                controller: 'ionicApiSearchController',
                params: {type: 'css'},
                templateUrl: 'modules/ionicapi/search.html'
            })
        ;
    }

    function IonicApiMainController($scope, $state, $ionicHistory, appConfig) {

        $scope.backToMenu = function () {
            $ionicHistory.clearHistory();
            $state.go(appConfig.getMainMenu());
        }
    }

    /**
     *
     */
    function IonicApiCssController($scope, $rootScope, $location, $ionicScrollDelegate, $state, $timeout) {

        $scope.searchApi = function () {
            $state.go('apisearch', {type: 'css'});
        };

        $rootScope.$on('ionic.api.search.back', function (event, data) {
            if (data) {
                $timeout(function () {
                    //跳转至指定id的dom所在位置
                    $location.hash(data);
                    $ionicScrollDelegate.anchorScroll(false);
                }, 150);
            }
        });
    }

    function IonicApiJsController($scope, $rootScope, $location, $ionicScrollDelegate, $state, $timeout) {

        $scope.searchApi = function () {
            $state.go('apisearch', {type: 'js'});
        };

        $rootScope.$on('ionic.api.search.back', function (event, data) {
            if (data) {
                $timeout(function () {
                    $location.hash(data);
                    $ionicScrollDelegate.anchorScroll(false);
                }, 150);
            }
        });
    }

    /**
     *  查询
     */
    function IonicApiSearchController($scope, $rootScope, $stateParams, $ionicHistory, ionicApiFactory) {
        $scope.searchParams = {title: ''};
        var type = $stateParams.type;
        $scope.menuData = ionicApiFactory.getApiMenu(type);

        $scope.apiSearch = function (id) {
            $ionicHistory.goBack();
            $rootScope.$broadcast('ionic.api.search.back', id);
        }

    }

    function IonicApiFactory() {

        /**
         * 菜单数据
         */
        var _menuData = {
            'css': [
                {'id': 'header', title: 'header'},
                {'id': 'subheader', title: 'subHeader'},
                {'id': 'content', title: 'content'},
                {'id': 'footer', title: 'footer'},
                {'id': 'buttons', title: 'buttons'},
                {'id': 'block-buttons', title: 'block buttons'},
                {'id': 'full-buttons', title: 'full width block buttons'},
                {'id': 'button-sizes', title: 'different sizes'},
                {'id': 'outlined-buttons', title: 'outlined buttons'},
                {'id': 'clear-buttons', title: 'clear buttons'},
                {'id': 'icon-buttons', title: 'icon buttons'},
                {'id': 'buttons-headers-footers', title: 'buttons in headers'},
                {'id': 'clear-buttons-headers', title: 'clear buttons in headers'},
                {'id': 'button-bar', title: 'button bar'},
                {'id': 'list', title: 'list'},
                {'id': 'item-dividers', title: 'list dividers'},
                {'id': 'item-icons', title: 'list icons'},
                {'id': 'item-buttons', title: 'list buttons'},
                {'id': 'item-avatars', title: 'item avatars'},
                {'id': 'item-thumbnails', title: 'item thumbnails'},
                {'id': 'list-inset', title: 'inset lists'},
                {'id': 'cards', title: 'cards'},
                {'id': 'card-headers-footers', title: 'card headers and footers'},
                {'id': 'card-lists', title: 'card lists'},
                {'id': 'card-images', title: 'card images'},
                {'id': 'card-showcase', title: 'card showcase'},
                {'id': 'forms', title: 'forms input'},
                {'id': 'forms-placeholder-labels', title: 'text input: placeholder labels'},
                {'id': 'forms-inline-labels', title: 'text input: inline labels'},
                {'id': 'forms-stacked-labels', title: 'text input: stacked labels'},
                {'id': 'forms-floating-labels', title: 'text input: floating labels'},
                {'id': 'inset-forms', title: 'inset forms'},
                {'id': 'item-input-inset', title: 'inset inputs'},
                {'id': 'input-icons', title: 'input icons'},
                {'id': 'bar-inputs', title: 'header inputs'},
                {'id': 'toggle', title: 'toggle'},
                {'id': 'checkbox', title: 'checkbox'},
                {'id': 'radio-buttons', title: 'radio button list'},
                {'id': 'range', title: 'range'},
                {'id': 'select', title: 'select'},
                {'id': 'tabs', title: 'tabs'},
                {'id': 'icon-only-tabs', title: 'icon only tabs'},
                {'id': 'icon-top-tabs', title: 'top icon tabs'},
                {'id': 'icon-left-tabs', title: 'left icon tabs'},
                {'id': 'striped-style-tabs', title: 'striped style tabs'},
                {'id': 'grid', title: 'grid'},
                {'id': 'grid-even', title: 'grid: evenly spaced columns'},
                {'id': 'grid-explicit', title: 'grid: explicit column sizes'},
                {'id': 'grid-offset', title: 'grid: offset columns'},
                {'id': 'grid-vertically-align', title: 'grid: vertically align columns'},
                {'id': 'grid-responsive', title: 'responsive grid'},
                {'id': 'utility', title: 'utility'},
                {'id': 'colors', title: 'colors'},
                {'id': 'icons', title: 'icons'},
                {'id': 'padding', title: 'padding'}
            ],
            'js': [
                {id: 'js-action-sheet', title: 'action sheet'},
                {id: 'js-backdrop', title: 'backdrop'},
                {id: 'js-ion-content', title: 'content'},
                {id: 'js-ion-refresher', title: 'refresher'},
                {id: 'js-ion-pane', title: 'pane'},
                {id: 'js-gestures-events', title: 'gestures and events'},
                {id: 'js-gesture', title: 'ionic gesture'},
                {id: 'js-header', title: 'ionic header bar'},
                {id: 'js-footer', title: 'ionic footer bar'},
                {id: 'js-keyboard', title: 'ionic keyboard'},
                {id: 'js-list', title: 'ionic list'},
                {id: 'js-list-item', title: 'ionic list item'},
                {id: 'js-delete-button', title: 'delete button'},
                {id: 'js-reorder-button', title: 'reorder button'},
                {id: 'js-option-button', title: 'option button'},
                {id: 'js-collection-repeat', title: 'collection repeat'},
                {id: 'js-list-delegate', title: '$ioniclistdelegate'},
                {id: 'js-loading', title: '$ionicloading'},
                {id: 'js-modal', title: '$ionicmodal'},
                {id: 'js-nav-view', title: 'navigation view'},
                {id: 'js-view', title: 'view'},
                {id: 'js-nav-bar', title: 'navigation bar'},
                {id: 'js-nav-back-button', title: 'navigation back button'},
                {id: 'js-nav-buttons', title: 'navigation button'},
                {id: 'js-nav-title', title: 'navigation title'},
                {id: 'js-nav-transition', title: 'navigation transition'},
                {id: 'js-bar-delegate', title: '$ionicnavbardelegate'},
                {id: 'js-history', title: '$ionichistory'},
                {id: 'js-popover', title: '$ionicpopover'},
                {id: 'js-popup', title: '$ionicpopup'},
                {id: 'js-scroll', title: 'scroll'},
                {id: 'js-infinite-scroll', title: 'infinite scroll'},
                {id: 'js-scroll-delegate', title: '$ionicscrolldelegate'},
                {id: 'js-side-menus', title: 'side menus'},
                {id: 'js-side-menus-content', title: 'side menus content'},
                {id: 'js-side-menu', title: 'side menu'},
                {id: 'js-expose-aside-when', title: 'expose aside when'},
                {id: 'js-menu-toggle', title: 'menu toggle/close'},
                {id: 'js-side-menu-delegate', title: '$ionicsidemenudelegate'},
                {id: 'js-slides', title: 'ionic slides'},
                {id: 'js-slide-box', title: 'slide box'},
                {id: 'js-slide-box-delegate', title: '$ionicslideboxdelegate'},
                {id: 'js-spinner', title: 'spinner'},
                {id: 'js-tabs', title: 'tabs'},
                {id: 'js-tab', title: 'tab'},
                {id: 'js-tabs-delegate', title: '$ionictabsdelegate'},
                {id: 'js-tab-click', title: 'tab click'},
                {id: 'js-config-provider', title: '$ionicconfigprovider'},
                {id: 'js-ionic-platform', title: 'ionic platform'},
                {id: 'js-dom-util', title: 'domutil'},
                {id: 'js-event-controller', title: 'eventcontroller'},
                {id: 'js-position', title: '$ionicposition'},
            ]
        };

        return {
            getApiMenu: getApiMenuFun
        };

        /**
         * 根据类型获取api目录数据
         */
        function getApiMenuFun(type) {
            var _type = type || 'css';
            return _menuData[_type];
        }
    }
})();