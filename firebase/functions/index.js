const functions = require('firebase-functions');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
//console.log(serviceAccount);
// Initialize Firebase
const config = {
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyAPU0mhCLENMKPf-Hvqp5oX2emD1foll0c",
  authDomain: "lighthouse-inspection.firebaseapp.com",
  databaseURL: "https://lighthouse-inspection.firebaseio.com",
  projectId: "lighthouse-inspection",
  storageBucket: "lighthouse-inspection.appspot.com",
  messagingSenderId: "238016184191"
};
admin.initializeApp(config);
const storage = admin.storage().bucket();
const db = admin.database();

const today = new Date();
console.log(today);
const year = today.getFullYear().toString();
const month = ("0"+(today.getMonth() + 1)).slice(-2).toString();
const day = ('0'+today.getDate()).slice(-2).toString();
const hour = ('0'+today.getHours()).slice(-2).toString();
const minute = ('0'+today.getMinutes()).slice(-2).toString();

var Test_URL = ['https://airhorner.com/'];

//HTTPS trigger LightHouse function and put results to Strage
 exports.LH = functions.https.onRequest((request, response) => {
  function launchChromeAndRunLighthouse(url, opts, config = null) {
    return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => {
        // use results.lhr for the JS-consumeable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/typings/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
        return chrome.kill().then(() => results).catch(function(e){console.log(e);})
      }).catch(function(e) {
        console.log(e); // "oh, no!"
      });
    }).catch(function(e) {
      console.log(e); // "oh, no!"
    });
  }
  const opts_json = {
    chromeFlags: ['--headless']
    //,output: ['html']
  };
  const opts_html = {
    chromeFlags: ['--headless']
    ,output: ['html']
  };

  // JSON report
  Test_URL.forEach(function( value ){
    launchChromeAndRunLighthouse(value, opts_json).then(results => {
      console.log(value);
      // Use results!
      //js object to json
      var results_json = JSON.stringify(results.report);
      //console.log(results_json);
      //console.log(results_json.length);
      //convert to bytefile
      var results_json_byte = [];
      for(var i = 0; i < results_json.length; i++){
        results_json_byte[i] = results_json.charCodeAt(i);
      }
      //console.log(results_json_byte);
      //convert to Uint8Array
      var results_json_byte_U = new Uint8Array(results_json_byte);
      //console.log(results_json_byte_U);
      //upload files to storage
      // Create a storage reference from our storage service
      var split_value = value.split('/');
      console.log(split_value[2]);
      var filename = '/json/'+ year + month + day + '/'+ hour + minute + '/' + split_value[2] + '.json';

      var db_path = db.ref('json/'+year+month+day+'/'+hour+minute);
      db_path.set({
        file_name: split_value[2]+'.json',
        speedindex: '10ms',
        pwa: '50'
      }).catch(function(e) {
        console.log(e); // "oh, no!"
      });

      var file = storage.file(filename);
      //upload file
      file.save(results_json_byte_U,function(err){
        if(!err){
          console.log('success');
        }
      });
    }).catch(function(e) {
      console.log(e); // "oh, no!"
    });
  });
  // HTML report
  Test_URL.forEach(function( value ){
    launchChromeAndRunLighthouse(value, opts_html).then(results => {
      console.log(value);
      // Use results!
      var results_html = results.report;
      //convert to bytefile
      var results_html_byte = [];
      for(var i = 0; i < results_html[0].length; i++){
        results_html_byte[i] = results_html[0].charCodeAt(i);
      }
      //convert to Uint8Array
      var results_html_byte_U = new Uint8Array(results_html_byte);
      //upload files to storage
      // Create a storage reference from our storage service
      var split_value = value.split('/');
      //console.log(split_value[2]);
      var filename = '/html/'+ year + month + day + '/'+ hour + minute + '/' + split_value[2] + '.html';

      var db_path = db.ref('html/'+year+'年'+month+'月'+day+'日'+'/'+hour+'時'+minute+'分');
      db_path.set({
        report: year+'年'+month+'月'+day+'日'+hour+'時'+minute+'分'+split_value[2]+'レポート',
        path: filename
      }).catch(function(e) {
        console.log(e); // "oh, no!"
      });

      var file = storage.file(filename);
      //upload file
      file.save(results_html_byte_U,function(err){
        if(!err){
          console.log('success');
        }
      });
    }).catch(function(e) {
      console.log(e); // "oh, no!"
    });
  });
  //response.send("Hello from Firebase!");
 });

