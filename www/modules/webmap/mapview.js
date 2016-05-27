/**
 * Created by cookie on 2016/5/26.
 */

(function () {
    'use strict';
    appModule.controller('mapviewController', MapviewController)
    ;

    function MapviewController($scope,$timeout) {

        var AMapArea = document.getElementById('amap');

        AMapArea.parentNode.style.height = "100%";

        $scope.AMapId = 'container';

        $scope.mapObj;//存放初始化的地图对象

        $scope.initAMap = function () {

            var position = new AMap.LngLat(108.328491,22.807999);

            $scope.mapObj = new AMap.Map($scope.AMapId, {

                view: new AMap.View2D({

                    center: position,

                    zoom: 18,

                    rotation: 0

                }),

                lang: 'zh_cn'

            });

            var marker = new AMap.Marker({
                map: $scope.mapObj,
                position: [108.328491,22.807999],
                icon: "http://webapi.amap.com/images/0.png",
                offset: new AMap.Pixel(-10, -34)

            });

            $scope.markerMap();

        };

        $scope.addCircle = function () {

//初始化待编辑的圆实例

            var circle = new AMap.Circle({

                map: $scope.mapObj,

                center: new AMap.LngLat("108.387081", "22.787308"),

                radius: 1000,

                strokeColor: '#F33',

                strokeOpacity: 1,

                strokeWeight: 3,

                fillColor: '#ee2200',

                fillOpacity: 0.35

            });

//加载圆编辑插件

            var circleEditor;

            $scope.mapObj.plugin(["AMap.CircleEditor"], function () {

//实例化时指定地图对象

                circleEditor = new AMap.CircleEditor($scope.mapObj, circle);

            });

        };

        var i = 0;
        $scope.ListenClick = function () {

            AMap.event.addListener($scope.mapObj, 'click', function (e) {

                var lnglat = e.lnglat;
                console.log(lnglat);

                var marker = new AMap.Marker({

                    map: $scope.mapObj,

                    position: e.lnglat,

                    icon: "http://webapi.amap.com/images/0.png",

                    offset: new AMap.Pixel(-10, -34)


                });

                //var infoWindowContent = '<div class="infowindow-content">' +
                //    '<div class="amap-info-header">这是第'+(++i)+'个点</div>' +
                //    '<div class="amap-info-body">地址</div></div>';
                //$scope.mapObj.plugin('AMap.AdvancedInfoWindow', function () {
                //
                //    $scope.infoWindow = new AMap.AdvancedInfoWindow({
                //        panel: 'panel',
                //        placeSearch: true,
                //        asOrigin: true,
                //        asDestination: true,
                //        content: infoWindowContent
                //    });
                //
                //});

                var content = '<div class="infowindow-content">' +
                        '<div class="amap-info-header">这是第'+(++i)+'个点</div>' +
                        '<div class="amap-info-body" id="address_1">地址</div></div>';
                $scope.infoWindow = new AMap.InfoWindow({
                    content: content  //使用默认信息窗体框样式，显示信息内容
                });

                var address_1 = angular.element(document.querySelector('#address_1'));
                console.log(address_1);
                AMap.event.addDomListener(address_1,'click', function (e) {
                    console.log(e);
                });
                //给Marker绑定单击事件
                marker.on('click', $scope.markerClick);

                $scope.mapObj.setCenter(lnglat);
            });

        };

        $scope.markerClick = function (e) {
            console.log(e);
            //infoWindow.setContent(e.target.content);
        };


        $scope.markerList =[];
        $scope.markerMap = function () {
                var marker = new AMap.Marker({
                    map: $scope.mapObj,
                    position: [108.328759,22.808617],
                    icon: "http://webapi.amap.com/images/2.png",
                    offset: new AMap.Pixel(-10, -34)

                });
                //给Marker绑定单击事件
                marker.on('click', $scope.markerClick);
                $scope.markerList.push(marker);

                marker = new AMap.Marker({
                    map: $scope.mapObj,
                    position: [108.328319,22.808499],
                    icon: "http://webapi.amap.com/images/3.png",
                    offset: new AMap.Pixel(-10, -34)

                });
                //给Marker绑定单击事件
                marker.on('click', $scope.markerClick);
                $scope.markerList.push(marker);


                marker = new AMap.Marker({
                    map: $scope.mapObj,
                    position: [108.327627,22.808721],
                    icon: "http://webapi.amap.com/images/4.png",
                    offset: new AMap.Pixel(-10, -34)

                });
                //给Marker绑定单击事件
                marker.on('click', $scope.markerClick);
                $scope.markerList.push(marker);


                marker = new AMap.Marker({
                    map: $scope.mapObj,
                    position: [108.32841,22.807796],
                    icon: "http://webapi.amap.com/images/1.png",
                    offset: new AMap.Pixel(-10, -34)

                });
                //给Marker绑定单击事件
                marker.on('click', $scope.markerClick);
                $scope.markerList.push(marker);
        };
    }
}());