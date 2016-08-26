/**
 * Created by Shicx on 2016/8/24.
 */
var _videoUrl='';
(function () {
    'use strict';
    appModule
        .config(Router)
        .controller('videoPlayerController', VideoPlayerController)
    ;

    /**
     * 路由设置
     */
    function Router($stateProvider) {
        $stateProvider.state('videoPlayer', {//状态名称
            url: '/video_player',//状态url
            controller: 'videoPlayerController',
            templateUrl: 'modules/video/video-player.html'
        })
        ;
    }

    /**
     * 控制器
     */
    function VideoPlayerController($scope,tipMsg) {
        $scope.videoList = [];

        $scope.getVideoList =function(){
            console.log('play');
            VideoPlayer.init(function (data) {
                    console.log(data);
                    $scope.videoList =data;
                },
                function (err) {
                    console.log(err);
                }
            );
        };

        $scope.playVideo = function (index) {
            VideoPlayer.play(index,
                function (data) {
                    console.log(data);
                },
                function (err) {
                    console.log(err);
                }
            );
        }
    }
})();

// Listen for requests to use it.
window.addEventListener("message", function(event) {
    console.log(event);
    var url = "http://192.168.1.179:28080";
    console.log(event.origin == url);
    if (event.origin == url) {
        if (event.data == "videoPlayer") {
            VideoPlayer.play(4,
                function () {
                    console.log("video completed");
                },
                function (err) {
                    console.log(err);
                }
            );
        }
    }
}, false);
