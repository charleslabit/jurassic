var express = require("express");
var serveIndex = require("serve-index");
var cors = require("cors");
var app = express();
const port = 3001;
app.use(cors())
// Serve URLs like /ftp/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
app.use('/ftp', express.static('public/ftp'), serveIndex('public/ftp', {'icons': true, 'view': 'details'}))

// Listen
// app.listen(3001)
app.listen(port, function () {
  console.log("listening to port " + port);
});

// todo
// npm i directory-tree
// npm i serve-index
// npm i serve