var express = require("express");
var serveIndex = require("serve-index");
var cors = require("cors");
var app = express();
const port = 3001;
app.use(cors())

app.use('/ftp', express.static('public/ftp'), serveIndex('public/ftp', {'icons': true, 'view': 'details'}))


app.listen(port, function () {
  console.log("listening to port " + port);
});

