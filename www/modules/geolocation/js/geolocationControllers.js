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

    $scope.getCurrentPosition = function () {
      getCurrentPositionFun();
    };

    $scope.navigation = function () {
      Navigation.do(
        {
          lat: $scope.location.latitude,
          lon: $scope.location.longitude
        },
        function (message) {
          tipMsg.showMsg(message);
        }, function (message) {
          tipMsg.showMsg(message);
        });
    };

    function getCurrentPositionFun() {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

          $scope.location.latitude = position.coords.latitude;
          $scope.location.longitude = position.coords.longitude;

          $scope.position = 'Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n';
        }, function (error) {
          console.log(error);
          $scope.errorInfo = error;
        });
      } else {
        tipMsg.showMsg('无定位插件');
      }
    }
  }

})();
