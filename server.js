var path = require('path');

var express = require('express');
var app = express();

var multer = require('multer');

var upload = multer({dest: './uploads'});

let isDev =
    () => {
      let args = process.argv;

      let argLength = args.length;

      if (argLength < 3) {
        return false;
      }
      if (args[2] === 'dev') {
        return true;
      }
      return false;
    }

if (isDev()) {
  var webpack = require('webpack');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackDevConfig = require('./config/webpack.dev');

  app.use(webpackDevMiddleware(
      webpack(webpackDevConfig()),
      {stats: {colors: true}, watchOptions: {aggregateTimeout: 300, poll: 1000}}));
}
else {
  app.use(express.static(path.join(__dirname, 'dist')));
}

var projectConfig = {
  keyFilename: './cookbookdemo-6bde5-firebase-adminsdk-068b6-c17f1ec76e.json',
  projectId: 'cookbookdemo-6bde5'
};

var firebase = require('firebase');
var firebaseApp = firebase.initializeApp(projectConfig);

var gcloud = require('google-cloud')(projectConfig);

var gcs = gcloud.storage();
var bucket = gcs.bucket('cookbookdemo-6bde5.appspot.com');

var readConfig = {action: 'read', expires: '03-17-2025'};

app.post('/api/upload/avatar', (req, res) => {
  let singleUpload = upload.single('file');
  singleUpload(req, res, (err) => {
    if (err) {
      console.log(err);
    }

    let file = req.file;

    bucket.upload(file.path, (err, file) => {
      if (err) {
        console.log(err);
      }

      console.log(file);

      file.getSignedUrl(readConfig, (err, url) => {
        if (err) {
          console.log(err);
        }
        console.log(url);
        res.status(200).end();
      });
    });


  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000.');
});
