var http = require('http');
var express = require('express');
var session = require('express-session');
var cors = require('cors');
var bodyParser = require('body-parser');
var auth = require('./auth.js');
var router = require('./route.js');

var app = express();
var server = http.createServer(app);

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'fiber_breaker'
}));
app.use(auth());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', router.router);

server.listen(3000);