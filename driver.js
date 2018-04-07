'use strict';

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost:27017";
const dbName = 'view-from-the-ra'
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(mongoUri, (err, client) => {
  if (err) return console.log(err)
  const db = client.db(dbName)

  const puppeteer = require('puppeteer');
  const request = require('request');

  const options = {
    url: 'https://www.instagram.com/mikemjharris/',
    headers: {
      'cookie': 'ig_pr='
    }
  }

  var initialData;

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      body.toString().split(/\n/).forEach((line) => {
        if (line && /sharedData/.test(line)) {
          line = line.replace(/.* =/, "")
          line = line.replace(/;<\/script>/, "")
          initialData = JSON.parse(line);
          console.log(initialData);
          db.collection('instagram-init').insert(initialData, (err, result) => {
            if (err) return console.log(err);

          })
        }
      })
    }
  }

  request(options, callback);

  function callback2(error, response, body) {
    if (!error && response.statusCode == 200) {
      var remainingImages = JSON.parse(body);
      return db.collection('instagram-all').insert(remainingImages, (err, result) => {
        console.log('inserted');
        if (err) return console.log(err);
        return result;
      });

    } else {
      console.log(error);
    }
  }


  (async() => {
    var a = false;
    var url;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const makeRequest = require('request');

    await page.setRequestInterception(true);
    page.on('request', request => {
      if (a) {
        url = request.url().toString();
        const options2 = {
          url: url, 
          headers: {
            'cookie': 'ig_pr='
          }
        };
        return makeRequest(options2, callback2);
      }  
      request.continue();
    });
    await page.goto('https://www.instagram.com/mikemjharris');

    console.log('page loaded')

    a = true; 

    await page.hover('footer');

    await browser.close();
  })();
});
