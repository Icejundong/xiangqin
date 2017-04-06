const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo')(session);

var settings = require('./settings');


var app = express();

app.use(favicon(path.join(__dirname, 'wwwroot', 'favicon.ico')));
app.use(express.static('wwwroot'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret : settings.cookieSecret,
    key : settings.db,
    cookie : {maxAge : 1000 * 60 * 60 * 24 * 30},
    store : new MongoStore({
        url : "mongodb://localhost/xiangqin"
    })
}))

var routes = require('./routes/index');
routes(app)

app.listen(3000,function(){
    console.log('服务器运行ing....')
})