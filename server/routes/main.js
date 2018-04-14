
module.exports = function ( app ) {
  
  app.get('/images', function( req, res ) {
    const db = req.db;
    
    db.collection('images').find({}).sort({"_id":-1}).limit(1).toArray((err, images) => {
        res.json(images[0].images);
    });
  });
  
  app.get('/instagram-app', function( req, res ) {
    const db = req.db;
    //db.collection('images').findOne({}, (err, images) => {
    db.collection('images').find({}).sort({"_id":-1}).limit(1).toArray((err, images) => {
        res.render('images', { "title": "title", "images": images[0].images});
    });
  });
  
  app.get('/ra', function( req, res ) {
		res.render('ra', { "title": "title"});
	});
  app.get('/instagram-app-svg', function( req, res ) {
    const db = req.db;
    //db.collection('images').findOne({}, (err, images) => {
    db.collection('images').find({}).sort({"_id":-1}).limit(1).toArray((err, images) => {
        res.render('images-svg', { "title": "title", "images": images[0].images});
    });
	});
};
