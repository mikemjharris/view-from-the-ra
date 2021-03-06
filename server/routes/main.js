module.exports = ( app ) => {

  app.get('/images', ( req, res ) => {
    const db = req.db;
    db.collection('images').find({}).sort({"_id":-1}).limit(1).toArray((err, images) => {
        res.json(images[0].images);
    });
  });

  app.get('/', ( req, res ) => {
    const db = req.db;
    db.collection('images').find({}).sort({"_id":-1}).limit(1).toArray((err, images) => {
			  filteredImages = images[0].images.reduce((arr, image) => {
					if ( image.edge_media_to_caption.edges.length > 0 && image.edge_media_to_caption.edges[0].node.text.toLowerCase().indexOf('viewfromthera') > -1 ) {
						arr.push(image);
					}
					return arr
				}, []);
        res.render('home', {  "images": filteredImages});
    });
	});
};
