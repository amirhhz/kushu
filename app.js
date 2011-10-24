
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var routes = require("./routes");
var models = require("./models");

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.enable('jsonp callback');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'hushu' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.use(express.logger("dev"));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.dynamicHelpers({
	session: function (req, res) {
		return req.session;
	},
	messages: require('express-messages')
});

app.models = models;

// Routes
routes(app);

var port = (process.argv.length > 2) ? process.argv[2] : 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);