View from the RA
========================

See the app running in production:  [view-from-the-ra](https://view-from-the-ra.mikemjharris.com)

Project to show pictures I've taken at the RA as well as from other arts organisations.

All tagged posts are here: https://www.instagram.com/explore/tags/viewfromthera/

My instagram page https://www.instagram.com/mikemjharris/

You need mongodb installed and running (on port 27017). 

`npm install`  
`npm run all`

Runs app on port 8001

Once running to seed the database run `node scrapper.js` - this crawls instagram and inserts pics into the db.  I do it for my user and my pics as they're mine.  I'd suggest doing the same.  This is for a fun side project so please don't use it for anything official.


## Docker
The app works with docker - there's a docker compose file setting up the app and mongodb.

Run `docker-compose up`

The app runs on port 8001.




