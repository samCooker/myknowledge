/**
 * Created by cookie on 2016/6/28.
 */
(function () {
    appModule
        .config(chatRouter)
        .controller('chatController', ChatController)
    ;

    function chatRouter($stateProvider) {
        $stateProvider
            .state('chat', {
                url: '/chat',
                controller: 'chatController',
                templateUrl: 'modules/chat/chat2.html'
            })
        ;
    }

    function ChatController($scope,$ionicScrollDelegate) {
        $scope.chatList = [];
        $scope.chat = {msg:''};

        $scope.sendMsg = function () {
            if ($scope.chat.msg) {
                $scope.chatList.push({
                    name: 'me',
                    msg: $scope.chat.msg,
                    time: new Date()
                });
                $ionicScrollDelegate.scrollBottom(true);
            }
        }
    }
})();