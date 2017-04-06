var userApp = angular.module('userApp',[]);
userApp.controller('userCtrl',function($http,$scope){
    $http.get('/user').success(function(data){
        console.log(data)
        $scope.data = data;
    })
})

var userIndexApp = angular.module('userIndexApp',[]);
userIndexApp.controller('userIndexCtrl',function($http,$scope){
    $http.get('/tuijian').success(function(data){
        $scope.data = data;
        console.log(data)
    })
    $scope.chazhao = function(){
		var data = $('#chazhaoForm').serialize()
        console.log(data)
		$.post('/chaxun/jundong/gao/xixi',data,function(data){
            console.log(data)
            if(data.code == 'success'){
                if(data.data.length == 0){
                    $('article').html('没有符合您条件的哟~尝试改变一下搜索条件吧！')
                }else{
                    var messages = '';
                    for(var i = 0; i< data.data.length ; i++){
                        var user = data.data[i]
                        messages += '<div class="col-sm-3" style="margin-bottom:20px;">'
                        messages += '<a href="#/'+ user.name + '">'
                        messages += '<div class="moren">'
                        messages += '<div class="touxiang" style="background-image:url(' + '../uploads/' + user.name + '.png' + ')"></div>'
                        messages += '<div class="zuozhexinxi">'
                        messages += '<p>昵称：' + user.name +'</p>'
                        messages += '<p>年龄：' + user.age +'</p>'
                        messages += '<p>住址：' + user.address +'</p>'
                        messages += '</div>'
                        messages += '</div>'
                        messages += '</a></div>'
                    }
                    $('article').html(messages)
                }
            }else{
                $('article').html(data.message)
            } 
	    })
    }
})

var editApp = angular.module('editApp',[]);
editApp.controller('editCtrl',function($http,$scope){
    // 查询当前用户的所有信息
    $http.get('/oneuser').success(function(data){
        console.log(data)
        $scope.data = data.data;
    })
    $scope.update = function(){
        var data = $('#ziliaoForm').serialize()
        $.post('/update',data,function(data){
            console.log(data)
            if(data.code == 'success'){
                location.href = '#/index'
            }
        })
    }
})

var detialsApp = angular.module('detialsApp',[])
detialsApp.controller('detialsCtrl',function($scope,$http,$stateParams){
    $http.get('/' + $stateParams.name).success(function(data){
        console.log(data)
        $scope.data = data.data;
    })
})


var uploadApp = angular.module('uploadApp',[]);
uploadApp.controller('uploadCtrl',function($scope,$http){

})

var laobaApp = angular.module('laobaApp',[]);
laobaApp.controller('laobaCtrl',function($scope,$http){

    $http.get('/diary/all').success(function(data){
        console.log(data)
        $scope.data = data.data;
    })

    $scope.postForm = function(){
        $http({
            method :'POST',
            url : '/diary',
            data: $.param($scope.formData),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
            console.log(data)
            alert(data.message)
        })
        window.location.reload()
    } 
})

var diaryApp = angular.module('diaryApp',[]);
diaryApp.controller('diaryCtrl',function($scope,$http,$stateParams){
    $http.get('/' + $stateParams.name + '/' + $stateParams.title + '/'　+ $stateParams.second).success(function(data){
        console.log(data)
        $scope.data = data.data;
    })
    $scope.postForm = function(){
        $http({
            method : 'POST',
            url : '/comment/'+ $stateParams.name + '/' + $stateParams.second,
            data : $.param($scope.formData),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
            console.log(data)
            if(data.code == 'success'){
                $http.get('/' + $stateParams.name + '/' + $stateParams.title + '/'　+ $stateParams.second).success(function(data){
                    console.log(data)
                    $scope.data = data.data;
                })
            }
        })
    }
})