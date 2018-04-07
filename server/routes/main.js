module.exports = function ( app ) {

  
  app.get('/instagram', function( req, res ) {
    const db = req.db;
    db.collection('instagram').find().toArray(function (err, instagram) {
          res.json({"hello": 1});
    });
  });
};
