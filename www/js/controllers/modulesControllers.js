/**
 * Created by Cookie on 2016/3/27.
 */
(function () {
    appModule.controller('worklogController',WorklogController)
    ;

    /**
     * 工作日志填写编辑控制器
     * */
    function WorklogController($scope,$ionicModal,$filter,commonHttp,tipMsg,tools) {
        $scope.loginData={account:'Shicx',password:'sam159'};
        $scope.newWorkLog=newWorkLogFun;//选择一个日期新增日志
        $scope.openAddModel=openAddModelFun;//弹出新增日志对话框
        $scope.worklogLoginModel=worklogLoginModelFun;//弹出登陆对话框
        $scope.worklogLogin=worklogLoginFun;//登陆日志系统
        $scope.worklogLogout=worklogLogoutFun;//登出日志系统
        $scope.submitWorkLog=submitWorkLogFun;//提交日志
        $scope.isLoadEnd=false;//是否已经加载完成
        $scope.doRefresh=doRefreshFun;//刷新
        $scope.loadMore=loadMoreFun;//加载更多
        $scope.editItem=editItemFun;//编辑
        $scope.deleteItem=deleteItemFun;//删除
        $scope.worklogList=[];
        $scope.searchData={};
        $scope.submitData={useHours:4,workType:1,prjNo:'5C934',prjName:'广西食药局移动执法办公终端管理系统（二期）建设',evaSelf:1,ajax:1};
        var dayTransfer={0:6,1:0,2:1,3:2,4:3,5:4,6:5};
        //显示评价详情
        $scope.evaSelfArr={1:'一般',2:'满意',3:'非常满意',4:'不满意'};
        $scope.evaSelfName=$scope.evaSelfArr[$scope.submitData.evaSelf];

        //下拉刷新
        function doRefreshFun(){
            if(!$scope.searchData.day){
                var currentDate=new Date();
                var year = currentDate.getFullYear();
                var month = currentDate.getMonth()+1;
                var day = currentDate.getDate()-dayTransfer[currentDate.getDay()];
                $scope.searchData.day=year+'-'+month+'-'+day
            }
            commonHttp.workLogPost('workdaily/myDaily.do',$scope.searchData).then(function (data) {
                $scope.worklogList=resolveHtmlData(data);
            }).catch(function (error) {
                console.log(error);
                tipMsg.showMsg('获取数据异常。');
            });
            $scope.$broadcast('scroll.refreshComplete');//广播下拉完成事件，否则图标不消失
            $scope.isLoadEnd=false;
        }

        //上拉加载
        function loadMoreFun(){
            $scope.$broadcast('scroll.infiniteScrollComplete');//广播上拉完成事件，否则图标不消失
        }

        //解析工作日志的html数据
        function resolveHtmlData(htmlData) {
            var itemList=[];
            var htmlArr=htmlData.split('openMyDailyEdit(\'');
            angular.forEach(htmlArr, function (item) {
                  if(/^\d{4}-\d{2}-\d{2}/.test(item)&&/【\d.\d】/.test(item)){
                      var _date=item.substring(0,item.indexOf('\')">'));
                      var _arr=item.split(/【/);
                      for(var i=1;i<_arr.length;i++){
                          var _workLog={date:_date,index:i-1};
                          _workLog.item='【'+_arr[i].substring(0,_arr[i].indexOf('</div>'));
                          itemList.push(_workLog);
                      }
                  }
            });
            return itemList;
        }

        //解析新建工作日志时返回的html数据
        function resolveReturnData(htmlData) {
            var returnData={};
            var _hd_dailyId = 'name="dailyId"';
            var _hd_userId='name="userId"';
            var _value = 'value="';
            var _arr = htmlData.split('<input');
            angular.forEach(_arr, function (value) {
               if(value.indexOf(_hd_dailyId)!=-1){
                   var _sp_dailyId =value.split(_value)[1];
                   returnData.dailyId = _sp_dailyId.substring(0, _sp_dailyId.indexOf('"'));
               }else if(value.indexOf(_hd_userId)!=-1){
                   var _sp_userId =value.split(_value)[1];
                   returnData.userId = _sp_userId.substring(0, _sp_userId.indexOf('"'));
               }
            });
            return returnData;
        }

        //新建日志
        function newWorkLogFun() {
            //日期选择
            tools.dataPicker({
                androidTheme: 2
            }).then(function (date) {
                $scope.submitData.workDate = $filter('date')(date, 'yyyy-MM-dd');
                commonHttp.workLogGet('workdaily/workDailyEdit.do?day=' + $scope.submitData.workDate).then(function (htmlData) {
                    var data=resolveReturnData(htmlData);
                    $scope.submitData.dailyId=data.dailyId;
                    $scope.submitData.userId=data.userId;
                    openAddModelFun();
                });
            }).catch(function (error) {
                if (error === false) {
                    var defDate= $filter('date')(new Date(), 'yyyy-MM-dd');
                    tipMsg.inputMsg($scope,defDate,'输入一个日期(yyyy-MM-dd)').then(function (data) {
                        if(/\d{4}-\d{2}-\d{2}/.test(data)){
                            $scope.submitData.workDate =data;
                            commonHttp.workLogGet('workdaily/workDailyEdit.do?day='+data).then(function (htmlData) {
                                resolveReturnData(htmlData);
                                openAddModelFun();
                            });
                        }else{
                            tipMsg.showMsg('请输入指定格式的日期');
                        }
                    });
                }
            });
        }

        //提交日志
        function submitWorkLogFun() {
            commonHttp.workLogPost('workdaily/workDailyEdit.do',$scope.submitData).then(function (data) {
                $scope.worklogAddModal.hide();
                doRefreshFun();
            }).catch(function (error) {
                console.log(error);
            });
        }

        //日志系统登陆
        function worklogLoginFun() {
            commonHttp.workLogPost('common/login.action',$scope.loginData).then(function (data) {
                console.log(data);
                if(data.indexOf('../workdaily/myDaily.do')){
                    $scope.worklogLoginModal.hide();
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

        // 创建一个弹出窗模板
        $ionicModal.fromTemplateUrl('templates/common/models/worklog-add.html', {
            scope: $scope, //继承自父scope
            animation: 'slide-in-up' //弹出动画
        }).then(function(modal) {
            $scope.worklogAddModal = modal;
        });

        // 打开弹出窗
        function openAddModelFun() {
            $scope.worklogAddModal.show();
        }

        //编辑日志
        function editItemFun(item) {
            commonHttp.workLogGet('workdaily/workDailyEdit.do?day='+item.date).then(function (htmlData) {
                //匹配 editDetail('')的字符串
                var _idStr=htmlData.match(/editDetail\('\d+'\)/g);
                var ids=[];
                for(var i=0;i<_idStr.length;i++){
                    ids.push(_idStr[i].substring(_idStr[i].indexOf("'")+ 1,_idStr[i].lastIndexOf("\'")));
                }
                commonHttp.workLogGet('workdaily/workDailyDetailEdit.do?id='+ids[item.index]).then(function (data) {
                    var baseData=resolveReturnData(htmlData);
                    $scope.submitData=data;
                    $scope.submitData.dailyId=baseData.dailyId;
                    $scope.submitData.userId=baseData.userId;
                    $scope.submitData.workDate=item.date;
                    $scope.worklogAddModal.show();
                })
            })
        }

        //删除日志
        function deleteItemFun() {

        }

    }
})();