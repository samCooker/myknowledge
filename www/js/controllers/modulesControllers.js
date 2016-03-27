/**
 * Created by Cookie on 2016/3/27.
 */
(function () {
    appModule.controller('worklogController',WorklogController)
    ;

    function WorklogController($scope,commonHttp,tipMsg) {
        $scope.newWorkLog=submitWorkLogFun;

        function submitWorkLogFun() {
            commonHttp.workLogPost('workdaily/workDailyEdit.do',{dailyId:6732,userId:29,workDate:'2016-03-27',id:null,workType:"1",prjNo:"5C934",prjName:"广西食药局移动执法办公终端管理系统（二期）建设",content:"在移动办公系统中，修改用户登录验证bug。",useHours:4,evaSelf:"1",ajax:1}).then(function (data) {
                console.log(data);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
})();