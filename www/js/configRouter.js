/**
 * Created by Administrator on 2015/11/30.
 *
 *  ionic.js 没有使用 AngularJS内置的 ng-route 模块，
 *  而是选择了 AngularUI 项目 的 ui-router 模块。
 *  ui-router 的核心理念是将子视图集合抽象为一个状态机，
 *  导航意味着 状态 的切换。在不同的状态下， ionic.js 渲染对应的子视图（动态加载的 HTML 片段）
 *  就实现了路由导航的功能。
 *
 *  ionic.bundle.js 已经打包了 ui-route 模块， 所以使用时不需要单独引入。
 */

appModule.config(function($stateProvider, $urlRouterProvider){

$stateProvider
    .state('login',{
        url:'/login',
        controller:'loginController',
        templateUrl:'templates/login.html'
    })
    //普通用户登陆
    .state('home',{//状态名称
        url: '/home',//页面跳转url,跳转方式有：1.$state.go(stateName) 2. 点击包含 ui-sref 指令的链接 <a ui-sref=stateName>Go State</a> 或 href=url的链接
        abstract: true,//表明此状态不能被显性激活，只能被子状态隐性激活
        controller: 'homeController',//控制器名称
        templateUrl: 'templates/home/menu-common.html'//html模版路径，也可以直接使用template:'<div>template...<div>'
    })
    .state('home.welcome',{
        url:'/welcome',
        views:{
            'welcome':{
                templateUrl:'templates/home/welcome.html',
                controller:'welcomeController'
            }
        }
    })
    //管理员登陆
    .state('admin',{
        url:'/admin',
        abstract:true,
        controller:'homeController',
        templateUrl:'templates/home/menu-admin.html'
    })
    .state('admin.welcome',{
        url:'/welcome',
        views:{
            'welcome':{
                templateUrl:'templates/home/welcome.html',
                controller:'welcomeController'
            }
        }
    })
    .state('admin.management',{
        url:'/management',
        views:{
            'management':{
                templateUrl:'templates/home/management.html',
                controller:'userManagementController'
            }
        }
    })
    .state('modules',{
        url:'/modules',
        abstract:true,
        controller:'worklogController',
        templateUrl:'templates/modules/worklog.html'
    })
    .state('modules.worklog',{
        url:'/worklog',
        views:{
           'worklogcontent':{
               templateUrl:'templates/modules/worklog-content.html'
           }
        }
    })
    ;
    $urlRouterProvider.otherwise('/login');//找不到对应url的默认设置
});