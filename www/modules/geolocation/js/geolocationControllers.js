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
  function GeolocationController($scope, tipMsg) {

    $scope.location = {};
    $scope.origin={};
    $scope.destination={};
    $scope.position={};
    $scope.pushFlag=true;

    $scope.getCurrentPosition = function () {
      if (navigator && navigator.geolocation) {
        var options = {timeout: 5000, enableHighAccuracy: true };
          navigator.geolocation.getCurrentPosition(function(position) {
          $scope.position=position;
        }, function (error) {
          $scope.errorInfo=error;
          tipMsg.alertMsg(error);
        }, options);

      } else {
        tipMsg.showMsg('无定位插件');
      }
    };

    $scope.navigation = function () {
      //tipMsg.alertMsg($scope.position.coords.latitude+"|"+$scope.position.coords.longitude);
      MapNavigation.navigation({
        originLat:$scope.position.coords.latitude||'',
        originLng:$scope.position.coords.longitude||'',
        originName:$scope.position.name||'',
        destLat:$scope.destination.lat||'',
        destLng:$scope.destination.lng||'',
        destName:$scope.destination.name||''
      }, function (msg) {
        tipMsg.alertMsg(msg);
      }, function (error) {
        tipMsg.alertMsg(error);
      });
    };

    function getCurrentPositionFun() {

    }
  }

})();
