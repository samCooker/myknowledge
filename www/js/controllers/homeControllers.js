/**
 * Created by Cookie on 2016/3/24.
 */
(function () {
    appModule
        .controller('homeController',HomeController)
        .controller('welcomeController',WelcomeController)
        .controller('userManagementController',UserManagementController)
    ;

    /**
     * 首页父类控制器
     */
    function HomeController($scope,$state,commonHttp,tipMsg) {
        $scope.relogin = toLoginPage;
        $scope.logout = toLoginPage;

        //重新登陆和登出时，回到登陆页面
        function toLoginPage() {
            commonHttp.httpGet('logout.json').then(function () {
                $state.go('login');
            });
        }


    }

    /**
     * 欢迎页面控制器，继承自homeController
     */
    function WelcomeController($scope,$state,commonHttp,tipMsg) {
        $scope.addModules=addModulesFun;
        $scope.toWorkLog=toWorkLogFun;

        //添加新菜单模块
        function addModulesFun() {

        }

        //跳转至工作日志填写页面
        function toWorkLogFun() {
            $state.go('worklog.list');
        }
    }

    /**
     * 用户管理控制器，继承自homeController
     */
    function UserManagementController($scope,$ionicScrollDelegate) {
        $scope.search=searchFun;
        $scope.doRefresh=doRefreshFun;//下拉刷新
        $scope.loadMore=loadMoreFun;//上拉加载
        $scope.isLoadEnd=false;//是否已经加载完成
        $scope.showToTop=false;
        $scope.scrollComplete=scrollCompleteFun;//滑动列表完成事件
        $scope.scrollToTop=scrollToTopFun;//返回至顶部

        $scope.itemList=[];

        function searchFun(){

        }

        //下拉刷新
        function doRefreshFun(){
            $scope.itemList=[];
            $timeout(function(){
                for(var i=1;i<11;i++){
                    $scope.itemList.push({'title':'Item '+i});
                }
                $scope.$broadcast('scroll.refreshComplete');//广播下拉完成事件，否则图标不消失
                $scope.isLoadEnd=false;
            },2000);
        }

        //上拉加载
        function loadMoreFun(){
            var itemLen=$scope.itemList.length;
            $timeout(function(){
                for(i=1;i<11;i++){
                    $scope.itemList.push({'title':'Item '+(i+itemLen)});
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');//广播上拉完成事件，否则图标不消失
                if($scope.itemList.length >100){
                    $scope.isLoadEnd=true;//100条后不加载
                    tipMsg.showMsg("no more data.");
                }
            },2000);
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
    }
})();