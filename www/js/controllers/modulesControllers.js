/**
 * Created by Cookie on 2016/3/27.
 */
(function () {
    appModule.controller('worklogController',WorklogController)
    ;

    /**
     * 工作日志填写编辑控制器
     * */
    function WorklogController($scope,$ionicModal,$filter,$state,commonHttp,tipMsg,tools) {
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
        $scope.selectProject=selectProjectFun;
        $scope.worklogList=[];
        $scope.searchData={};
        $scope.submitData={};
        var dayTransfer={0:6,1:0,2:1,3:2,4:3,5:4,6:5};
        //显示评价详情
        $scope.evaSelfArr={1:'一般',2:'满意',3:'非常满意',4:'不满意'};
        var limitDate=new Date('2016-02-01');

        //弹出登陆对话框
        worklogLoginModelFun();

        //下拉刷新
        function doRefreshFun(){
            //获取当前周的星期一日期
            var currentDate=new Date();
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth()+1;
            var firstDayOfWeek = currentDate.getDate()-dayTransfer[currentDate.getDay()];
            $scope.searchData.day=year+'-'+month+'-'+firstDayOfWeek;
            commonHttp.workLogGet('workdaily/myDaily.do?day='+$scope.searchData.day).then(function (data) {
                $scope.worklogList=resolveHtmlData(data);
            }).catch(function (error) {
                console.log(error);
                tipMsg.showMsg('获取数据异常 !_!');
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');//广播下拉完成事件，否则图标不消失
                $scope.isLoadEnd=false;
            });
        }

        //上拉加载
        function loadMoreFun(){
            if(!$scope.searchData.day){
                return;
            }
            // 获取上周星期一日期
            var _lastDate=new Date($scope.searchData.day).getTime();
            console.log($scope.searchData.day);
            var _searchDay=new Date(_lastDate-7*24*60*60*1000);
            //最多只能查询limitDate之后的数据
            if(_searchDay<limitDate){
                tipMsg.showMsg('没有更多的数据了=_=||');
                $scope.isLoadEnd=true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
            $scope.searchData.day=_searchDay.getFullYear()+'-'+(_searchDay.getMonth()+1)+'-'+_searchDay.getDate();
            console.log($scope.searchData.day);
            commonHttp.workLogGet('workdaily/myDaily.do?day='+$scope.searchData.day).then(function (data) {
                var _list=resolveHtmlData(data);
                $scope.worklogList=$scope.worklogList.concat(_list);
            }).catch(function (error) {
                console.log(error);
                tipMsg.showMsg('获取数据异常。');
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');//广播上拉完成事件，否则图标不消失
            });
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
            $scope.submitData={};
            //日期选择
            tools.dataPicker({
                androidTheme: 2
            }).then(function (date) {
                $scope.submitData.workDate = $filter('date')(date, 'yyyy-MM-dd');
                commonHttp.workLogGet('workdaily/workDailyEdit.do?day=' + $scope.submitData.workDate).then(function (htmlData) {
                    initSubmitData(resolveReturnData(htmlData));
                    openAddModelFun();
                });
            }).catch(function (error) {
                if (error === false) {
                    var defDate= $filter('date')(new Date(), 'yyyy-MM-dd');
                    tipMsg.inputMsg($scope,defDate,'输入一个日期(yyyy-MM-dd)').then(function (workDate) {
                        if(/\d{4}-\d{2}-\d{2}/.test(workDate)){
                            commonHttp.workLogGet('workdaily/workDailyEdit.do?day='+workDate).then(function (htmlData) {
                                initSubmitData(resolveReturnData(htmlData));
                                $scope.submitData.workDate =workDate;
                                openAddModelFun();
                            });
                        }else if(workDate!==false){
                            tipMsg.showMsg('请输入指定格式的日期');
                        }
                    });
                }
            });
        }

        function initSubmitData(data) {
            $scope.submitData.useHours=4;
            $scope.submitData.workType=1;
            $scope.submitData.prjNo='5C934';
            $scope.submitData.prjName='广西食药局移动执法办公终端管理系统（二期）建设';
            $scope.submitData.evaSelf=1;
            $scope.submitData.ajax=1;
            $scope.evaSelfName=$scope.evaSelfArr[$scope.submitData.evaSelf];
            $scope.submitData.dailyId=data.dailyId;
            $scope.submitData.userId=data.userId;
        }

        //提交日志
        function submitWorkLogFun() {
            tipMsg.loading().show();//显示加载框
            if(!checkWorkLogBefore()){
                tipMsg.loading().hide();
                return;
            }
            commonHttp.workLogPost('workdaily/workDailyEdit.do',$scope.submitData).then(function (data) {
                if(data.message) {
                    tipMsg.showMsg(data.message);
                }
                $scope.worklogAddModal.hide();
                $scope.submitData={};
                doRefreshFun();
            }).catch(function (error) {
                console.log(error);
            }).finally(function () {
                tipMsg.loading().hide();//加载框
            });
        }
        // true : 可以提交  false不符合条件
        function checkWorkLogBefore() {
            if(!$scope.submitData.content||$scope.submitData.content.length<20){
                tipMsg.showMsg('内容需超过20个字符。');
                return false;
            }
            if(!$scope.submitData.userId){
                tipMsg.showMsg('用户没有登录');
                return false;
            }
            return true;
        }

        //日志系统登陆
        function worklogLoginFun() {
            tipMsg.loading().show();//显示加载框
            commonHttp.workLogPost('common/login.action',$scope.loginData).then(function (data) {
                if(data.indexOf('../workdaily/myDaily.do')){
                    $scope.worklogLoginModal.hide();
                    doRefreshFun();
                }
            }).catch(function (error) {
                tipMsg.alertMsg(error);
            }).finally(function () {
                tipMsg.loading().hide();//显示加载框
            });
        }

        //日志系统登出
        function worklogLogoutFun() {
            commonHttp.workLogGet('common/logout.do').then(function (data) {
                $scope.worklogList=[];
                $state.go('home.welcome');
            });
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
        $ionicModal.fromTemplateUrl('templates/common/models/worklog-projects.html', {
            scope: $scope, //继承自父scope
            animation: 'slide-in-up' //弹出动画
        }).then(function(modal) {
            $scope.worklogProjectsModal = modal;
        });

        // 打开弹出窗
        function openAddModelFun() {
            $scope.worklogAddModal.show();
        }

        // 打开选择项目对话框
        function selectProjectFun() {
            console.log('select');
            $scope.worklogAddModal.hide();
            $scope.worklogProjectsModal.show();
            $scope.doRefreshProjects();
        }

        //选择项目
        $scope.searchPrjsParams={pageNum:1,numPerPage:20};
        $scope.projectsData=[];
        //刷新项目列表
        $scope.doRefreshProjects = function () {
            $scope.projectsData=[];
            $scope.searchPrjsParams.pageNum=1;
            var _s ={pageNum:1,numPerPage:$scope.searchPrjsParams.numPerPage};
            commonHttp.workLogPost('project/projectSelect.do',_s).then(function (htmlData) {
                if(!htmlData){
                    tipMsg.showMsg('无数据');
                }else {
                    $scope.projectsData=resolveProjectsHtmlData(htmlData);
                }
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');//广播下拉完成事件，否则图标不消失
                $scope.isProjectsLoadEnd=false;
            });
        };
        //加载项目数据
        $scope.loadMoreProjects= function () {
            $scope.searchPrjsParams.pageNum++;
            commonHttp.workLogPost('project/projectSelect.do',$scope.searchPrjsParams).then(function (htmlData) {
                var _arr=resolveProjectsHtmlData(htmlData);
                if($scope.totalPrjs<=$scope.projectsData.length) {
                    //加载结束
                    $scope.isProjectsLoadEnd = true;
                }else{
                    $scope.projectsData=$scope.projectsData.concat(_arr);
                }
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');//广播下拉完成事件，否则图标不消失
            });
        };
        //选择项目完成
        $scope.chooseProject= function (project) {
            $scope.submitData.prjNo=project.id;
            $scope.submitData.prjName=project.name;
            $scope.cancelSelectPrj();
        };
        //隐藏项目选择框，显示填写框
        $scope.cancelSelectPrj= function () {
            $scope.worklogProjectsModal.hide();
            $scope.worklogAddModal.show();
        };

        //解析返回的项目数据
        function resolveProjectsHtmlData(htmlData) {
            var _prjList=[];
            if(!htmlData){
                tipMsg.showMsg('无数据');
                return;
            }
            var _id="{id:'";
            var _name="name:'";
            var _totalI='totalCount="';
            var _total = htmlData.match(/totalCount="\d+"/)[0];
            $scope.totalPrjs=_total.substring(_total.indexOf(_totalI)+_totalI.length,_total.lastIndexOf('"'));
            var _arr=htmlData.match(/jQuery\.bringBack.{10,50}\}\)/g);
            for(var i=0;i<_arr.length;i++){
                var _obj={};
                _obj.id=_arr[i].substring(_arr[i].indexOf(_id)+_id.length,_arr[i].indexOf("',"));
                _obj.name=_arr[i].substring(_arr[i].indexOf(_name)+_name.length,_arr[i].indexOf("'}"));
                _prjList.push(_obj);
            }
            return _prjList;
        }

        //编辑日志
        function editItemFun(item) {
            tipMsg.loading().show();//显示加载框
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
                    $scope.evaSelfName=$scope.evaSelfArr[$scope.submitData.evaSelf];
                    $scope.worklogAddModal.show();
                });
            }).finally(function () {
                tipMsg.loading().hide();
            });
        }

        //删除日志
        function deleteItemFun(item) {
            tools.confirm().then(function (res) {
                if(res){
                    doDeleteItem(item)
                }
            });
        }

        function doDeleteItem(item) {
            tipMsg.loading().show();//显示加载框
            commonHttp.workLogGet('workdaily/workDailyEdit.do?day='+item.date).then(function (htmlData) {
                //匹配 editDetail('')的字符串
                var _idStr=htmlData.match(/editDetail\('\d+'\)/g);
                var ids=[];
                for(var i=0;i<_idStr.length;i++){
                    ids.push(_idStr[i].substring(_idStr[i].indexOf("'")+ 1,_idStr[i].lastIndexOf("\'")));
                }
                commonHttp.workLogGet('workdaily/workDailyDetailDelete.do?id='+ids[item.index]).then(function (data) {
                    doRefreshFun();
                });
            }).finally(function () {
                tipMsg.loading().hide();
            });
        }


    }
})();