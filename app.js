express = require('express');
path = require('path');
favicon = require('serve-favicon');
logger = require('morgan');
cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
jwt=require('jsonwebtoken');
mongoose = require('mongoose');
mongoose.Promise = global.Promise;
async = require("async");

app = express();
router = express.Router();
fs = require('fs');

config=require('./app/utils/config');
app.set('superSecret',config.secret);
// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(config.database);
//objects
User = require('./app/models/user');
Note = require('./app/models/note');
Tag =require('./app/models/tag');

require('./app/routes/index.route')(router);

router.get('/', function (req, res) {
  res.json(new ApiResponse(true, 'Server is running!', null));
});


// middleware to use for all requests
router.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token ||req.header('Authorization')|| req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({success: false, message: 'Failed to authenticate token.'});
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});


//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//// error handlers
//
//// development error handler
//// will print stacktrace
//app.set('env','development')
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});



fs.readdirSync('./app/routes').forEach(function (file) {
  if (file.substr(-3) == '.js' && file != 'index.js') {
    require('./app/routes/' + file)(router);
  }
});
app.use('/', router);


module.exports=app;
