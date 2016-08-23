(function(window, angular) {
    var app = angular.module('app', ['ui.router','ngCookies','base64','angular-md5']);

    
    app.run(function($rootScope, $state, $stateParams, $interval,$http,isLogin,userInfo) {

       
        
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            if(toState.title){
                $rootScope.pageTitle = toState.title;
            }
            console.log(userInfo.get());
            if(userInfo.get()){
                $rootScope.isLogin = true;
                $rootScope.token = userInfo.get().Token;
             // isLogin();
            }else{
                $rootScope.isLogin = false;
            }



        });
        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){

           // isLogin();
          if(toState.title){
                $rootScope.pageTitle = toState.title;
          }
          if(userInfo.get()){
                $rootScope.isLogin = true;
                $rootScope.token = userInfo.get().token;
             // isLogin();
            }else{
                $rootScope.isLogin = false;
            }
        });
    });
    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
        
       $httpProvider.interceptors.push('sessionInterceptor');

        $stateProvider
            .state('register',{
                url:'/register',
                templateUrl:'views/qiantai/register.html',
                title:'注册',
                controller:'registerCtrl'
            })
            .state('login',{
                url:'/login',
                templateUrl:'views/qiantai/login.html',
                title:'登陆',
                controller:'loginCtrl'
            })
            
        $urlRouterProvider.otherwise("/index");
    }]);



})(window, angular);
