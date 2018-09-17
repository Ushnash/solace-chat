const express = require('express');
const sapui5 = require('sapui5-runtime');
const path = require('path');
const app=express();


//app.use('/resources',express.static(sapui5));
//app.use('/WebContent',express.static('WebContent'));
app.use('/solchat',express.static('WebContent/solchat'));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/WebContent/index.html'));
})

app.listen(3000);
