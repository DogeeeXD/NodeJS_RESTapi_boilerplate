import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import os from 'os';
const rfs = require("rotating-file-stream");

// Initialize
const app = express();

// Set Express to parse json formatted body from requests
app.use(bodyParser.json());

// Require passport config file
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());

// Enable CORS
app.use(cors({origin: '*'}));

// Setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// Create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});

// Define a port number for listening
let port = process.env.PORT || 8080;

// Create a server that listens to port
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

// Default route (Check connection success)
app.get('/api', (req, res) => res.send('Connection to api success!'));

// Require API routes here
require('./routes/user.js')(app);
require('./routes/product.js')(app);

// show current computer name
const computerName = os.hostname();
console.log(computerName);

export {
  accessLogStream
}









