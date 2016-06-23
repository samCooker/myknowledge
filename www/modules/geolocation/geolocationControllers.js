/**
 * Created by Cookie on 2016/5/18.
 */
(function () {
    appModule
        .config(geolocationRouter)
        .controller('geolocationController', GeolocationController)
    ;

    function geolocationRouter($stateProvider) {
        $stateProvider
            .state('geolocation', {
                url: '/geolocation',
                controller: 'geolocationController',
                templateUrl: 'modules/geolocation/geolocation.html'
            })
    }

    /**
     * 地图定位
     */
    function GeolocationController($scope, $ionicActionSheet, tipMsg, coordtransform, $http, $interval) {
        //目的地信息
        $scope.destination = {lat: '22.812535', lng: '108.344435', name: '目的地'};
        //当前位置信息
        $scope.position = {coords: {}, coords2: {}, name: '出发地'};
        //地图种类
        $scope.mapType = '百度';

        /**
         * 定位当前位置
         */
        $scope.getCurrentPosition = function () {
            if (navigator && navigator.geolocation) {
                tipMsg.loading().show();
                //var options = {timeout: 5000, enableHighAccuracy: true };
                var options = {
                    enableHighAccuracy: true,  // 是否使用 GPS
                    maximumAge: 10000,         // 缓存时间
                    timeout: 27000,            // 超时时间
                    coorType: 'gcj02'         // 默认是 gcj02，可填 bd09ll 以获取百度经纬度用于访问百度 API
                };
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.$apply(function () {
                        $scope.position = position;
                        $scope.transform.data = position.coords.longitude + ',' + position.coords.latitude;
                    });
                    tipMsg.loading().hide();
                }, function (error) {
                    tipMsg.alertMsg(error);
                    tipMsg.loading().hide();
                }, options);
            } else {
                tipMsg.showMsg('无定位插件');
            }
        };

        $scope.getCurrentPositionBd09 = function () {
            if (navigator && navigator.geolocation) {
                tipMsg.loading().show();
                var options = {
                    enableHighAccuracy: false,  // 是否使用 GPS
                    maximumAge: 30000,         // 缓存时间
                    timeout: 27000,            // 超时时间
                    coorType: 'bd09ll'         // 默认是 gcj02，可填 bd09ll 以获取百度经纬度用于访问百度 API
                };
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.$apply(function () {
                        $scope.position.coords2 = position.coords;
                        $scope.transform.data = position.coords.longitude + ',' + position.coords.latitude;
                    });
                    tipMsg.loading().hide();
                }, function (error) {
                    tipMsg.alertMsg(error);
                    tipMsg.loading().hide();
                }, options);
            } else {
                tipMsg.showMsg('无定位插件');
            }
        };
        $scope.getCurrentPositionWgs84 = function () {
            if (navigator && navigator.geolocation) {
                tipMsg.loading().show();
                var options = {timeout: 5000, enableHighAccuracy: true};
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.$apply(function () {
                        $scope.position.coords3 = position.coords;
                        $scope.transform.data = position.coords.longitude + ',' + position.coords.latitude;
                    });
                    tipMsg.loading().hide();
                }, function (error) {
                    tipMsg.alertMsg(error);
                    tipMsg.loading().hide();
                }, options);
            } else {
                tipMsg.showMsg('无定位插件');
            }
        };

        /**
         * 导航
         */
        $scope.navigation = function () {
            //导航设置
            var options = {
                originLat: $scope.position.coords.latitude || '',
                originLng: $scope.position.coords.longitude || '',
                originName: $scope.position.name || '',
                destLat: $scope.destination.lat || '',
                destLng: $scope.destination.lng || '',
                destName: $scope.destination.name || '',
                model: $scope.destination.model || ''
            };
            if ($scope.mapType == '百度') {
                _start.navigationBaiduMap(options, function (msg) {
                    tipMsg.alertMsg(msg);
                }, function (error) {
                    tipMsg.alertMsg(error);
                });
            } else if ($scope.mapType == '高德') {
                _start.navigationMiniMap(options, function (msg) {
                    tipMsg.alertMsg(msg);
                }, function (error) {
                    tipMsg.alertMsg(error);
                });
            } else {
                _start.navigation(options, function (msg) {
                    tipMsg.alertMsg(msg);
                }, function (error) {
                    tipMsg.alertMsg(error);
                });
            }
        };

        //选择地图种类
        $scope.selectMapType = function () {
            $ionicActionSheet.show({
                buttons: [
                    {text: '<b class="text-center">百度</b>'},
                    {text: '<b class="text-center">高德</b>'}
                ],
                titleText: '<div class="text-center">选择地图类型</div>',
                buttonClicked: function (index) {
                    switch (index) {
                        case 0:
                            $scope.mapType = '百度';
                            break;
                        case 1:
                            $scope.mapType = '高德';
                            break;
                        default :
                            console.log(index);
                    }
                    return true;
                }
            });
        };

        //地图标记
        $scope.mapMaker = function () {
            var options = {
                lat: $scope.position.coords.latitude,
                lng: $scope.position.coords.longitude,
                title: $scope.position.name || '目的地',
                src: "com.ionicframework.myknowledge769957",
                content: "目的地"
            };
            if ($scope.mapType == '百度') {
                options.lng = $scope.position.coords2.longitude;
                options.lat = $scope.position.coords2.latitude;
                _start.mapMarkerBaidu(options, function (msg) {
                    tipMsg.alertMsg(msg);
                }, function (error) {
                    tipMsg.alertMsg(error);
                });
            } else if ($scope.mapType == '高德') {
                _start.mapMarkerMini(options, function (msg) {
                    tipMsg.alertMsg(msg);
                }, function (error) {
                    tipMsg.alertMsg(error);
                });
            }
        };

        $scope.transform = {};
        $scope.gcj02Tobd09 = function () {
            var _c = $scope.transform.data.split(',');
            console.log(_c);
            var _transform = coordtransform.gcj02tobd09(_c[0], _c[1]);
            $scope.transform.data2 = _transform[0] + ',' + _transform[1];
        };

        $scope.onlineTransform = {};
        $scope.onlineGcj02Tobd09 = function () {
            var url = 'http://api.map.baidu.com/geoconv/v1/?coords=' + $scope.onlineTransform.Data + '&from=3&to=5&ak=plL3Xh50oMutiHw2nG7XNm4TGRvVI7rF';
            console.log(url);
            $http.get(url).then(function (back) {
                console.log(back);
                var data = back.data;
                if (data.result && data.result.length > 0) {
                    $scope.onlineTransform.Data2 = data.result[0].x + ',' + data.result[0].y;
                }
            });
        };

        $scope.bd09Togcj02 = function () {
            var _c = $scope.transform.data.split(',');
            console.log(_c);
            var _transform = coordtransform.bd09togcj02(_c[0], _c[1]);
            $scope.transform.data2 = _transform[0] + ',' + _transform[1];
        };
        $scope.wgs84Togcj02 = function () {
            var _c = $scope.transform.data.split(',');
            console.log(_c);
            var _transform = coordtransform.wgs84togcj02(parseInt(_c[0], 10), parseInt(_c[1], 10));
            $scope.transform.data2 = _transform[0] + ',' + _transform[1];
        };

    }

})();
