/**
 * Created by Administrator on 2015/11/30.
 */
(function(){
    appModule
        .directive('csIonRadio', CsIonRadioDir) //扩展自ion-radio的指令，修改了其模版
        .directive('csIonCheck',CsIonCheckDir) //扩展自ion-check的指令，修改了其模版
        .directive('csDatePicker',CsDatePickerDir)//自定义的日期选择指令
        .directive('csTimePicker',CsTimePickerDir)//自定义的时间选择指令
        .directive('csSearchInput',CsSearchInputDir)//带有删除键的查询工具条
        .directive('csBackTo',CsbackToDir)//顶部栏左侧返回按钮
        .directive('csReturnBtn',CsReturnBtnDir)//顶部栏左侧返回按钮
        .directive('csContentToggle',CsContentToggle)//内容显示隐藏
        ;

    /**
     * 带有删除键的查询工具条
     *      <cs-search-input ng-model="" btn-click=""></cs-search-input>
     * @returns {*}
     * @constructor
     */
    function CsSearchInputDir(){
        return {
            restrict:'E',
            replace:true,
            require:'?ngModel',
            transclude: true,
            template:'<div class="button-clear item-input-inset search-bar-in" >'+
                        '<div class="item-input-wrapper input-wrapper-bg-1">'+
                            '<i class="icon ion-search placeholder-i-1"></i>'+
                            '<input class="input" type="text"/>'+
                        '</div>'+
                        '<div class="width-5">'+
                            '<span class="icon ion-close placeholder-i-1 input-del-i"></span>'+
                            '<label class="input-q-btn">查  询</label>'+
                        '</div>'+
                      '</div>',
            compile:function(element,attr){
                var label = element.find('label');
                var span= element.find('span');
                var input = element.find('input');

                //label
                if(angular.isDefined(attr.btnClick)){
                    label.attr('ng-click',attr.btnClick);
                }
                //i
                if(angular.isDefined(attr.delClick)){
                    span.attr('ng-click',attr.delClick);
                }
                if(angular.isDefined(attr.delShow)){
                    span.attr('ng-show',attr.delShow);
                }
                //input
                angular.forEach({
                    'disabled': attr.disabled,
                    'ng-model': attr.ngModel,
                    'ng-disabled': attr.ngDisabled,
                    'placeholder':attr.placeholder
                }, function(value, name) {
                    if (angular.isDefined(value)) {
                        input.attr(name, value);
                    }
                });

            }
        }

    }

    /**
     * 自定义的日期选择指令
     * @returns {*}
     * @constructor
     */
    function CsDatePickerDir(){
        return {
            restrict:'E',
            replace:true,
            require:'?ngModel',
            transclude: true,
            template:
                '<label class="item-input-wrapper ss-date-pick">'+
                '<input class="input" type="text" readonly/>'+
                '<i class="icon ion-calendar placeholder-icon"></i>'+
                '</label>',
            compile:function(element,attr){
                //自定义日期图标
                if(attr.icon){
                    var iconElm = element.find('i');
                    iconElm.removeClass('ion-calendar').addClass(attr.icon);
                }

                var label = element.find('label');
                if(angular.isDefined(attr.ngClick)){
                    label.attr('ng-click',attr.ngClick);
                }
                if(attr.class){
                    label.addClass(attr.class);
                }

                var input = element.find('input');
                angular.forEach({
                    'name': attr.name,
                    'value': attr.value,
                    'disabled': attr.disabled,
                    'ng-value': attr.ngValue,
                    'ng-model': attr.ngModel,
                    'ng-disabled': attr.ngDisabled,
                    'ng-change': attr.ngChange,
                    'ng-required': attr.ngRequired,
                    'required': attr.required,
                    'placeholder':attr.placeholder
                }, function(value, name) {
                    if (angular.isDefined(value)) {
                        input.attr(name, value);
                    }
                });

                return function(scope, element, attr) {
                    scope.getValue = function() {
                        return scope.ngValue || attr.value;
                    };
                };
            }
        }
    }

    /**
     * 日期选择
     * @returns {*}
     * @constructor
     */
    function CsTimePickerDir(){
        return {
            restrict:'E',
            replace:true,
            require:'?ngModel',
            transclude: true,
            template:
                '<label class="item-input-wrapper ss-time-pick">'+
                '<input class="input" type="text" readonly/>'+
                '<i class="icon ion-clock placeholder-icon"></i>'+
                '</label>',
            compile:function(element,attr){
                //自定义日期图标
                if(attr.icon){
                    var iconElm = element.find('i');
                    iconElm.removeClass('ion-calendar').addClass(attr.icon);
                }

                var label = element.find('label');
                if(angular.isDefined(attr.ngClick)){
                    label.attr('ng-click',attr.ngClick);
                }
                if(attr.class){
                    label.addClass(attr.class);
                }

                var input = element.find('input');
                angular.forEach({
                    'name': attr.name,
                    'value': attr.value,
                    'disabled': attr.disabled,
                    'ng-value': attr.ngValue,
                    'ng-model': attr.ngModel,
                    'ng-disabled': attr.ngDisabled,
                    'ng-change': attr.ngChange,
                    'ng-required': attr.ngRequired,
                    'required': attr.required,
                    'placeholder':attr.placeholder
                }, function(value, name) {
                    if (angular.isDefined(value)) {
                        input.attr(name, value);
                    }
                });

                return function(scope, element, attr) {
                    scope.getValue = function() {
                        return scope.ngValue || attr.value;
                    };
                };
            }
        }
    }

    /**
     * 扩展自ion-radio的指令，修改了其模版
     * @returns {*}
     * @constructor
     */
    function CsIonRadioDir(){
        return {
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            transclude: true,
            template:
                '<label class="item item-checkbox">' +
                '<div class="checkbox checkbox-input-hidden disable-pointer-events">' +
                '<input type="radio">' +
                '<i class="checkbox-icon"></i>' +
                '</div>' +
                '<div class="item-content disable-pointer-events" ng-transclude></div>' +
                '</label>',
            compile: function(element, attr) {
                //可自定义选中时的图标
                if (attr.icon) {
                    var iconElm = element.find('i');
                    iconElm.removeClass('checkbox-icon').addClass(attr.icon);
                }

                var input = element.find('input');
                angular.forEach({
                    'name': attr.name,
                    'value': attr.value,
                    'disabled': attr.disabled,
                    'ng-value': attr.ngValue,
                    'ng-model': attr.ngModel,
                    'ng-disabled': attr.ngDisabled,
                    'ng-change': attr.ngChange,
                    'ng-required': attr.ngRequired,
                    'required': attr.required
                }, function(value, name) {
                    if (angular.isDefined(value)) {
                        input.attr(name, value);
                    }
                });

                return function(scope, element, attr) {
                    scope.getValue = function() {
                        return scope.ngValue || attr.value;
                    };
                };
            }
        };
    }

    /**
     * 扩展自ion-check的指令，修改了其模版
     * @returns {*}
     * @constructor
     */
    function CsIonCheckDir(){
        return {
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            transclude: true,
            template:
                '<label class="item item-radio">' +
                '<input type="checkbox" >' +
                '<div class="radio-content">' +
                '<div class="item-content disable-pointer-events" ng-transclude></div>' +
                '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' +
                '</div>' +
                '</label>',
            compile: function(element, attr) {
                var input = element.find('input');
                angular.forEach({
                    'name': attr.name,
                    'ng-value': attr.ngValue,
                    'ng-model': attr.ngModel,
                    'ng-checked': attr.ngChecked,
                    'ng-disabled': attr.ngDisabled,
                    'ng-true-value': attr.ngTrueValue,
                    'ng-false-value': attr.ngFalseValue,
                    'ng-change': attr.ngChange,
                    'ng-required': attr.ngRequired,
                    'required': attr.required
                }, function(value, name) {
                    if (angular.isDefined(value)) {
                        input.attr(name, value);
                    }
                });
            }
        };
    }


    /**
     * 返回指定状态的页面，默认返回首页login
     * @returns {*}
     */
    function CsbackToDir(){
        return {
            restrict:'E',
            transclude: true,
            replace:true,
            scope:{
                backToState:'@'//绑定back-to-state属性的字符串
            },
            template:'<button class="button button-icon button-clear ion-chevron-left" ng-click="s_backToHome()"></button>',
            controller:function($scope,$state){
                var stateName=$scope.backToState||'login';
                $scope.s_backToHome=function(){
                    $state.go(stateName);
                }
            }
        }
    }
    /**
     * 返回上一页
     *      <cs-return-btn></cs-return-btn>
     * @returns {*}
     */
    function CsReturnBtnDir(){
        return {
            restrict:'E',
            transclude: true,
            replace:true,
            template:'<button class="button button-icon button-clear ion-chevron-left" ng-click="_returnBack()"></button>',
            controller:function($scope,$ionicHistory){
                $scope._returnBack=function(){
                    $ionicHistory.goBack();
                }
            }
        }
    }

    /**
     * 点击可以显示或隐藏内容
     * @returns {*}
     * @constructor
     */
    function CsContentToggle(){
        return {
            restrict:'E',
            replace:true,
            scope:{
                content:'=asContent',
                size:'@asSize',
                showTip:'@asShowTip',
                hideTip:'@asHideTip'
            },
            template:'<div >{{content|showOrHideFilter:size:showFlag}} <a ng-click="showFun()">{{showOrHide}}</a></div>',
            link:function(scope, element, attrs){
                scope.showFlag=true;
                scope.showOrHide=scope.showTip;
                scope.showFun=function(){
                    scope.showFlag=!scope.showFlag;
                    scope.showOrHide=scope.showFlag?scope.showTip:scope.hideTip;
                };
            }
        };
    }
})();
