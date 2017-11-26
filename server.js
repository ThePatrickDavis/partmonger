const express        = require('express');
const bodyParser     = require('body-parser');
const db             = require('diskdb');
const app            = express();

const port = 9001;

app.use(bodyParser.json());
app.use(express.static('public'))

db.connect('./db', ['parts', 'inventory']);
require('./app/routes')(app, db);

app.listen(port, () => {
  console.log('We are live on ' + port);
});