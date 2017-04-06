var mongodb = require('./db');

function Comment(name,second,comment){
    this.name = name;
    this.second = second;
    this.comment = comment;
}

module.exports = Comment;


//  存储一条留言信息

Comment.prototype.save = function(callback){
    var name  = this.name;
    var second = this.second;
    var comment =this.comment;

    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('diarys',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.update({
                "name" :name,
                "time.second" :second
            },{
                $push : {"comments":comment}
            },function(err){
                 mongodb.close()
                if(err){
                   return callback(err)
                }
                return callback(null)
            })
        })
    })
}