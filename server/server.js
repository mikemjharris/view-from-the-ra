const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//database setup
const port = process.env.PORT || 3000;
console.log(process.env.MONGODB_URI);
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = 'view-from-the-ra'
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(mongoUri, (err, client) => {
  if (err) return console.log(err)
  const db = client.db(dbName);
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
  app.use(express.static(path.join(__dirname, '../public'),  {maxAge: "30d"}));

  // set the view engine to ejs
  app.set('view engine', 'ejs')

  // attach db to the req
  app.use((req,res,next) => {
    req.db = db;
    next();
  });

  require('./routes/main')(app);

  // redirect everything not in main 
  app.get('*', function ( req, res, next ) {
    res.redirect('../');
  });

  app.use((req, res, next ) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use(( err, req, res ) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  app.use(( err, req, res ) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  app.set('port', process.env.PORT || 8001);

  var server = app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + server.address().port);
  });
})
