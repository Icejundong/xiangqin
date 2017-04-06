var mongodb = require('./db');

function time(){
    var date = new Date()
    return {
        year : date.getFullYear(),
        month : date.getFullYear() + '-' +(date.getMonth() + 1) ,
        date : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        hour : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '  ' + date.getHours(),
        minute : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
        second : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    }
}

// 创建一个User类。给User添加方法
function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.sex = user.sex;
    this.time = time().second;
}
// 将User类暴漏给外界，以便于外界使用。
module.exports = User;

// 保存用户
User.prototype.save = function(callback){
    var user = {
        name: this.name,
        password : this.password,
        email : this.email,
        sex: this.sex,
        wealth : 0,
        pay: '',
        age: '20',
        address : '',
        phone: '',
        height: 0,
        weight: 0,
        description:''
    }
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            // 插入数据
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                // 此处返回用户数据中的用户名
                callback(null,user[0]);
            })
        })
    })
}

// 查询用户
User.get = function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            // 通过name查询用户
            collection.findOne({name:name},function(err,user){
                mongodb.close()
                if(err){
                     callback(err)
                }
                // 返回用户信息
                callback(null,user)
            })
        })
    })
}

// 获取所有用户
User.getAll = function(sex,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            var query = {}
            query.sex = (sex == 'true') ? 'false' : 'true';
            collection.find(query).sort({time : -1}).toArray(function(err,users){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                callback(null,users)
            })
        })
    })
}

// 更新资料
User.up = function(name,email,pay,age,address,phone,height,weight,description,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.findOne({name:name},function(err,user){
                if(err){
                    mongodb.close()
                    return callback(err)
                }
                if(user){
                    collection.update({"name":name},{$set : {'name':name,'email':email,'pay':pay,'age':age,'address':address,'phone':phone,'height':height,'weight':weight,'description':description}},{multi:true},function(err){
                        mongodb.close()
                        if(err){
                            return callback(err)
                        }
                    })
                    callback(null,user)
                }
            })
        })
    })
}

// 通过查询按钮 查询用户。
User.chaxun = function(user,callback){
	
	var filter = {}
	if(user.name != '') {
        filter.name = user.name
    }
    if(user.phone != ''){
        filter.phone = user.phone;
    }
    if(user.pay != ''){
        filter.pay = user.pay;
    }
    if(user.age != ''){
        filter.age = user.age;
    }
    if(user.address != ''){
        filter.address = user.address;
    }
    console.log('filter',filter)

	mongodb.open(function(err,db){
		if(err){
			return callback(err)
		}
		db.collection('users',function(err,collection){
			if(err){
				mongodb.close()
				return callback(err)
			}
			collection.find(filter).toArray(function(err,users){
				mongodb.close()
				if(err){
					return callback(err)
				}
				return callback(null,users)
			})
		})
	})
}
