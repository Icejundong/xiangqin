var routerApp = angular.module('routerApp',['ui.router','userApp','userIndexApp','editApp','detialsApp','uploadApp','laobaApp','diaryApp']);

routerApp.run(function($rootScope,$state,$stateParams){
    $rootScope.$state  =  $state;
    $rootScope.$stateParams = $stateParams;
})

routerApp.controller('routerCtrl',function($scope,$http){
    $http.get('/user').success(function(data){
        $scope.data = data;
    })
    $scope.logout = function(){
        $http.get('/logout').success(function(data){
            if(data.code == 'success'){
                window.location.href = '/'
            }
        })
    }
})

routerApp.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/index');

    $stateProvider
        .state('index',{
            url:'/index',
            views : {
                '' :{
                    templateUrl : 'user_index.html'
                }
            }
        })
        .state('laoba',{
            url:'/laoba',
            views :{
                '' : {
                    templateUrl : 'laoba.html'
                }
            }
        })
        .state('zuopin',{
            url:'/zuopin',
            views : {
                '': {
                    templateUrl : 'zuopin.html'
                }
            }
        })
        .state('gonggao',{
            url:'/gonggao',
            views : {
                '' : {
                    templateUrl: 'gonggao.html'
                }
            }
        })
        .state('licheng',{
             url:'/licheng',
            views:{
                '':{
                    templateUrl : 'licheng.html'
                }
            }
        })
        .state('jieshao',{
             url:'/jieshao',
            views:{
                '':{
                    templateUrl : 'jieshao.html'
                }
            }
        })
        .state('fangxiang',{
             url:'/fangxiang',
            views:{
                '':{
                    templateUrl : 'fangxiang.html'
                }
            }
        })
        .state('join',{
             url:'/join',
            views:{
                '':{
                    templateUrl : 'join.html'
                }
            }
        })
        .state('avatar',{
            url:'/avatar',
            views:{
                '' :{
                    templateUrl : 'avatar.html'
                }
            }
        })
        .state('ziliao',{
            url:'/ziliao',
            views :{
                '':{
                    templateUrl:'ziliao.html'
                }
            }
        })
        .state('detials',{
            url : '/:name',
            views : {
                '' : {
                    templateUrl : 'detials.html'
                }
            }
        })
        .state('diary',{
            url : '/:name/:title/:second',
            views :{
                '':{
                    templateUrl : 'diary.html'
                }
            }
        })
})