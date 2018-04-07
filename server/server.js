const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//database setup
const mongo = require('mongoskin');
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost:27017/mikenode4";
const MongoClient = require('mongodb').MongoClient

var db;
MongoClient.connect(mongoUri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('star-wars-quotes')
  const app = express();


  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.engine('html', require('ejs').renderFile);

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../dist')));

  // set the view engine to ejs
  app.set('view engine', 'ejs')

  // attach db to the req
  app.use(function(req,res,next){
    req.db = db;
    next();
  });

  require('./routes/main')(app);

  // blog home page
  app.get('/', (req, res) => {
    // render `home.ejs` with the list of posts
    res.render('home', { data: { title: 'My Seed Project'}})
  })


  // displays static main.html
  app.get('*', function ( req, res, next ) {
    console.log('hey');
    res.redirect('../');
  });

  app.use(function (req, res, next ) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use(function ( err, req, res ) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  app.use(function ( err, req, res ) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  app.set('port', process.env.PORT || 8001);

  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
})
