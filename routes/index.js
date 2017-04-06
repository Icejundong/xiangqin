
// 引入mongodb
var mongodb = require('../models/db');
var crypto = require('crypto');
var User = require('../models/user')
var Diary = require('../models/diary')
var Comment = require('../models/comment')
var multer = require('multer');

var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./wwwroot/uploads')
    },
    filename : function(req,file,cb){
        var filename =  `${req.session.user.name}.png`;
        cb(null,filename)
    }
})
var upload = multer({storage})


module.exports = function(app){
    // 用户注册
    app.post('/reg',function(req,res){
        console.log(req.body)
        // 将数据整理，并放到User对象中
        var name = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var sex = req.body.sex;
        console.log(typeof sex)
        // 此处对密码进行加密处理
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('hex');
        // 把整理好的数据放到user对象中。
        var newUser = new User({
            name : name,
            password : password,
            email : email,
            sex : sex,
            time : new Date()
        })
        // 检查用户是否存在
        User.get(newUser.name,function(err,user){
            if(err){
                res.status(200).json({code:'error',message:"数据库错误"});
                return
            }
            // 如果用户已经存在
            if(user){
                res.status(200).json({code:"error",message:"该用户已经注册！"});
                return
            }
            //此时插入到数据库中
            newUser.save(function(err,user){
                if(err){
                    res.status(200).json({code:'error',message:'插入数据失败'});
                }
                req.session.user = newUser;
                res.status(200).json({
                    code : 'success',
                    message : '注册成功',
                    user : req.session.user
                })
            })
        })
    })
    // 获取当前用户
    app.get('/user',function(req,res){
        res.json({
            user : req.session.user
        })
    })
    
    // 用户登陆
    app.post('/login',function(req,res){
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('hex');

        User.get(req.body.username,function(err,user){
            if(!user){
                res.status(200).json({code:'error',message:'该用户不存在！'});
                return;
            }
            if(user.password != password){
                res.status(200).json({code:'error',message:'密码错误'});
                return;
            }
            req.session.user = user;
            res.status(200).json({
                code:'success',
                message : '登陆成功',
                user : req.session.user
            })
        })
    })

    // 推荐用户
    // 获取所有的用户
    app.get('/tuijian',function(req,res){
        User.getAll(req.session.user.sex,function(err,user){
            if(err){
                res.status(200).json({code:'error',message:'数据库错误'})
                return
            }
            res.status(200).json({code:'success',message:'查询成功',data:user})
        })
    })

    //退出功能
    app.get('/logout',function(req,res){
        req.session.user = null;
        res.status(200).json({code:'success',message:'退出成功'})
    })

    // 查询当前用户的所有信息
    app.get('/oneuser',function(req,res){
        console.log(1)
        console.log(req.session.user.name)
        User.get(req.session.user.name,function(err,user){
            if(err){
                res.status(200).json({code:'error',mesage:'数据库错误'})
                return
            }
            req.session.user = user;
            res.status(200).json({
                code:'success',
                message:'查询成功',
                data : req.session.user
            })
        })
    })

    // 更新资料
    app.post('/update',function(req,res){
        // console.log(req.body)
        // console.log('省' ,req.body.sheng)
        // console.log('市',req.body.shi)
        // console.log('区',req.body.qu)
        var address = req.body.sheng + req.body.shi +　req.body.qu
        User.up(req.session.user.name,req.body.email,req.body.pay,req.body.age,address,req.body.phone,req.body.height,req.body.weight,req.body.description,function(err,user){
            if(err){
                res.status(200).json({code:'error',mesage:'数据库错误'})
                return
            }
            req.session.user = user;
            res.status(200).json({
                code:'success',
                message:'更新成功',
                data : req.session.user
            })
        })
    })

    // 查询某个用户信息
    app.get('/:name',function(req,res){
        console.log(req.params)
        User.get(req.params.name,function(err,user){
            if(err){
                res.status(200).json({code:'error',message:'数据库错误'})
            }
            res.status(200).json({code:'success',message:'查询成功',data:user})
        })
    })

    // 上传头像
    app.post('/upload',upload.single('pic'),function(req,res){
        // setTimeout(function() {
        //     res.redirect('/templates/index.html#/index')
        // }, 2000);
        
    })

    //发布日记
    app.post('/diary',function(req,res){
        // console.log(req.body)
        var currentUser =  req.session.user.name;
        var newDiary = new Diary(currentUser,req.body.title,req.body.diary);
        newDiary.save(function(err){
            if(err){
                res.status(200).json({code:'error',message:'数据库错误'});
            }
            res.status(200).json({code:'success',message:'发布成功'})
        })
    })

    // 获取所有日记
    app.get('/diary/all',function(req,res){
        Diary.getAll(function(err,diarys){
            console.log(1)
            console.log(diarys)
            if(err){
                res.status(200).json({code:'error',message:'数据库错误'});
            }
            res.status(200).json({code:'success',message:'查询成功1',data:diarys})
        })
    })

  // 查看某个日记详情
  app.get('/:name/:title/:second',function(req,res){
      Diary.getOne(req.params.name,req.params.title,req.params.second,function(err,diary){
          if(err){
              res.status(200).json({code:'error',message:'数据库错误'})
          }
          res.status(200).json({code:'success',message:'查询成功',data:diary})
      })
  })
  // 留言
  app.post('/comment/:name/:second',function(req,res){
        var date = new Date(),
            time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

        var comment = {
            name : req.session.user.name,
            second : req.params.second,
            time : time,
            content:req.body.content,
            user: req.session.user
        }

        var newComment = new Comment(req.params.name,req.params.second,comment);

        newComment.save(function(err){
            if(err){
                res.status(200).json({code:'error',message:'数据库错误'})
                return
            }
            res.status(200).json({code:'success',message:'留言成功'})
        })
  })
  
  // 通过查询按钮  查询用户
  app.post('/chaxun/jundong/gao/xixi',function(req,res){
    // console.log(req.body)
    var address = req.body.sheng + req.body.shi +　req.body.qu;
	var user = {
		name : req.body.name,
		age : req.body.age,
		phone : req.body.phone,
		pay : req.body.pay,
        address : address
	}
    console.log(user)
	User.chaxun(user,function(err,users){
		if(err){
			res.status(200).json({code:'error',message:'数据库错误'})
		}
		res.status(200).json({code:'success',message:'查询成功123',data:users})
	})
  })
}