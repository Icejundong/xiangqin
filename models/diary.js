
var mongodb = require('./db');

function Diary(name,title,diary){
    this.name = name;
    this.title = title;
    this.diary = diary;
}

module.exports = Diary;

// 保存日记
Diary.prototype.save = function(callback){
    var date = new Date()
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        second: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
        + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + date.getSeconds()
    }

    var diary = {
        name: this.name,
        title : this.title,
        time: time,
        diary: this.diary,
        comments: [],
        pv: 0,
        id: 0
    }

    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('diarys',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.insert(diary,{safe : true},function(err){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                return callback(null)
            })
        })
    })
}

// 获取所有日记
Diary.getAll = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err)
        }
        db.collection('diarys', function (err, collection) {
            if (err) {
                mongodb.close()
                return callback(err)
            }
            collection.find().sort({ time : -1 }).toArray(function (err, docs) {
                mongodb.close()
                if (err) {
                    return callback(err)
                }
                return callback(null, docs)
            })
        })
    });
}

// 获取某一篇日记
Diary.getOne = function(name,title,second,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('diarys',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.findOne({"name":name,"title":title,"time.second":second},function(err,diary){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                return callback(null,diary)
            })
        })
    })
}