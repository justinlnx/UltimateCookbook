var path = require('path');

var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(3000, () => {
  console.log('Server started on port 3000.');
});
