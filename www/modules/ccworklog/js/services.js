/**
 * Created by Cookie on 2016/5/7.
 */
(function () {
  appModule
    .factory('ccworklogDbTool', ccworklogDbToolFun) //本地存储
    .factory('ccworklogHttp',ccworklogHttp)
  ;

  function ccworklogDbToolFun(tipMsg,dbTool) {
    var Fac = {
      getFavoriteWords: getFavoriteWordsFun,
      getWorklogUser: getWorklogUserFun,
      putWorklogUser: putWorklogUserFun,
      putWorklogSetting: putWorklogSettingFun,
      getWorklogSetting: getWorklogSettingFun,
      putWorklogData: putWorklogDataFun,
      getWorklogData: getWorklogDataFun
    };

    var _worklogUserId = 'worklogUserId';
    var _worklogSettingId = 'worklogSettingId';
    var _curUser = {};
    var _worklogId = 'worklogId';

    /**
     * 保存最近一次的工作日志信息数据，_id指定
     * @param data 数据对象
     * @returns {*}
     */
    function putWorklogDataFun(data) {
      dbTool.findDataById(_worklogId).then(function (result) {
        if(result._id){
          result.useHours=data.useHours;
          result.workType=data.workType;
          result.prjNo=data.prjNo;
          result.prjName=data.prjName;
          result.content=data.content;
          result.evaSelf=data.evaSelf;
          dbTool.getDb().put(result);
        }else{
          data._id = _worklogId; //指定id
          dbTool.getDb().put(data);
        }
      }).catch(function (error) {
        tipMsg.showMsg(error);
      });
    }

    /**
     * 获取保存在本地的工作日志信息数据
     * @returns {*}
     */
    function getWorklogDataFun() {
      return dbTool.findDataById(_worklogId,['_id','useHours', 'workType', 'prjNo', 'prjName','content','evaSelf']);
    }

    /**
     * 获取工作日志登陆用户信息
     */
    function getWorklogUserFun() {
      if(_curUser.account){
        var delay = $q.defer();
        delay.resolve(_curUser);
        return delay.promise;
      }
      return dbTool.findDataById(_worklogUserId,['_id','account','password','pushFlag']).then(function (data) {
        _curUser=data;
        return data;
      });
    }

    /**
     * 保存工作日志登陆用户信息
     */
    function putWorklogUserFun(data) {
      dbTool.findDataById(_worklogUserId).then(function (result) {
        if(result._id){
          angular.extend(result,data);
          dbTool.getDb().put(result);
          _curUser = data;//将当前用户保存到公用的对象中，方便程序在其他地方调用
        }else{
          data._id = _worklogUserId; //指定id
          dbTool.getDb().put(data);
        }
      }).catch(function (error) {
        tipMsg.showMsg(error);
        _curUser = {};
      });
    }

    /**
     * 保存工作日志常用设置
     */
    function putWorklogSettingFun(data) {
      return dbTool.findDataById(_worklogSettingId).then(function (result) {
        if(result._id){
          angular.extend(result,data);
          dbTool.getDb().put(result);
        }else{
          data._id = _worklogSettingId; //指定id
          dbTool.getDb().put(data);
        }
        return true;
      }).catch(function (error) {
        tipMsg.showMsg(error);
      });
    }

    /**
     * 获取工作日志常用设置
     */
    function getWorklogSettingFun() {
      return dbTool.findDataById(_worklogSettingId,['_id','projectsData','favoriteWords']);
    }

    /**
     * 获取常用词条
     */
    function getFavoriteWordsFun() {
      return dbTool.findDataById(_worklogSettingId,['_id','favoriteWords']);
    }

    return Fac;
  }

  function ccworklogHttp($q,$http,$httpParamSerializer,tools){

    var _data={};//可在多个controller中传递的数据对象
    
    return {
      workLogPost:workLogPostFun,
      workLogGet:workLogGetFun,
      getSubmitData:getSubmitDataFun,//获取数据，在多个controller中传递
      setSubmitData:setSubmitDataFun//设置数据
    };

    /**
     * 工作日志系统登录 post
     */
    function workLogPostFun(url,postData) {
      var delay = $q.defer();
      var req = {
        method: 'POST',
        url: 'http://116.10.203.202:7070/ccoa/'+url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        cache:false,
        data: $httpParamSerializer(postData)
      };
      var _conn = tools.checkConnection();
      if(_conn.isConn) {//检测网络连接
        $http(req).success(function (data) {
          if (typeof(data) == 'string' && data.indexOf('重定向到登录页') != -1) {
            delay.reject('你没有登录(～￣(OO)￣)ブ');
          } else {
            delay.resolve(data);
          }
        }).error(function (error) {
          console.log(error);
          delay.reject(error);
        });
      }else{
        console.log(_conn.type);
        delay.reject(_conn.type);
      }
      return delay.promise;
    }

    /**
     * 工作日志系统登录 get
     */
    function workLogGetFun(url) {
      var _time=new Date().getTime();
      if(url.indexOf('?')!=-1){
        url=url+'&_='+_time;
      }else{
        url=url+'?_='+_time;
      }
      var delay = $q.defer();
      var req = {
        method: 'GET',
        url: 'http://116.10.203.202:7070/ccoa/'+url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        cache:false
      };
      var _conn = tools.checkConnection();
      if(_conn.isConn) {//检测网络连接
        $http(req).success(function (data) {
          if (typeof(data) == 'string' && data.indexOf('重定向到登录页') != -1) {
            delay.reject('你没有登录(～￣(OO)￣)ブ');
          } else {
            delay.resolve(data);
          }
        }).error(function (error) {
          console.log(error);
          delay.reject(error);
        });
      }else{
        delay.reject(_conn.type);
      }
      return delay.promise;
    }

    /**
     * 获取数据，在多个controller中传递
     */
    function getSubmitDataFun() {
      return _data;
    }

    function setSubmitDataFun(data) {
      _data=data;
    }
  }
})();
