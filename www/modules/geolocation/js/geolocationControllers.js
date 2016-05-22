/**
 * Created by Cookie on 2016/5/18.
 */
(function () {
  appModule
    .controller('geolocationController', GeolocationController)
  ;

  /**
   * 地图定位
   */
  function GeolocationController($scope,$ionicActionSheet,tipMsg) {
    //目的地信息
    $scope.destination={lat:'22.812535',lng:'108.344435',name:'目的地'};
    //当前位置信息
    $scope.position={coords:{},name:'出发地'};
    //地图种类
    $scope.mapType='百度';

    /**
     * 定位当前位置
     */
    $scope.getCurrentPosition = function () {
      if (navigator && navigator.geolocation) {
        tipMsg.loading().show();
        var options = {timeout: 5000, enableHighAccuracy: true };
          navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function () {
              $scope.position=position;
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
        originLat:$scope.position.coords.latitude||'',
        originLng:$scope.position.coords.longitude||'',
        originName:$scope.position.name||'',
        destLat:$scope.destination.lat||'',
        destLng:$scope.destination.lng||'',
        destName:$scope.destination.name||'',
        model:$scope.destination.model||''
      };
      if($scope.mapType=='百度'){
        MapNavigation.navigationBaiduMap(options, function (msg) {
          tipMsg.alertMsg(msg);
        }, function (error) {
          tipMsg.alertMsg(error);
        });
      }else if($scope.mapType=='高德'){
        MapNavigation.navigationMiniMap(options, function (msg) {
          tipMsg.alertMsg(msg);
        }, function (error) {
          tipMsg.alertMsg(error);
        });
      }else{
        MapNavigation.navigation(options, function (msg) {
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
              $scope.mapType='百度';
              break;
            case 1:
              $scope.mapType='高德';
              break;
            default :
              console.log(index);
          }
          return true;
        }
      });
    }

  }

})();
