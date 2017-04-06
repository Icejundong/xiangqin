// 如何避免生成全局变量， 全局函数
// ==== 函数的自我调用 (function(){})()
(function(){


$.fn.myThumb = function(){
    //console.log(this)  // 调用方法的jquery对象

    $(this).each(function(index, ele){
        // index:索引值， ele:当前索引值所对应的标签
        thumbShow(ele)
    })
    // 函数执行完之后返回调用的对象，便于继续调用方法
    return this
}
    // 封装方法  --- 缩略图滚动方法
//var thumbShow = function(){
function thumbShow(ele){
    //console.log($(ele)) // 单个的jquery对象
    // 上一张,下一张,平移的标签ul,li
    // 默认的设置
    var settings = {
        dir:'left', // 默认的滚动方向
        prevId:'btn-pre',
        nextId:'btn-next',
        moveId:'thumbs',
        speed:500
    }

    var $ele = $(ele),
        $slidePrev = $ele.find('.' + settings.prevId),
        $slideNext = $ele.find('.' + settings.nextId),
        $slideMove = $ele.find('.' + settings.moveId)
    // 平移的距离  === 判断滚动方向
    if( settings.dir == 'left' ){
        var li_width = $slideMove.children().width()
    } else if( settings.dir == 'top' ){
        var li_width = $slideMove.children().height()
    }

    var data1 = {}, data2 = {}
    data1[settings.dir] = -li_width
    data2[settings.dir] = 0
    // 上一张
    $slidePrev.click(function(){
        $slideMove.animate(data1, settings.speed , function(){
            $slideMove.css(settings.dir, 0)
                .children().first().appendTo($slideMove)
        })
    })
    // 下一张
    $slideNext.click(function(){
        $slideMove.css(settings.dir, -li_width + 'px')
            .children().last().prependTo($slideMove)
        $($slideMove).stop().animate(data2, settings.speed)
    })
}

})()