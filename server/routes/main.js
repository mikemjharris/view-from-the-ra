
const instagramData = require('../data/instagram.json');
module.exports = function ( app ) {
  
  app.get('/instagram', function( req, res ) {
    const db = req.db;
    
    db.collection('instagram').find().toArray(function (err, instagram) {
         res.json(instagramData);
    });
  });
 

  app.get('/instagram-images', function( req, res ) {
    const db = req.db;
    
    res.json(instagramData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media);
  });
  
  app.get('/instagram-app', function( req, res ) {
    const db = req.db;
    
    res.render('images', { "title": "title", "images": instagramData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges});
  });
};
