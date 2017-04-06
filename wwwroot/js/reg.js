// 定义angular模块，进行前端控制输入框的状态
var regApp = angular.module('regApp',[]);
regApp.controller('regCtrl',function($scope){
    
})

// 这里使用jquery发起post请求
$('#regform').submit(function(e){
    e.preventDefault()
    var data = $(this).serialize();
    // alert(1)
    console.log(data)
    $.post('/reg',data,function(data){
        console.log(data)
        if(data.code === 'success'){
            location.href = 'templates/index.html'
        }else{
            alert(data.message)
        }
    })
})