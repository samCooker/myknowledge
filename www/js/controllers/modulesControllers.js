/**
 * Created by Cookie on 2016/3/27.
 */
(function () {
    appModule.controller('worklogController',WorklogController)
    ;

    function WorklogController($scope,$ionicScrollDelegate,commonHttp,tipMsg) {
        $scope.newWorkLog=newWorkLogFun;
        $scope.worklogLoginModel=worklogLoginModelFun;
        $scope.worklogLogin=worklogLoginFun;
        $scope.worklogLogout=worklogLogoutFun;
        $scope.isLoadEnd=false;//是否已经加载完成
        $scope.showToTop=false;
        $scope.doRefresh=doRefreshFun;
        $scope.loadMore=loadMoreFun;
        $scope.scrollComplete=scrollCompleteFun;//滑动列表完成事件
        $scope.scrollToTop=scrollToTopFun;//返回至顶部
        $scope.worklogList=[];


        //下拉刷新
        function doRefreshFun(){
            $scope.$broadcast('scroll.refreshComplete');//广播下拉完成事件，否则图标不消失
            $scope.isLoadEnd=false;
        }

        //上拉加载
        function loadMoreFun(){
            $scope.$broadcast('scroll.infiniteScrollComplete');//广播上拉完成事件，否则图标不消失
        }

        //滑动列表完成事件
        function scrollCompleteFun(){
            var toTop=$ionicScrollDelegate.$getByHandle('fordoScroll').getScrollPosition().top;
            if(toTop>200){
                $scope.$apply(function(){
                    $scope.showToTop=true;
                });
            }else{
                $scope.$apply(function(){
                    $scope.showToTop=false;
                });
            }
        }

        //返回至顶部
        function scrollToTopFun(){
            if($scope.showToTop){
                $ionicScrollDelegate.scrollTop(true);
            }
        }

        //新建日志
        function newWorkLogFun() {

        }

        //提交日志
        function submitWorkLogFun() {
            commonHttp.workLogPost('workdaily/workDailyEdit.do',{dailyId:6732,userId:29,workDate:'2016-03-27',id:null,workType:"1",prjNo:"5C934",prjName:"广西食药局移动执法办公终端管理系统（二期）建设",content:"在移动办公系统中，修改用户登录验证bug。",useHours:4,evaSelf:"1",ajax:1}).then(function (data) {
                console.log(data);
            }).catch(function (error) {
                console.log(error);
            });
        }

        //日志系统登陆
        function worklogLoginFun() {
            commonHttp.workLogPost('common/login.action',$scope.loginData).then(function (data) {
                if(data===true){

                }
            }).catch(function (error) {
                tipMsg.alertMsg(error);
            });
        }

        //日志系统登出
        function worklogLogoutFun() {

        }

        //登陆对话框
        function worklogLoginModelFun() {
            // 创建一个弹出窗模板
            $ionicModal.fromTemplateUrl('templates/common/models/worklog-login.html', {
                scope: $scope, //继承自父scope
                animation: 'slide-in-up' //弹出动画
            }).then(function(modal) {
                $scope.worklogLoginModal = modal;
                modal.show();
            });
        }

    }
})();