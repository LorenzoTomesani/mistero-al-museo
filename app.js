const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;
app.use(cors());

var server = require( __dirname+'/server/server.js');

app.use('/favicon',express.static(__dirname+'/favicon'));
app.use('/stories',express.static(__dirname+'/server/publishedStories'));
app.use('/images',express.static(__dirname+'/server/images'));
app.use('/player',express.static(__dirname+'/player'));
app.use('/editor',express.static(__dirname+'/editor'));
app.use('/valutatore',express.static(__dirname+'/evaluator'));
app.use('/server',server);

app.get('/', function (req, res) {
  res.send('hello world');
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})