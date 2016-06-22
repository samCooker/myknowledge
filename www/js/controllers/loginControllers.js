/**
 * Created by Administrator on 2015/11/30.
 */

(function() {
    appModule
        .controller('loginController', loginControllerFun) // 登录控制器
        .factory('loginService', loginServiceFun);

    /**
     * 登录控制器
     */
    function loginControllerFun($scope, $state, $ionicModal, appConfig, tipMsg,tools, loginService) {
        $scope.loginData = {username:'',password:''}; //登录数据
        $scope.signData = {}; //注册数据
        $scope.signup = {}; //与注册相关的实体类
        $scope.login = loginFun; //登录
        $scope.toSignup = toSignupFun;

        //登录
        function loginFun() {
            tipMsg.loading().show();//显示加载框
            loginService.login($scope.loginData).then(function(result) {
                if (result) {
                    //根据角色跳转至不同页面
                    toDifferentPage(result);
                    $scope.hasError = false;
                } else {
                    tipMsg.showMsg('用户名或密码错误!');
                }
            }).catch(function(error) {
                tipMsg.showMsg(error);
                $scope.hasError = true;
            }).finally(function () {
                tipMsg.loading().hide();//隐藏加载框
            });
        }

        //根据角色跳转至不同页面
        function toDifferentPage(userData) {
            if(tools.isInArray(userData.roles,'admin')){
                appConfig.setMainMenu('admin.welcome');
                $state.go('admin.welcome');
            }else{
                appConfig.setMainMenu('home.welcome');
                $state.go('home.welcome');
            }
        }

        //弹出注册框
        function toSignupFun() {
            // 创建一个弹出窗模板
            $ionicModal.fromTemplateUrl('templates/common/models/sign-up.html', {
                scope: $scope, //继承自父scope
                animation: 'slide-in-up' //弹出动画
            }).then(function(modal) {
                $scope.signUpModal = modal;
                modal.show();
            });
        }

        $scope.closeSignup=function(){
            $scope.signUpModal.hide();
        };

        //注册
        $scope.submitSignup = function() {
            loginService.signup($scope.signData).then(function() {

            }).catch(function(error) {
                tipMsg.showMsg(error);
            });
        };


    }

    /**
     * 登录服务
     */
    function loginServiceFun($q, commonHttp, tipMsg, tools,appConfig) {
        return {
            login: loginFun,
            signup: signupFun
        };

        /**
         * 登录
         */
        function loginFun(data) {
            if (!data.username || !data.password) {
                var delay = $q.defer();
                delay.resolve({
                    account:'anonymous',
                    username:'anonymous'
                });
                return delay.promise;
                //if (!data.username) {
                //    delay.reject('无用户名');
                //    return delay.promise;
                //}
                //if (!data.password) {
                //    delay.reject('无密码');
                //    return delay.promise;
                //}
            } else {
                return commonHttp.jsonPost('login_check', data);
            }
        }

        /**
         * 注册
         */
        function signupFun(data) {
            var checkFlag = checkSignData(data);
            if (checkFlag === true) {
                return commonHttp.jsonPost('signup.json', data);
            } else {
                var delay = $q.defer();
                delay.reject(checkFlag);
                return delay.promise;
            }
        }

        //校验注册数据
        function checkSignData(signData) {
            if (!signData.username) {
                return '请输入用户名。';
            }
            if (signData.username.length < 3) {
                return '至少输入三个字符。';
            }
            if (!tools.checkEmail(signData.email)) {
                return '请输入正确的电子邮件。';
            }
            if (!signData.password || signData.password.length < 6) {
                return '至少输入六位密码。';
            }
            if (!signData.checkpwd || signData.password !== signData.checkpwd) {
                return '两次输入的密码不一致';
            }
            return true;
        }
    }

})();
