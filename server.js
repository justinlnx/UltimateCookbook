var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

var multer = require('multer');

var upload = multer({dest: './uploads'});

let isDev = () => {
  let args = process.argv;

  let argLength = args.length;

  if (argLength < 3) {
    return false;
  }
  if (args[2] === 'dev') {
    return true;
  }
  return false;
};

if (isDev()) {
  var webpack = require('webpack');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackDevConfig = require('./config/webpack.dev');

  app.use(webpackDevMiddleware(
      webpack(webpackDevConfig()),
      {stats: {colors: true}, watchOptions: {aggregateTimeout: 300, poll: 1000}}));
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
}

var projectConfig = {
  keyFilename: './cookbookdemo-6bde5-firebase-adminsdk-068b6-c17f1ec76e.json',
  projectId: 'cookbookdemo-6bde5'
};

var firebaseAdmin = require('firebase-admin');
var serviceAccount = require('./cookbookdemo-6bde5-firebase-adminsdk-068b6-c17f1ec76e.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://cookbookdemo-6bde5.firebaseio.com'
});

var db = firebaseAdmin.database();

const CHATROOMS_URL = 'chats';

var gcloud = require('google-cloud')(projectConfig);

var gcs = gcloud.storage();
var bucket = gcs.bucket('cookbookdemo-6bde5.appspot.com');

var readConfig = {action: 'read', expires: '03-17-2025'};

app.post('/api/upload/image/single', (req, res) => {
  let singleUpload = upload.single('file');
  singleUpload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.send(err).status(500).end();
    }

    let file = req.file;

    bucket.upload(file.path, (err, uploadedFile) => {
      if (err) {
        console.log(err);
        res.send(err).status(500).end();
      }

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });

      uploadedFile.getSignedUrl(readConfig, (err, url) => {
        if (err) {
          console.log(err);
          res.send(err).status(500).end();
        }
        res.send(url).end();
      });
    });
  });
});

var chatNamespace = io.of('/chat');

var chatsRef = db.ref(CHATROOMS_URL);

var retrieveChatsCallback = (userId, namespace) => {
  return (snapShot) => {
    let userChatrroms = [];

    let chatrooms = snapShot.val();

    for (let index in chatrooms) {
      let chatroom = chatrooms[index];

      if (chatroom.users.find(((user) => user === userId))) {
        chatroom.$key = index;
        userChatrroms.push(chatroom);
      }
    }

    namespace.emit(`chatrooms+${userId}`, userChatrroms);
  };
};

chatNamespace.on('connection', (socket) => {
  console.log('User joined chat namespace.');

  socket.on('register', (data, listener) => {
    listener('ack');
    let userId = data.userId;

    console.log(`User ${userId} registered for chat.`);

    let userChatsCallback = retrieveChatsCallback(userId, chatNamespace);
    chatsRef.on('value', userChatsCallback);

    socket.on(`new chat+${userId}`, (data) => {
      let otherUserId = data.other;

      chatsRef.push().set({users: [userId, otherUserId], messages: []});
    });

    socket.on('disconnect', () => {
      chatsRef.off('value', userChatsCallback);
    });
  });
});

// io.on('connection', (socket) => {

//   console.log(socket);

//   socket.on('register', (userId) => {
//     console.log(`User ${userId} registered.`);
//   });
// });

http.listen(3000, () => {
  console.log('Server started on port 3000.');
});
