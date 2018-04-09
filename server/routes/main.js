
const instagramData = require('../data/instagram.json');
const instagramAllImagesData = require('../data/instagram-all-images.json');

module.exports = function ( app ) {
  
  app.get('/instagram', function( req, res ) {
    const db = req.db;
    
    db.collection('instagram-all').findOne({}, (err, instagram) => {
         res.json(instagram);
    });
  });
 
  app.get('/instagram-images-all', function( req, res ) {
    const db = req.db;
    
    res.json(instagramAllImagesData.data.user.edge_owner_to_timeline_media);
  });

  app.get('/instagram-images', function( req, res ) {
    const db = req.db;
    
    res.json(instagramData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media);
  });
  
  app.get('/instagram-app', function( req, res ) {
    const db = req.db;
    const initialImages =  instagramData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges
    const subsequentImages = instagramAllImagesData.data.user.edge_owner_to_timeline_media.edges
    const images = initialImages.concat(subsequentImages);
    res.render('images', { "title": "title", "images": images});
  });
};
