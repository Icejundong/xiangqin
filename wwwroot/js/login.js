$('#loginform').submit(function(e){
    e.preventDefault()
    var data = $(this).serialize();
    // alert(1)
    $.post('/login',data,function(data){
        console.log(data)
        if(data.code === 'success'){
            location.href = 'templates/index.html'
        }else{
            alert(data.message)
        }
    })
})