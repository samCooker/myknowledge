/**
 * Created by Shicx on 2016/7/1.
 */
(function () {
    appModule
        .config(fileOperationRouter)
        .controller('fileOperationController', FileOperationController)
    ;
    /**
     * 路由设置
     */
    function fileOperationRouter($stateProvider) {
        $stateProvider.state('fileOperation', {//状态名称
            url: '/fileOperation',//状态url
            controller: 'fileOperationController',
            templateUrl: 'modules/fileOperation/fileOperation.html'
        })
        ;
    }

    /**
     * 控制器
     */
    function FileOperationController($scope,tipMsg,$ionicPopup,$interval) {

        $scope.progressNum=0;
        $scope.progress='width:'+$scope.progressNum+'%';

        //文件选择
        $scope.fileChoose = function () {
            fileChooser.open(function (fileUri) {
                $scope.$apply(function () {
                    $scope.fileUri=fileUri;
                });
            }, function (error) {
                tipMsg.alertMsg(error);
            });
        };

        var progress = $ionicPopup.show({
            templateUrl: '/templates/common/models/progress.html',
            title: '上传进度',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancel',
                    onTap: function(e) {

                    }
                }
            ]
        });

        $interval(function () {
                $scope.progressNum++;
                $scope.progress='width:'+$scope.progressNum+'%';
        },500);

        //文件上传
        $scope.uploadFile = function () {
            console.log($scope.fileUri);
            if(!$scope.fileUri){
                return ;
            }
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = $scope.fileUri.substr($scope.fileUri.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            var params = {};
            params.value1 = "test";

            options.params = params;

            var ft = new FileTransfer();

            ft.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                } else {
                    loadingStatus.increment();
                }
            };

            ft.upload($scope.fileUri, encodeURI("http://192.168.1.179:38080/data_module/file/upload.action"), function (r) {
                $scope.message = "Code = " + r.responseCode+" Response = " + r.response+" Sent = " + r.bytesSent;
                console.log(r);
            }, function (error) {
                $scope.message ="upload error source " + error.source+" upload error target " + error.target;
                console.log(error);
            }, options);
        }


    }
})();