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
  var cookie;
  var url;

  var initialData;

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      body.toString().split(/\n/).forEach((line) => {
        if (line && /sharedData/.test(line)) {
          line = line.replace(/.* =/, "")
          line = line.replace(/;<\/script>/, "")
          initialData = JSON.parse(line);
          console.log('Initial data');
          db.collection('instagram-init').insert(initialData, (err, result) => {
            if (err) return console.log(err);

          })
        }
      })
    }
  }

  //request(options, callback);


  console.log('Now running the rest');

  (async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
  function callback(error, response, body) {
    console.log(response.body);
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
    console.log('about to call');
    await page.setRequestInterception(true);

    page.on('request', req => {
      url = req.url().toString();
      if (url.search("query_hash") > -1) {    
        url = req.url().toString();
      //  console.log(url); 
      }  
      req.continue();
    });
    
    page.on('response', response => {
      var urlw = response.url().toString();
      if (urlw.search("query_hash") > -1) {    
          console.log('here');
          console.log(response.url());
          response.text().then((text) => { console.log(text);});
      }
    })

    const timeout = ms => new Promise(res => setTimeout(res, ms))

    await page.goto('https://www.instagram.com/mikemjharris');
    cookie = await page.evaluate(() => document.cookie);
    console.log('cookie', cookie);
    console.log('page loaded')
    await page.hover('footer');
    await timeout(1000);
    await page.hover('h1');
    await timeout(1000);
    console.log('hover footer again');
    await page.hover('footer');
    await timeout(5000);

    await browser.close();
    console.log('finished');
    return
  })();
});
