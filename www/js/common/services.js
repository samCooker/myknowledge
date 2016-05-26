/**
 * Created by Administrator on 2015/11/30.
 */

(function() {
    appModule
        .factory('tipMsg', TipMsgFun) //信息提示
        .factory('tools', ToolsFun) //各工具方法
        .factory('dbTool', DbToolFun) //本地存储
        .factory('commonHttp',CommonHttpFun)
        .factory('coordtransform',CoordtransformFun)//地图坐标转换
    ;

    /**
     * 各种消息提示框
     * @param $ionicPopup
     * @returns {*}
     * @constructor
     */
    function TipMsgFun($ionicPopup,$ionicLoading) {
        Fac = {
            showMsg: showMsgFun, //Toast提示框
            alertMsg: alertMsgFun, //带确定按钮的提示框
            inputMsg: inputMsgFun, //自定义的可输入信息的对话框
            confirm: confirmFun, //确定对话框
            loading:loadingFun //加载蒙层
        };

        /**
         * Toast提示框
         * @param msg 显示的信息
         * @param duration 持续时间('short','long')默认short
         * @param position 显示位置('top', 'center', 'bottom'),默认center
         */
        function showMsgFun(msg, duration, position) {
            var _duration = duration || 'short';
            var _position = position || 'center';
            if (window.plugins && window.plugins.toast) {
                //有toast插件
                window.plugins.toast.show(msg, _duration, _position);
            } else {
                //无toast插件显示提示框
                alertMsgFun(msg);
            }
        }

        /**
         * 带确定按钮的提示框 title:提示框标题 btnText:按钮的文字
         * @param msg
         * @param title
         * @param btnText
         */
        function alertMsgFun(msg, title, btnText) {
            var alertPopup = $ionicPopup.alert({
                title: title || '提示信息', // String. 弹窗的标题。
                subTitle: '', // String (可选)。弹窗的子标题。
                template: msg, // String (可选)。放在弹窗body内的html模板。
                okText: btnText || '确定' // String (默认: 'OK')。OK按钮的文字。
                    //templateUrl: '', // String (可选)。 放在弹窗body内的html模板的URL。
                    //okType: '' // String (默认: 'button-positive')。OK按钮的类型。
            });
            alertPopup.then(function(res) {
                //点击确定后
            });
        }

        /**
         * 可输入信息的对话框
         * @param $scope
         * @param title
         * @param defval
         * @param subTitle
         * @returns {*}
         */
        function inputMsgFun($scope,defval,title, subTitle) {
            $scope._popData = {text:defval}; //需要预先定义一个弹出窗数据接收对象
            return $ionicPopup.show({
                template: '<input type="text" ng-model="_popData.text">',
                title: title || '请输入内容',
                subTitle: subTitle || '',
                scope: $scope, //弹出窗的scope继承自父页面，可以访问父页面数据
                buttons: [
                    {
                        text: '取消',
                        type: 'button-positive',
                        onTap: function (e) {
                            return false;
                        }
                    },
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            //不允许用户关闭 e.preventDefault();
                            return $scope._popData.text;
                        }
                    }
                ]
            });
        }

        /**
         * 带有确定、取消的对话框
         * @param msg
         * @param title
         * @returns {*} 对话框对象
         */
        function confirmFun(msg, title) {
            return $ionicPopup.confirm({
                okText: '确定',
                cancelText: '取消',
                title: title || '确认操作',
                template: msg
            });
        }

        /**
         * 加载蒙层
         */
        function loadingFun() {
            return {
                show: function () {
                    $ionicLoading.show({
                        templateUrl: 'templates/common/models/loading.html'
                    });
                },
                hide: function () {
                    $ionicLoading.hide();
                }
            }
        }
        return Fac;
    }

    /**
     * 各工具方法
     * @param $q
     * @returns {*}
     * @constructor
     */
    function ToolsFun($q) {

        return {
            dataPicker: dataPickerFun, //日期控件
            checkEmail: checkEmailFun, //判断电子邮件格式是否正确
            checkConnection:checkConnectionFun,
            isInArray:isInArrayFun
        };

        /**
         * 日期控件(success:选择成功后的回调函数,[options:选择参数])
         * date : ,//初始日期
         * mode : 'date',
         * minDate: ,//能选择的最小日期
         * maxDate: ,//能选择的最大日期
         * cancelText: ,
         * okText: ,
         * todayText: '',
         * nowText: '',
         * is24Hour: false,
         * //android日期选择主题样式:THEME_TRADITIONAL | THEME_HOLO_DARK | THEME_HOLO_LIGHT | THEME_DEVICE_DEFAULT_DARK | THEME_DEVICE_DEFAULT_LIGHT
         * androidTheme: window.plugins.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
         * */
        function dataPickerFun(options) {
            var defer = $q.defer();
            if (window.plugins && window.plugins.datePicker) {
                var opts = options || {};
                opts.date = opts.date || new Date();
                window.plugins.datePicker.show(
                    opts,
                    function(returnDate) {
                        defer.resolve(returnDate);
                    },
                    function(error) {
                        //取消事件
                        defer.reject("取消");
                    }
                );
            } else {
                defer.resolve(false);
            }
            return defer.promise;
        }

        /**
         * 使用正则表达式判断电子邮件格式是否正确
         */
        function checkEmailFun(email) {
            return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email);
        }

        /**
         * 判断数组是否包含某个元素
         */
        function isInArrayFun(list,element) {
            if(angular.isArray(list)){
                for(var i=0;i<list.length;i++){
                    if(list[i]===element){
                        return true;
                    }
                }
            }
            return false;
        }

        /**
         * 查看网络连接状况
         *
         * @return {isConn: 'true网络连接正常  false无连接',type:''}
         *
         */
        function checkConnectionFun() {
            if(navigator&&navigator.connection) {
                //网络连接状况
                var _netStates = {};
                _netStates[Connection.UNKNOWN] = '未知网络';
                _netStates[Connection.ETHERNET] = '以太网';
                _netStates[Connection.WIFI] = 'WiFi网络';
                _netStates[Connection.CELL_2G] = '2G网络';
                _netStates[Connection.CELL_3G] = '3G网络';
                _netStates[Connection.CELL_4G] = '4G网络';
                _netStates[Connection.CELL] = '通用连接';
                _netStates[Connection.NONE] = '无网络连接';
                var networkState = navigator.connection.type;
                var _isConn=Connection.NONE != networkState;
                return {isConn:_isConn,type:_netStates[networkState]};
            }
            return {isConn:true,type:'无法检测网络连接'};
        }

    }

    /**
     * 本地存储
     * @param tipMsg
     * @returns {*}
     * @constructor
     */
    function DbToolFun(tipMsg) {
        var Fac = {
            initWebSqlDb: initWebSqlDbFun,
            putFdData: putFdDataFun,
            postOrUpdate: postOrUpdateFun,
            findFdData: findFdDataFun,
            getAllFdData: getAllFdDataFun,
            rmFdData: removeFdDataFun,
            getAllDocs: getAllDocsFun,
            findDataById:findDataByIdFun,
            getDb: getDbFun
        };

        var _db;
        var _fdId = 'fodoItem';

        /**
         * 创建一个本地存储数据库
         * @param dbname 数据库名称
         */
        function initWebSqlDbFun(dbname) {
            _db = new PouchDB(dbname, { adapter: 'websql' });

            _db.createIndex({
                index: {
                    fields: ['_id'],//对字段建立索引
                    name:'search-id-index'
                }
            }).catch(function (err) {
                console.log('创建失败。'+err);
            });
        }

        /**
         * 保存数据，_id指定
         * @param data 数据对象
         * @returns {*}
         */
        function putFdDataFun(data) {
            data._id = _fdId + data.title; //指定id
            return _db.put(data).then(function(result) {
                tipMsg.showMsg('保存成功。');
                return result;
            }).catch(function(err) {
                tipMsg.showMsg('保存失败。');
                console.log(err);
            });
        }

        /**
         * 根据_id查找doc
         * @param id
         * @param fields 指定返回的字段，若为空则返回所有
         * @returns {*}
         */
        function findDataByIdFun(id,fields) {
            return _db.find({
                selector: { _id: { $eq: id } },
                fields: fields
            }).then(function(data) {
                if (data.docs && data.docs.length > 0) {
                    return data.docs[0];
                }
                return {};
            });
        }

        /**
         * 保存一条数据，有_id则进行更新操作，否则新增
         * @param data
         * @returns {*}
         */
        function postOrUpdateFun(data) {
            if (data._id) {
                return _db.get(data._id).then(function(doc) {
                    doc.title = data.title;
                    doc.content = data.content;
                    return _db.put(doc).then(function(result) {
                        tipMsg.showMsg('修改成功。');
                        return result;
                    }).catch(function(err) {
                        tipMsg.showMsg('修改失败。');
                    });
                });
            } else {
                return _db.post(data).then(function(result) {
                    tipMsg.showMsg('保存成功。');
                    return result;
                }).catch(function(err) {
                    tipMsg.showMsg('保存失败。');
                });
            }
        }

        /**
         * 根据title查找doc
         * @param title
         * @returns {*}
         */
        function findFdDataFun(title) {
            return _db.find({
                selector: { title: { $eq: title } },
                fields: ['_id', 'title', 'content', 'img']
            }).then(function(data) {
                var itemList = [];
                if (data.docs && data.docs.length > 0) {
                    data.docs.forEach(function(doc) {
                        if (doc.title) {
                            itemList.push(doc);
                        }
                    });
                }
                return itemList;
            });
        }

        /**
         * 获取所有doc数据
         * @returns {*}
         */
        function getAllDocsFun() {
            return _db.allDocs({ include_docs: true });
        }

        /**
         * 获取所有含有title的doc
         * @returns {*}
         */
        function getAllFdDataFun() {
            var data = [];
            return _db.allDocs({ include_docs: true }).then(function(result) {
                if (result.rows && result.rows.length > 0) {
                    result.rows.forEach(function(row) {
                        if (row.doc && row.doc.title) {
                            data.push(row.doc);
                        }
                    });
                }
                return data;
            });
        }

        /**
         * 删除指定的doc
         * @param item
         */
        function removeFdDataFun(item) {
            return _db.remove(item);
        }

        /**
         * 获取创建的数据库
         * @returns _db 在应用启动时创建，见app.js
         */
        function getDbFun() {
            return _db;
        }

        return Fac;
    }

    /**
     * 对http请求的一个封装，可设置请求json数据方便调试
     */
    function CommonHttpFun($q, $http,$httpParamSerializer, appConfig, tipMsg,tools) {

        var _data={};//可在多个controller中传递的数据对象

        return {
            jsonPost: jsonPostFun,
            formPost: formPostFun,
            httpGet:httpGetFun,
            getSubmitData:getSubmitDataFun,//获取数据，在多个controller中传递
            setSubmitData:setSubmitDataFun//设置数据
        };

        /**
         * 发送json数据的post请求
         *
         * 本地调试：获取的是common.json文件的数据，其中key为对应的http请求相对路径 value为模拟后台返回的值
         *
         * @param url 相对路径
         * @param jsonData
         * @returns {*}
         */
        function jsonPostFun(url, jsonData) {
            var delay = $q.defer();
            if (appConfig.getLocalDebug()) {
                //本地调试
                $http.get(appConfig.getLocalHost()).success(function (data) {
                    delay.resolve(data[url]);
                }).error(function (error) {
                    console.log(error);
                    delay.reject('获取数据失败。');
                });
            } else {
                //在线
                var _conn = tools.checkConnection();
                if(_conn.isConn) {//检测网络连接
                    $http.post(appConfig.getHost() + url, jsonData).success(function (data) {
                        delay.resolve(data);
                    }).error(function (error) {
                        console.log(error);
                        delay.reject('服务器连接失败。');
                    });
                }else{
                    delay.reject(_conn.type);
                }
            }
            return delay.promise;
        }

        /**
         *  发送非json格式的post请求,使用$httpParamSerializer数据将转换成 param1=a&param2=b的形式。（详情可查看angularjs源码中$httpParamSerializer的定义）
         *
         *  本地调试：获取的是common.json文件的数据，其中key为对应的http请求相对路径 value为模拟后台返回的值
         *
         * @param url 相对路径
         * @param formData 表单数据
         */
        function formPostFun(url, formData) {
            var delay = $q.defer();
            var req = {
                method: 'POST',
                url: appConfig.getHost() + url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializer(formData)
            };
            if (appConfig.getLocalDebug()) {
                //本地调试
                $http(req).success(function (data) {
                    delay.resolve(data[url]);
                }).error(function (error) {
                    console.log(error);
                    delay.reject('服务器连接失败。');
                });
            } else {
                //在线
                var _conn = tools.checkConnection();
                if(_conn.isConn) {//检测网络连接
                    $http(req).success(function (data) {
                        delay.resolve(data);
                    }).error(function (error) {
                        console.log(error);
                        delay.reject('服务器连接失败。');
                    });
                }else{
                    delay.reject(_conn.type);
                }
            }

            return delay.promise;
        }

        /**
         * http get 请求
         *
         * 本地调试：获取的是common.json文件的数据，其中key为对应的http请求相对路径 value为模拟后台返回的值
         * @param url 相对路径
         * @returns {*}
         */
        function httpGetFun(url) {
            var delay = $q.defer();
            if (appConfig.getLocalDebug()) {
                //本地调试
                $http.get(appConfig.getLocalHost()).success(function (data) {
                    delay.resolve(data[url]);
                }).error(function (error) {
                    console.log(error);
                    delay.reject('获取数据失败。');
                });
            } else {
                //在线
                var _conn = tools.checkConnection();
                if(_conn.isConn) {//检测网络连接
                    $http.get(appConfig.getHost() + url).success(function (data) {
                        delay.resolve(data);
                    }).error(function (error) {
                        console.log(error);
                        delay.reject('服务器连接失败。');
                    });
                }else{
                    delay.reject(_conn.type);
                }
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

    function CoordtransformFun(){
        //定义一些常量
        var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        /**
         * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
         * 即 百度 转 谷歌、高德
         * @param bd_lon
         * @param bd_lat
         * @returns {*[]}
         */
        var bd09togcj02 = function bd09togcj02(bd_lon, bd_lat) {
            var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
            var x = bd_lon - 0.0065;
            var y = bd_lat - 0.006;
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
            var gg_lng = z * Math.cos(theta);
            var gg_lat = z * Math.sin(theta);
            return [gg_lng, gg_lat]
        };

        /**
         * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
         * 即谷歌、高德 转 百度
         * @param lng
         * @param lat
         * @returns {*[]}
         */
        var gcj02tobd09 = function gcj02tobd09(lng, lat) {
            var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
            var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
            var bd_lng = z * Math.cos(theta) + 0.0065;
            var bd_lat = z * Math.sin(theta) + 0.006;
            return [bd_lng, bd_lat]
        };

        /**
         * WGS84转GCj02
         * @param lng
         * @param lat
         * @returns {*[]}
         */
        var wgs84togcj02 = function wgs84togcj02(lng, lat) {
            if (out_of_china(lng, lat)) {
                return [lng, lat]
            } else {
                var dlat = transformlat(lng - 105.0, lat - 35.0);
                var dlng = transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PI;
                var magic = Math.sin(radlat);
                magic = 1 - ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                var mglat = lat + dlat;
                var mglng = lng + dlng;
                return [mglng, mglat]
            }
        };

        /**
         * GCJ02 转换为 WGS84
         * @param lng
         * @param lat
         * @returns {*[]}
         */
        var gcj02towgs84 = function gcj02towgs84(lng, lat) {
            if (out_of_china(lng, lat)) {
                return [lng, lat]
            } else {
                var dlat = transformlat(lng - 105.0, lat - 35.0);
                var dlng = transformlng(lng - 105.0, lat - 35.0);
                var radlat = lat / 180.0 * PI;
                var magic = Math.sin(radlat);
                magic = 1 - ee * magic * magic;
                var sqrtmagic = Math.sqrt(magic);
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                mglat = lat + dlat;
                mglng = lng + dlng;
                return [lng * 2 - mglng, lat * 2 - mglat]
            }
        };

        var transformlat = function transformlat(lng, lat) {
            var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
            return ret
        };

        var transformlng = function transformlng(lng, lat) {
            var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
            return ret
        };

        /**
         * 判断是否在国内，不在国内则不做偏移
         * @param lng
         * @param lat
         * @returns {boolean}
         */
        var out_of_china = function out_of_china(lng, lat) {
            return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
        };

        return {
            bd09togcj02: bd09togcj02,
            gcj02tobd09: gcj02tobd09,
            wgs84togcj02: wgs84togcj02,
            gcj02towgs84: gcj02towgs84
        }
    }
})();
