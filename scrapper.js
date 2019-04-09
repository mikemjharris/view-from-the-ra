'use strict';

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MongoClient = require('mongodb').MongoClient
const dbName = 'view-from-the-ra'
const puppeteer = require('puppeteer');

let list_of_promises = [];

(async() => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const timeout = ms => new Promise(res => setTimeout(res, ms))

  var url_to_visit = 'https://www.instagram.com/mikemjharris/';

  page.on('response', response => {
    var url = response.url().toString();

    if (url.search("query_hash") > -1 && url.search("first") > -1) {
      console.log('Ajax call');
      console.log(response.url());
      list_of_promises.push(response.text().then((text) => {
        return Promise.resolve(JSON.parse(text).data.user.edge_owner_to_timeline_media.edges);
      }));
    }
  })

  await page.goto(url_to_visit);
  console.log('Getting initial page data with images');
  let initialData = await page.evaluate(() => window._sharedData);
  list_of_promises.push(initialData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges);

  for (var i = 0; i < 15; i++) {
    await timeout(1000);
    await page.hover('footer');
    await timeout(1000);
    await page.hover('h1');
   }

  await timeout(5000);

  console.log('Finished navigating');

  var res = await Promise.all(list_of_promises);
  var images = [].concat.apply([], res).map((item) => { return item.node });
  MongoClient.connect(mongoUri, (err, client) => {
    if (err) return console.log(err)
    const db = client.db(dbName)
    if (images.length > 0 ) {
      db.collection('images').insert({ 'images': images } , (err, result) => {
          if (err) return console.log(err);
          console.log('Images added to db');
      })
    }
    client.close();
  });

  await browser.close();

  console.log('Complete');
})();


